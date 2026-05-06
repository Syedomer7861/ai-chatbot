import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { syncPolicies } from "../models/knowledge.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  // Trigger Policy Sync
  await syncPolicies(admin, shop);

  // Update Last Synced
  await db.appSettings.update({
    where: { shop },
    data: { lastSynced: new Date() },
  });

  return new Response(JSON.stringify({ success: true, lastSynced: new Date() }));
};
