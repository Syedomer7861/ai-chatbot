import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { searchKnowledge } from "../models/knowledge.server";
import { generateChatResponse } from "../models/ai.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  
  const shop = session.shop;

  const { message } = await request.json();

  if (!message) {
    return new Response(JSON.stringify({ error: "Missing message" }), { status: 400 });
  }

  // 0. Fetch Settings
  const settings = await db.appSettings.findUnique({ where: { shop } });
  const botName = settings?.botName || "AI Assistant";
  const botPersona = settings?.botPersona || "A helpful shopping assistant.";

  // 0. Lead Capture Detection
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const emails = message.match(emailRegex);
  if (emails) {
    await db.lead.create({
      data: {
        shop,
        email: emails[0],
        context: message
      }
    });
  }

  // 1. Retrieve knowledge context
  const context = await searchKnowledge(shop, message);

  // 2. Generate AI response
  const aiResponseRaw = await generateChatResponse(message, context);

  // Extract suggestions and clean response
  const suggestionRegex = /\[SUGGESTION: (.*?)\]/g;
  const suggestions = [...aiResponseRaw.matchAll(suggestionRegex)].map(m => m[1]);
  const aiResponse = aiResponseRaw.replace(suggestionRegex, "").trim();

  // 3. Extract products from context to show as cards
  const products = context
    .filter(item => item.type === "PRODUCT")
    .map(item => {
      try {
        return JSON.parse(item.metadata || "{}");
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  return new Response(JSON.stringify({
    response: aiResponse,
    suggestions: suggestions,
    products: products.slice(0, 3), // Show top 3 products as cards
    context_used: context.length > 0
  }));
};
