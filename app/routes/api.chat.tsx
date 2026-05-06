import type { ActionFunctionArgs } from "react-router";
import { searchKnowledge } from "../models/knowledge.server";
import { generateChatResponse } from "../models/ai.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.json();
  const { message, shop } = body;

  if (!message || !shop) {
    return new Response(JSON.stringify({ error: "Missing message or shop" }), { status: 400 });
  }

  // 1. Retrieve knowledge context
  const context = await searchKnowledge(shop, message);

  // 2. Generate AI response
  const aiResponse = await generateChatResponse(message, context);

  return new Response(JSON.stringify({
    response: aiResponse,
    context_used: context.length > 0
  }));
};
