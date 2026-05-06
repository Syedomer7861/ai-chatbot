import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload, admin } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't available for webhooks, so we can't use it to fetch more data.
    // However, the payload contains the product data.
    console.log(`Webhook received: ${topic} for ${shop}`);
  }

  switch (topic) {
    case "PRODUCTS_CREATE":
    case "PRODUCTS_UPDATE":
      const product = payload as any;
      await db.knowledgeItem.upsert({
        where: { id: product.admin_graphql_api_id },
        update: {
          content: `${product.title}\n\n${product.body_html.replace(/<[^>]*>?/gm, '')}`,
          metadata: JSON.stringify({
            handle: product.handle,
            price: product.variants[0]?.price,
            image: product.image?.src
          }),
        },
        create: {
          id: product.admin_graphql_api_id,
          shop: shop,
          type: "PRODUCT",
          sourceId: product.admin_graphql_api_id,
          content: `${product.title}\n\n${product.body_html.replace(/<[^>]*>?/gm, '')}`,
          metadata: JSON.stringify({
            handle: product.handle,
            price: product.variants[0]?.price,
            image: product.image?.src
          }),
        },
      });
      break;

    case "PRODUCTS_DELETE":
      const { id } = payload as any;
      await db.knowledgeItem.deleteMany({
        where: { sourceId: `gid://shopify/Product/${id}` },
      });
      break;

    default:
      throw new Response("Unhandled topic", { status: 404 });
  }

  return new Response();
};
