import db from "../db.server";

export async function syncProducts(admin: any, shop: string) {
  const response = await admin.graphql(
    `#graphql
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            variants(first: 1) {
              edges {
                node {
                  price
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }`
  );

  const json = await response.json();
  const products = json.data.products.edges;

  for (const edge of products) {
    const product = edge.node;
    const descriptionText = product.descriptionHtml.replace(/<[^>]*>?/gm, '');
    const price = product.variants.edges[0]?.node?.price;
    const imageUrl = product.images.edges[0]?.node?.url;

    await db.knowledgeItem.upsert({
      where: { id: `${shop}-${product.id}` },
      update: {
        content: `${product.title}\n\n${descriptionText}`,
        metadata: JSON.stringify({ 
          title: product.title, 
          handle: product.handle, 
          price: price,
          featuredImage: imageUrl
        }),
      },
      create: {
        id: `${shop}-${product.id}`,
        shop: shop,
        type: "PRODUCT",
        sourceId: product.id,
        content: `${product.title}\n\n${descriptionText}`,
        metadata: JSON.stringify({ 
          title: product.title, 
          handle: product.handle, 
          price: price,
          featuredImage: imageUrl
        }),
      },
    });
  }
}

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

export async function syncBlogs(admin: any, shop: string) {
  const response = await admin.graphql(
    `#graphql
    query {
      blogs(first: 10) {
        edges {
          node {
            id
            title
            articles(first: 50) {
              edges {
                node {
                  id
                  title
                  contentHtml
                  handle
                }
              }
            }
          }
        }
      }
    }`
  );

  const json = await response.json();
  const blogs = json.data.blogs.edges;

  for (const blogEdge of blogs) {
    const blog = blogEdge.node;
    for (const articleEdge of blog.articles.edges) {
      const article = articleEdge.node;
      const contentText = article.contentHtml.replace(/<[^>]*>?/gm, ''); // Simple strip HTML

      await db.knowledgeItem.upsert({
        where: { id: `${shop}-${article.id}` },
        update: {
          content: `${article.title}\n\n${contentText}`,
          metadata: JSON.stringify({ title: article.title, handle: article.handle, blogTitle: blog.title }),
        },
        create: {
          id: `${shop}-${article.id}`,
          shop: shop,
          type: "BLOG",
          sourceId: article.id,
          content: `${article.title}\n\n${contentText}`,
          metadata: JSON.stringify({ title: article.title, handle: article.handle, blogTitle: blog.title }),
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
