import { useLoaderData, useFetcher } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getQuizzes, getQuizStats, createQuiz, updateQuiz, deleteQuiz, addQuestion, updateQuestion, deleteQuestion, reorderQuestions } from "../models/quiz.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const [quizzes, stats] = await Promise.all([
    getQuizzes(shop),
    getQuizStats(shop),
  ]);

  return { quizzes, stats, shop };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  switch (intent) {
    case "create-quiz": {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const quiz = await createQuiz(shop, { title, description });
      return { success: true, quiz };
    }

    case "update-quiz": {
      const id = formData.get("id") as string;
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const active = formData.get("active") === "true";
      const quiz = await updateQuiz(id, shop, { title, description, active });
      return { success: true, quiz };
    }

    case "delete-quiz": {
      const id = formData.get("id") as string;
      await deleteQuiz(id, shop);
      return { success: true };
    }

    case "add-question": {
      const quizId = formData.get("quizId") as string;
      const question = formData.get("question") as string;
      const type = formData.get("type") as string;
      const options = JSON.parse(formData.get("options") as string);
      const q = await addQuestion(quizId, shop, { question, type, options });
      return { success: true, question: q };
    }

    case "update-question": {
      const id = formData.get("id") as string;
      const quizId = formData.get("quizId") as string;
      const question = formData.get("question") as string;
      const type = formData.get("type") as string;
      const options = JSON.parse(formData.get("options") as string);
      const q = await updateQuestion(id, quizId, shop, { question, type, options });
      return { success: true, question: q };
    }

    case "delete-question": {
      const id = formData.get("id") as string;
      const quizId = formData.get("quizId") as string;
      await deleteQuestion(id, quizId, shop);
      return { success: true };
    }

    case "reorder-questions": {
      const quizId = formData.get("quizId") as string;
      const questionIds = JSON.parse(formData.get("questionIds") as string);
      await reorderQuestions(quizId, shop, questionIds);
      return { success: true };
    }

    default:
      return { success: false, error: "Unknown action" };
  }
};

export default function QuizDashboard() {
  const { quizzes, stats, shop } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [selectedQuiz, setSelectedQuiz] = React.useState<any>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  return (
    <ui-page title="AI Quiz Builder">
      <div style={{ padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <ui-card>
            <div style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#008060" }}>{stats.totalQuizzes}</div>
              <div style={{ fontSize: "14px", color: "#666" }}>Total Quizzes</div>
            </div>
          </ui-card>
          <ui-card>
            <div style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#008060" }}>{stats.activeQuizzes}</div>
              <div style={{ fontSize: "14px", color: "#666" }}>Active</div>
            </div>
          </ui-card>
          <ui-card>
            <div style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#008060" }}>{stats.totalCompletions}</div>
              <div style={{ fontSize: "14px", color: "#666" }}>Completions</div>
            </div>
          </ui-card>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600" }}>Your Quizzes</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ background: "#008060", color: "white", border: "none", padding: "10px 16px", borderRadius: "4px", cursor: "pointer" }}
          >
            + Create New Quiz
          </button>
        </div>

        {quizzes.length === 0 ? (
          <ui-card>
            <div style={{ padding: "40px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No quizzes yet</h3>
              <p style={{ color: "#666", marginBottom: "16px" }}>Create your first AI-powered product quiz</p>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{ background: "#008060", color: "white", border: "none", padding: "10px 16px", borderRadius: "4px", cursor: "pointer" }}
              >
                Create Your First Quiz
              </button>
            </div>
          </ui-card>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {quizzes.map((quiz: any) => (
              <ui-card key={quiz.id}>
                <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "600" }}>{quiz.title}</h3>
                      {quiz.active ? (
                        <span style={{ background: "#d4edda", color: "#155724", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>Active</span>
                      ) : (
                        <span style={{ background: "#f8f8f8", color: "#666", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>Inactive</span>
                      )}
                    </div>
                    <p style={{ fontSize: "14px", color: "#666" }}>{quiz.description || "No description"}</p>
                    <p style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>{quiz.questions?.length || 0} questions</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setSelectedQuiz(quiz)}
                      style={{ background: "#f1f1f1", border: "1px solid #ddd", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="delete-quiz" />
                      <input type="hidden" name="id" value={quiz.id} />
                      <button
                        type="submit"
                        style={{ background: "#fff", border: "1px solid #ddd", padding: "8px 12px", borderRadius: "4px", cursor: "pointer", color: "#bf0711" }}
                      >
                        Delete
                      </button>
                    </fetcher.Form>
                  </div>
                </div>
              </ui-card>
            ))}
          </div>
        )}

        <ui-card style={{ marginTop: "24px" }}>
          <div style={{ padding: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>Storefront Embed Code</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
              Add this code to your store to display the active quiz widget:
            </p>
            <code style={{ display: "block", background: "#f8f8f8", padding: "12px", borderRadius: "4px", fontSize: "13px" }}>
              {`<div id="ai-quiz-widget" data-shop="${shop}"></div>`}<br />
              {`<script src="https://your-app-domain.com/apps/quiz/embed.js" defer></script>`}
            </code>
          </div>
        </ui-card>
      </div>

      {showCreateModal && (
        <CreateQuizModal onClose={() => setShowCreateModal(false)} shop={shop} />
      )}

      {selectedQuiz && (
        <QuizEditorModal quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} shop={shop} />
      )}
    </ui-page>
  );
}

function CreateQuizModal({ onClose, shop }: { onClose: () => void; shop: string }) {
  const fetcher = useFetcher();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetcher.submit(
      { intent: "create-quiz", title, description },
      { method: "post" }
    );
    onClose();
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "white", padding: "24px", borderRadius: "8px", width: "400px", maxWidth: "90vw" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Create New Quiz</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Find Your Perfect Match"
              required
              style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Help customers find products that match their needs"
              rows={3}
              style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: "4px", background: "#fff", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: "8px 16px", background: "#008060", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QuizEditorModal({ quiz, onClose, shop }: { quiz: any; onClose: () => void; shop: string }) {
  const fetcher = useFetcher();
  const [questions, setQuestions] = React.useState(quiz.questions || []);
  const [showAddQuestion, setShowAddQuestion] = React.useState(false);
  const [newQuestion, setNewQuestion] = React.useState({ question: "", type: "single", options: [{ text: "" }] });

  const addOption = () => {
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, { text: "" }] });
  };

  const updateOption = (index: number, text: string) => {
    const updated = [...newQuestion.options];
    updated[index] = { text };
    setNewQuestion({ ...newQuestion, options: updated });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim() || newQuestion.options.every((o: any) => !o.text.trim())) return;

    fetcher.submit(
      {
        intent: "add-question",
        quizId: quiz.id,
        question: newQuestion.question,
        type: newQuestion.type,
        options: JSON.stringify(newQuestion.options.filter((o: any) => o.text.trim())),
      },
      { method: "post" }
    );

    setQuestions([...questions, { ...newQuestion, id: Date.now().toString(), options: newQuestion.options.filter((o: any) => o.text.trim()) }]);
    setNewQuestion({ question: "", type: "single", options: [{ text: "" }] });
    setShowAddQuestion(false);
  };

  const handleDeleteQuestion = (qId: string) => {
    fetcher.submit(
      { intent: "delete-question", id: qId, quizId: quiz.id },
      { method: "post" }
    );
    setQuestions(questions.filter((q: any) => q.id !== qId));
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "white", padding: "24px", borderRadius: "8px", width: "600px", maxWidth: "90vw", maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600" }}>Edit Quiz: {quiz.title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="quiz-active"
              defaultChecked={quiz.active}
              onChange={(e) => {
                fetcher.submit(
                  { intent: "update-quiz", id: quiz.id, title: quiz.title, description: quiz.description || "", active: e.target.checked.toString() },
                  { method: "post" }
                );
              }}
            />
            <label htmlFor="quiz-active">Quiz is active</label>
          </div>
        </div>

        <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Questions ({questions.length})</h3>

        {questions.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", background: "#f8f8f8", borderRadius: "4px", marginBottom: "16px" }}>
            <p style={{ color: "#666", marginBottom: "8px" }}>No questions yet</p>
            <button onClick={() => setShowAddQuestion(true)} style={{ background: "#008060", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>
              Add First Question
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
            {questions.map((q: any, index: number) => (
              <div key={q.id} style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#999" }}>Q{index + 1}</span>
                    <p style={{ fontWeight: "500", marginTop: "4px" }}>{q.question}</p>
                    <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>Type: {q.type}</p>
                    <p style={{ fontSize: "12px", color: "#666" }}>
                      Options: {Array.isArray(q.options) ? q.options.map((o: any) => o.text).join(", ") : "None"}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteQuestion(q.id)} style={{ background: "none", border: "none", color: "#bf0711", cursor: "pointer", fontSize: "12px" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddQuestion ? (
          <div style={{ border: "1px solid #008060", borderRadius: "4px", padding: "16px", marginBottom: "16px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Add New Question</h4>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Question</label>
              <input
                type="text"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="What are you looking for?"
                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
              />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Type</label>
              <select
                value={newQuestion.type}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
              >
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
              </select>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Answer Options</label>
              {newQuestion.options.map((opt: any, i: number) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
              ))}
              <button onClick={addOption} style={{ background: "#f1f1f1", border: "1px solid #ddd", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}>
                + Add Option
              </button>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleAddQuestion} style={{ background: "#008060", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}>
                Save Question
              </button>
              <button onClick={() => setShowAddQuestion(false)} style={{ background: "#fff", border: "1px solid #ddd", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddQuestion(true)} style={{ background: "#f1f1f1", border: "1px dashed #ddd", padding: "12px", borderRadius: "4px", cursor: "pointer", width: "100%", marginBottom: "16px" }}>
            + Add Question
          </button>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 20px", background: "#008060", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";