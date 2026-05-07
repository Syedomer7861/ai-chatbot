import { useLoaderData, useFetcher } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const customItems = await db.knowledgeItem.findMany({
    where: { shop, type: "CUSTOM" },
    orderBy: { updatedAt: "desc" },
  });

  return { customItems };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add") {
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;

    await db.knowledgeItem.create({
      data: {
        shop,
        type: "CUSTOM",
        sourceId: "manual",
        content: `Q: ${question}\nA: ${answer}`,
        metadata: JSON.stringify({ question, answer }),
      },
    });
  } else if (intent === "delete") {
    const id = formData.get("id") as string;
    await db.knowledgeItem.delete({
      where: { id, shop },
    });
  }

  return { success: true };
};

export default function Knowledge() {
  const { customItems } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <ui-page title="Custom Knowledge" back-action="/app">
      <ui-layout>
        <ui-layout-section>
          <ui-card>
            <div style={{ padding: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Add Custom Q&A</h2>
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="add" />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "4px" }}>Question / Topic</label>
                    <input 
                      name="question" 
                      placeholder="e.g. Do you ship to Canada?"
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "4px" }}>Answer / Content</label>
                    <textarea 
                      name="answer" 
                      placeholder="Yes, we ship to all provinces in Canada via UPS..."
                      rows={4}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    style={{ background: "#008060", color: "white", border: "none", padding: "10px 16px", borderRadius: "4px", cursor: "pointer", alignSelf: "flex-start" }}
                  >
                    Add to Knowledge Base
                  </button>
                </div>
              </fetcher.Form>
            </div>
          </ui-card>
        </ui-layout-section>

        <ui-layout-section>
          <ui-card>
            <div style={{ padding: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Managed Items</h2>
              {customItems.length === 0 ? (
                <p style={{ color: "#666" }}>No custom items added yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {customItems.map((item) => {
                    const meta = JSON.parse(item.metadata || "{}");
                    return (
                      <div key={item.id} style={{ padding: "12px", border: "1px solid #eee", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>{meta.question}</p>
                          <p style={{ fontSize: "13px", color: "#666" }}>{meta.answer}</p>
                        </div>
                        <fetcher.Form method="post">
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="id" value={item.id} />
                          <button 
                            type="submit" 
                            style={{ background: "none", border: "none", color: "#bf0711", cursor: "pointer", fontSize: "12px" }}
                          >
                            Delete
                          </button>
                        </fetcher.Form>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ui-card>
        </ui-layout-section>
      </ui-layout>
    </ui-page>
  );
}
