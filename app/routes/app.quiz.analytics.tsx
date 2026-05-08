import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRouteError } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const [quizzes, allResults] = await Promise.all([
    db.quiz.findMany({
      where: { shop },
      include: { questions: true, results: true },
      orderBy: { createdAt: "desc" },
    }),
    db.quizResult.findMany({
      where: { quiz: { shop } },
      include: { quiz: true },
    }),
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentCompletions = allResults.filter((r) => r.createdAt >= thirtyDaysAgo);

  const completionsByDate = recentCompletions.reduce(
    (acc, r) => {
      const date = r.createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const perQuizStats = quizzes.map((q) => ({
    id: q.id,
    title: q.title,
    active: q.active,
    totalQuestions: q.questions.length,
    completions: q.results.length,
    leads: q.results.filter((r) => r.email).length,
    leadCaptureRate:
      q.results.length > 0
        ? ((q.results.filter((r) => r.email).length / q.results.length) * 100).toFixed(1) + "%"
        : "0%",
  }));

  const totalCompletions = allResults.length;
  const totalLeads = new Set(allResults.filter((r) => r.email).map((r) => r.email)).size;

  return {
    totalQuizzes: quizzes.length,
    activeQuizzes: quizzes.filter((q) => q.active).length,
    totalCompletions,
    totalLeads,
    leadCaptureRate:
      totalCompletions > 0
        ? ((totalLeads / totalCompletions) * 100).toFixed(1) + "%"
        : "0%",
    perQuizStats,
    completionsByDate,
  };
};

export default function QuizAnalytics() {
  const data = useLoaderData<typeof loader>();

  const sortedDates = Object.entries(data.completionsByDate).sort(
    ([a], [b]) => a.localeCompare(b)
  );

  return (
    <ui-page title="Quiz Analytics">
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <ui-card>
            <div style={{ padding: "16px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#008060",
                }}
              >
                {data.totalCompletions}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Total Completions
              </div>
            </div>
          </ui-card>

          <ui-card>
            <div style={{ padding: "16px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#008060",
                }}
              >
                {data.totalLeads}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Unique Leads
              </div>
            </div>
          </ui-card>

          <ui-card>
            <div style={{ padding: "16px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#008060",
                }}
              >
                {data.leadCaptureRate}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Lead Capture Rate
              </div>
            </div>
          </ui-card>

          <ui-card>
            <div style={{ padding: "16px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#008060",
                }}
              >
                {data.activeQuizzes}/{data.totalQuizzes}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Active Quizzes
              </div>
            </div>
          </ui-card>
        </div>

        <ui-card>
          <div style={{ padding: "16px" }}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "16px",
              }}
            >
              Per-Quiz Performance
            </h2>
            {data.perQuizStats.map((quiz) => (
              <div
                key={quiz.id}
                style={{
                  marginBottom: "12px",
                  padding: "12px",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: "600" }}>
                      {quiz.title}
                      {quiz.active && (
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "11px",
                            padding: "2px 6px",
                            background: "#e3f4e3",
                            color: "#008060",
                            borderRadius: "4px",
                          }}
                        >
                          Active
                        </span>
                      )}
                    </h3>
                    <p style={{ fontSize: "12px", color: "#666" }}>
                      {quiz.completions} completions • {quiz.leads} leads •{" "}
                      {quiz.leadCaptureRate} capture rate
                    </p>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {quiz.totalQuestions} questions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ui-card>

        {sortedDates.length > 0 && (
          <ui-card style={{ marginTop: "16px" }}>
            <div style={{ padding: "16px" }}>
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Completions (Last 30 Days)
              </h2>
              <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "100px" }}>
                {sortedDates.map(([date, count]) => (
                  <div
                    key={date}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${(count as number) * 20}px`,
                        background: "#667eea",
                        borderRadius: "2px",
                        minHeight: "4px",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "9px",
                        color: "#999",
                        marginTop: "4px",
                        transform: "rotate(-45deg)",
                        transformOrigin: "top center",
                      }}
                    >
                      {date.slice(5)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ui-card>
        )}
      </div>
    </ui-page>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}
