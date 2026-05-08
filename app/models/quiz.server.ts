import db from "../db.server";
import type { Quiz, QuizQuestion } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type QuizWithQuestions = Quiz & {
  questions: QuizQuestion[];
};

export async function getQuizzes(shop: string) {
  return db.quiz.findMany({
    where: { shop },
    include: { questions: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getQuiz(id: string, shop: string) {
  return db.quiz.findFirst({
    where: { id, shop },
    include: { questions: { orderBy: { order: "asc" } } },
  });
}

export async function getActiveQuiz(shop: string) {
  return db.quiz.findFirst({
    where: { shop, active: true },
    include: { questions: { orderBy: { order: "asc" } } },
  });
}

export async function createQuiz(shop: string, data: { title: string; description?: string }) {
  return db.quiz.create({
    data: {
      shop,
      title: data.title,
      description: data.description,
      questions: {
        create: [],
      },
    },
    include: { questions: true },
  });
}

export async function updateQuiz(id: string, shop: string, data: { title?: string; description?: string; active?: boolean }) {
  return db.quiz.update({
    where: { id },
    data,
    include: { questions: { orderBy: { order: "asc" } } },
  });
}

export async function deleteQuiz(id: string, shop: string) {
  return db.quiz.delete({
    where: { id, shop },
  });
}

export async function addQuestion(quizId: string, shop: string, data: { question: string; type?: string; options: any; order?: number }) {
  const quiz = await db.quiz.findFirst({ where: { id: quizId, shop } });
  if (!quiz) throw new Error("Quiz not found");

  return db.quizQuestion.create({
    data: {
      quizId,
      question: data.question,
      type: data.type || "single",
      options: data.options,
      order: data.order ?? 0,
    },
  });
}

export async function updateQuestion(id: string, quizId: string, shop: string, data: { question?: string; type?: string; options?: any; order?: number }) {
  const question = await db.quizQuestion.findFirst({
    where: { id, quizId },
    include: { quiz: true },
  });
  if (!question || question.quiz.shop !== shop) throw new Error("Question not found");

  return db.quizQuestion.update({
    where: { id },
    data,
  });
}

export async function deleteQuestion(id: string, quizId: string, shop: string) {
  const question = await db.quizQuestion.findFirst({
    where: { id, quizId },
    include: { quiz: true },
  });
  if (!question || question.quiz.shop !== shop) throw new Error("Question not found");

  return db.quizQuestion.delete({ where: { id } });
}

export async function reorderQuestions(quizId: string, shop: string, questionIds: string[]) {
  const quiz = await db.quiz.findFirst({ where: { id: quizId, shop } });
  if (!quiz) throw new Error("Quiz not found");

  const updates = questionIds.map((id, index) =>
    db.quizQuestion.update({ where: { id }, data: { order: index } })
  );

  return db.$transaction(updates);
}

export async function saveQuizResult(quizId: string, data: { email?: string; answers: any; products?: string[] }) {
  return db.quizResult.create({
    data: {
      quizId,
      email: data.email,
      answers: data.answers,
      products: data.products,
    },
  });
}

export async function getQuizResults(shop: string, limit = 100) {
  const results = await db.quizResult.findMany({
    where: { quiz: { shop } },
    include: { quiz: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return results;
}

export async function getQuizStats(shop: string) {
  const [totalQuizzes, activeQuizzes, totalResults, uniqueEmails] = await Promise.all([
    db.quiz.count({ where: { shop } }),
    db.quiz.count({ where: { shop, active: true } }),
    db.quizResult.count({ where: { quiz: { shop } } }),
    db.quizResult.groupBy({
      by: ["email"],
      where: { quiz: { shop }, email: { not: null } },
      _count: true,
    }),
  ]);

  return {
    totalQuizzes,
    activeQuizzes,
    totalCompletions: totalResults,
    uniqueLeads: uniqueEmails.length,
  };
}

export async function generateQuizRecommendations(
  quizTitle: string,
  quizDescription: string,
  answers: { question: string; selectedOptions: string[] }[],
  availableProducts: { id: string; title: string; description: string; price: number; handle: string; tags?: string[] }[]
): Promise<{ products: typeof availableProducts; reasoning: string }> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const answersText = answers
    .map((a) => `Q: ${a.question}\nA: ${a.selectedOptions.join(", ")}`)
    .join("\n\n");

  const productsText = availableProducts
    .map(
      (p) =>
        `ID: ${p.id}\nTitle: ${p.title}\nDescription: ${p.description}\nPrice: ${p.price}\nTags: ${(p.tags || []).join(", ")}`
    )
    .join("\n\n---\n\n");

  const prompt = `
You are a product recommendation engine for a Shopify store.
Based on the customer's quiz answers, recommend the most relevant products from the catalog.

QUIZ: ${quizTitle}
${quizDescription ? `Description: ${quizDescription}` : ""}

CUSTOMER ANSWERS:
${answersText}

AVAILABLE PRODUCTS:
${productsText}

INSTRUCTIONS:
1. Analyze the customer's answers to understand their needs/preferences.
2. Select the 3-5 most relevant products from the catalog.
3. Return a JSON response with:
   - "productIds": array of product IDs (from the available products list)
   - "reasoning": brief explanation of why these products were recommended

RESPONSE FORMAT (valid JSON only):
{
  "productIds": ["id1", "id2", "id3"],
  "reasoning": "Based on your preference for X and Y, we recommend these products..."
}
`.trim();

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;

    const parsed = JSON.parse(jsonStr);
    const recommendedProducts = availableProducts.filter((p) =>
      (parsed.productIds || []).includes(p.id)
    );

    return {
      products: recommendedProducts.length > 0 ? recommendedProducts : availableProducts.slice(0, 5),
      reasoning: parsed.reasoning || "Here are some products you might like.",
    };
  } catch (e) {
    console.error("Failed to parse AI quiz recommendation:", e);
    return {
      products: availableProducts.slice(0, 5),
      reasoning: "Here are some popular products you might like.",
    };
  }
}