'use server';

/**
 * @fileOverview An FAQ chatbot for the school, activities, events and registration process.
 *
 * - faqChatbot - A function that answers FAQs about the school.
 * - FAQChatbotInput - The input type for the faqChatbot function.
 * - FAQChatbotOutput - The return type for the faqChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FAQChatbotInputSchema = z.object({
  query: z.string().describe('The user query about the school, activities, events, and registration process.'),
});
export type FAQChatbotInput = z.infer<typeof FAQChatbotInputSchema>;

const FAQChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type FAQChatbotOutput = z.infer<typeof FAQChatbotOutputSchema>;

export async function faqChatbot(input: FAQChatbotInput): Promise<FAQChatbotOutput> {
  return faqChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqChatbotPrompt',
  input: {schema: FAQChatbotInputSchema},
  output: {schema: FAQChatbotOutputSchema},
  prompt: `You are a helpful chatbot that answers FAQs about the school, activities, events, and registration process.

  User Query: {{{query}}}
  Answer: `,
});

const faqChatbotFlow = ai.defineFlow(
  {
    name: 'faqChatbotFlow',
    inputSchema: FAQChatbotInputSchema,
    outputSchema: FAQChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
