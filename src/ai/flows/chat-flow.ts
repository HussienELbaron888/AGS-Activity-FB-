
'use server';
/**
 * @fileOverview A friendly chatbot for the school website.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { MessageData } from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(z.custom<MessageData>()),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.string();
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history }) => {
    const systemPrompt = `You are a friendly and helpful chatbot for the "AGS Activities Hub" website of the Advanced Generation Schools.
Your name is 'Hubie'.
Your goal is to answer questions about the school, its activities, events, and trips in a concise, friendly, and helpful manner.
Always answer in the language of the last user message. If the user writes in Arabic, respond in Arabic. If they write in English, respond in English.
Keep your answers short and to the point.
Today's date is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
Do not answer any questions that are not related to the school or its activities. If you are asked an off-topic question, politely decline to answer.
The school website is for the Advanced Generation Schools.
Available activities include: Science Fair, Basketball Finals, Museum Trip, Coding Club, Pottery Workshop, and a School Play.
You can provide basic details, but for registration, direct the user to click the 'Register' button on the activity card.
You can also answer general questions about school contact info, location, etc.
`;
    
    const response = await ai.generate({
      prompt: {
        text: systemPrompt,
        history,
      },
      model: 'googleai/gemini-2.5-flash',
      config: {
        temperature: 0.7,
      },
    });

    return response.text;
  }
);
