import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`GDPR Webhook received: ${topic} for ${shop}`);

  switch (topic) {
    case "customers/data_request":
      // Handle customer data request
      // You should send this data to the customer's email
      console.log("Customer data request payload:", payload);
      break;
    case "customers/redact":
      // Handle customer data redaction
      console.log("Customer redact payload:", payload);
      break;
    case "shop/redact":
      // Handle shop data redaction when app is uninstalled
      console.log("Shop redact payload:", payload);
      break;
    default:
      console.log("Unhandled GDPR topic:", topic);
  }

  return new Response(null, { status: 200 });
};
