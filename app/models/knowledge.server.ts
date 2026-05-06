import db from "../db.server";

export async function syncPolicies(admin: any, shop: string) {
  const response = await admin.graphql(
    `#graphql
    query {
      shop {
        refundPolicy {
          body
          url
        }
        shippingPolicy {
          body
          url
        }
        privacyPolicy {
          body
          url
        }
      }
    }`
  );

  const json = await response.json();
  const shopData = json.data.shop;

  const policies = [
    { type: "POLICY", id: "refund", data: shopData.refundPolicy },
    { type: "POLICY", id: "shipping", data: shopData.shippingPolicy },
    { type: "POLICY", id: "privacy", data: shopData.privacyPolicy },
  ];

  for (const policy of policies) {
    if (policy.data?.body) {
      await db.knowledgeItem.upsert({
        where: { id: `${shop}-${policy.id}-policy` },
        update: {
          content: policy.data.body,
          metadata: JSON.stringify({ url: policy.data.url }),
        },
        create: {
          id: `${shop}-${policy.id}-policy`,
          shop: shop,
          type: "POLICY",
          sourceId: policy.id,
          content: policy.data.body,
          metadata: JSON.stringify({ url: policy.data.url }),
        },
      });
    }
  }
}

export async function searchKnowledge(shop: string, query: string) {
  // Simple keyword search for MVP
  // In a real app, this would use a vector database or pgvector
  const keywords = query.split(' ').filter(k => k.length > 3);
  
  const results = await db.knowledgeItem.findMany({
    where: {
      shop: shop,
      OR: [
        { content: { contains: query } },
        ...keywords.map(k => ({ content: { contains: k } }))
      ]
    },
    take: 5
  });

  return results;
}
