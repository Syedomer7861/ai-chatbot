import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`GDPR Webhook received: ${topic} for ${shop}`);
  console.log("Payload:", JSON.stringify(payload, null, 2));

  // Shopify requires a 200 OK response
  return new Response(null, { status: 200 });
};
