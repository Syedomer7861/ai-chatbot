import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateChatResponse(message: string, context: any[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const contextText = context
    .map(item => `[${item.type}] ${item.content}`)
    .join("\n\n---\n\n");

  const prompt = `
    You are a helpful, professional shopping assistant for the Shopify store. 
    Your goal is to help customers find products and understand store policies.

    INSTRUCTIONS:
    - Use ONLY the provided context to answer the user's question.
    - If the information is not in the context, say "I'm sorry, I don't have that information. Can I get your email so someone from our team can follow up with you?"
    - Keep answers concise and friendly.
    - Use Markdown for formatting (bolding product names, etc.).
    - At the end of your response, provide 2-3 brief follow-up questions the user might want to ask next.
    - Format these suggestions exactly like this on a new line: [SUGGESTION: Your question here]

    CONTEXT FROM STORE:
    ${contextText}

    USER QUESTION:
    ${message}

    YOUR RESPONSE:
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
