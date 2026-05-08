import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { json } from "react-router";
import { getActiveQuiz, saveQuizResult } from "../models/quiz.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return json({ error: "Shop parameter required" }, { status: 400 });
  }

  const quiz = await getActiveQuiz(shop);

  if (!quiz) {
    return json({ quiz: null, message: "No active quiz found" });
  }

  return json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options,
      })),
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json();
  const { quizId, answers, email, shop } = data;

  if (!quizId || !answers || !shop) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  const recommendedProducts = await getProductRecommendations(shop, answers);

  const result = await saveQuizResult(quizId, {
    email,
    answers,
    products: recommendedProducts.map((p: any) => p.id),
  });

  return json({
    success: true,
    resultId: result.id,
    products: recommendedProducts,
  });
};

async function getProductRecommendations(shop: string, answers: { questionId: string; selectedOptions: string[] }[]) {
  const allAnswers = answers.flatMap((a) => a.selectedOptions);

  const knowledgeItems = await db.knowledgeItem.findMany({
    where: {
      shop,
      type: "product",
    },
    take: 20,
  });

  const products = knowledgeItems
    .map((item) => {
      try {
        return { id: item.sourceId, ...JSON.parse(item.content) };
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  if (allAnswers.some((a) => a.toLowerCase().includes("gift"))) {
    return products.filter((p: any) => p.tags?.some((t: string) => t.toLowerCase().includes("gift") || t.toLowerCase().includes("present"))).slice(0, 5) ||
      products.slice(0, 5);
  }

  if (allAnswers.some((a) => a.toLowerCase().includes("budget") || a.toLowerCase().includes("cheap") || a.toLowerCase().includes("affordable"))) {
    return [...products].sort((a: any, b: any) => (a.price || 0) - (b.price || 0)).slice(0, 5);
  }

  if (allAnswers.some((a) => a.toLowerCase().includes("premium") || a.toLowerCase().includes("luxury") || a.toLowerCase().includes("expensive"))) {
    return [...products].sort((a: any, b: any) => (b.price || 0) - (a.price || 0)).slice(0, 5);
  }

  if (allAnswers.some((a) => a.toLowerCase().includes("sport") || a.toLowerCase().includes("active") || a.toLowerCase().includes("fitness"))) {
    return products.filter((p: any) => p.tags?.some((t: string) => t.toLowerCase().includes("sport") || t.toLowerCase().includes("active") || t.toLowerCase().includes("fitness"))).slice(0, 5) ||
      products.slice(0, 5);
  }

  return products.slice(0, 5);
}