import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getActiveQuiz, saveQuizResult } from "../models/quiz.server";
import { generateQuizRecommendations } from "../models/quiz.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const shop = session.shop;

  const quiz = await getActiveQuiz(shop);

  if (!quiz) {
    return new Response(JSON.stringify({ quiz: null, message: "No active quiz found" }));
  }

  return new Response(JSON.stringify({
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
  }));
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const shop = session.shop;

  const data = await request.json();
  const { quizId, answers, email } = data;

  if (!quizId || !answers) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const quiz = await db.quiz.findFirst({
    where: { id: quizId, shop },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!quiz) {
    return new Response(JSON.stringify({ error: "Quiz not found" }), { status: 404 });
  }

  const knowledgeItems = await db.knowledgeItem.findMany({
    where: { shop, type: "PRODUCT" },
  });

  const availableProducts: { id: string; title: string; description: string; price: number; handle: string; tags?: string[] }[] =
    knowledgeItems
      .map((item) => {
        try {
          const metadata = JSON.parse(item.metadata || "{}");
          return {
            id: item.sourceId,
            title: String(metadata.title || ""),
            description: String(item.content || ""),
            price: Number(metadata.price || 0),
            handle: String(metadata.handle || ""),
            tags: String(metadata.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
          };
        } catch {
          return null;
        }
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

  const formattedAnswers = answers.map((a: any) => {
    const question = quiz.questions.find((q: any) => q.id === a.questionId);
    return {
      question: question?.question || "Unknown question",
      selectedOptions: a.selectedOptions,
    };
  });

  const { products: recommendedProducts, reasoning } = await generateQuizRecommendations(
    quiz.title,
    quiz.description || "",
    formattedAnswers,
    availableProducts
  );

  const result = await saveQuizResult(quizId, {
    email,
    answers,
    products: recommendedProducts.map((p: any) => p.id),
  });

  return new Response(JSON.stringify({
    success: true,
    resultId: result.id,
    products: recommendedProducts.map((p: any) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      price: p.price,
      featuredImage: p.featuredImage,
      currencyCode: "USD",
    })),
    reasoning,
  }));
};
