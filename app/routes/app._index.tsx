import { useLoaderData, useFetcher } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = session.shop;

  // Enforce billing
  await billing.require({
    plans: ["monthly"],
    onFailure: async () => billing.request({ 
      plan: "monthly",
      isTest: true,
      returnUrl: `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}/app`
    }),
  });

  const knowledgeCount = await db.knowledgeItem.count({ where: { shop } });
  const settings = await db.appSettings.upsert({
    where: { shop },
    update: {},
    create: { shop },
  });

  return { knowledgeCount, settings, shop };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const botName = formData.get("botName") as string;
  const botPersona = formData.get("botPersona") as string;
  const demoMode = formData.get("demoMode") === "true";

  await db.appSettings.update({
    where: { shop },
    data: { botName, botPersona, demoMode },
  });

  return { success: true };
};

export default function Index() {
  const { knowledgeCount, settings, shop } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <ui-page title="Dashboard">
      <ui-layout>
        <ui-layout-section>
          <ui-card>
            <div style={{ padding: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Knowledge Base Status</h2>
              <p style={{ marginBottom: "12px" }}>Your AI currently has <strong>{knowledgeCount}</strong> items in its knowledge base (products and policies).</p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <fetcher.Form action="/api/sync" method="post">
                  <button 
                    type="submit" 
                    disabled={fetcher.state !== "idle"}
                    style={{ background: "#f1f1f1", border: "1px solid #ddd", padding: "8px 12px", borderRadius: "4px", cursor: fetcher.state !== "idle" ? "not-allowed" : "pointer" }}
                  >
                    {fetcher.state !== "idle" ? "Syncing..." : "Sync Now"}
                  </button>
                </fetcher.Form>
                <a 
                  href="/app/knowledge" 
                  style={{ textDecoration: "none", color: "#008060", fontSize: "14px", fontWeight: "600" }}
                >
                  Manage Custom Knowledge →
                </a>
                <a 
                  href="/app/leads" 
                  style={{ textDecoration: "none", color: "#008060", fontSize: "14px", fontWeight: "600" }}
                >
                  View Captured Leads →
                </a>
                {settings.lastSynced && (
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    Last synced: {new Date(settings.lastSynced).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </ui-card>
        </ui-layout-section>

        <ui-layout-section>
          <ui-card>
            <div style={{ padding: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Chatbot Settings</h2>
              <fetcher.Form method="post">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <ui-box>
                    <label style={{ display: "block", marginBottom: "4px" }}>Bot Name</label>
                    <input 
                      name="botName" 
                      defaultValue={settings.botName} 
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </ui-box>
                  
                  <ui-box>
                    <label style={{ display: "block", marginBottom: "4px" }}>System Persona / Instructions</label>
                    <textarea 
                      name="botPersona" 
                      defaultValue={settings.botPersona} 
                      rows={4}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </ui-box>

                  <ui-box>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input 
                        type="checkbox" 
                        name="demoMode" 
                        value="true"
                        defaultChecked={settings.demoMode}
                      />
                      <label>Enable Reviewer Demo Mode (Simulates premium features for App Store review)</label>
                    </div>
                  </ui-box>

                  <button 
                    type="submit" 
                    style={{ background: "#008060", color: "white", border: "none", padding: "10px 16px", borderRadius: "4px", cursor: "pointer", alignSelf: "flex-start" }}
                  >
                    Save Settings
                  </button>
                </div>
              </fetcher.Form>
            </div>
          </ui-card>
        </ui-layout-section>

        <ui-layout-section>
          <ui-card>
            <div style={{ padding: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#bf0711" }}>Reviewer Support</h2>
              <p style={{ fontSize: "14px", marginBottom: "12px" }}>If you are a Shopify App Reviewer, please use the following credentials for testing:</p>
              <ul style={{ fontSize: "13px", paddingLeft: "20px" }}>
                <li><strong>Test Store:</strong> {shop}</li>
                <li><strong>Lead Capture:</strong> Type "I want to talk to a human" in the chat to see the email capture flow.</li>
                <li><strong>Product Cards:</strong> Ask "Show me some products" to see the rich card UI.</li>
              </ul>
            </div>
          </ui-card>
        </ui-layout-section>
      </ui-layout>
    </ui-page>
  );
}
