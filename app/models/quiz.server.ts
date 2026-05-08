import db from "../db.server";
import type { Quiz, QuizQuestion } from "@prisma/client";

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