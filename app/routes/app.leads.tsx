import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const leads = await db.lead.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
  });

  return { leads };
};

export default function Leads() {
  const { leads } = useLoaderData<typeof loader>();

  return (
    <ui-page title="Captured Leads" back-action="/app">
      <ui-layout>
        <ui-layout-section>
          <ui-card>
            <div style={{ padding: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Lead List</h2>
              <p style={{ marginBottom: "16px", color: "#666" }}>These are customers who provided their email during a chat session.</p>
              
              {leads.length === 0 ? (
                <p>No leads captured yet.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
                      <th style={{ padding: "12px 8px" }}>Email</th>
                      <th style={{ padding: "12px 8px" }}>Context</th>
                      <th style={{ padding: "12px 8px" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "12px 8px", fontWeight: "500" }}>{lead.email}</td>
                        <td style={{ padding: "12px 8px", fontSize: "13px", color: "#666" }}>{lead.context}</td>
                        <td style={{ padding: "12px 8px", fontSize: "12px" }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </ui-card>
        </ui-layout-section>
      </ui-layout>
    </ui-page>
  );
}
