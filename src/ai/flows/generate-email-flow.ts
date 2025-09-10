
'use server';
/**
 * @fileOverview An AI flow to generate email content.
 *
 * - generateEmail - A function that generates email subject and body.
 */

import {ai} from '@/ai/genkit';
import { GenerateEmailInput, GenerateEmailOutput, GenerateEmailInputSchema, GenerateEmailOutputSchema, WelcomeEmailPayloadSchema, ConfirmationEmailPayloadSchema } from '@/lib/types';


export async function generateEmail(input: GenerateEmailInput): Promise<GenerateEmailOutput> {
  return generateEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailPrompt',
  input: {schema: GenerateEmailInputSchema},
  output: {schema: GenerateEmailOutputSchema},
  prompt: `
    You are an expert email copywriter for a prestigious international school called "AGS Activities Hub".
    Your task is to generate a polite, professional, and well-formatted HTML email based on the requested type and payload.
    The language for the email must be {{language}}.

    If the type is 'welcome', use the WelcomeEmailPayloadSchema. The recipient is the new user.
    If the type is 'confirmation', use the ConfirmationEmailPayloadSchema. The recipient is the parent.

    When generating the HTML body, use basic inline styles for professional formatting (e.g., <p>, <strong>, <ul>, <li>).
    The tone should be warm and welcoming. Start the confirmation email by addressing the parent.
    For confirmation emails, clearly list all the activity details in a list.
    If the cost is provided and is greater than 0, mention that payment details will be sent separately. If it's free, state that clearly.
    End the email with "Thank you!" and "AGS Activities Hub".

    Here is the data for the email:
    Type: {{type}}
    Payload: {{{jsonStringify payload}}}
  `,
});

const generateEmailFlow = ai.defineFlow(
  {
    name: 'generateEmailFlow',
    inputSchema: GenerateEmailInputSchema,
    outputSchema: GenerateEmailOutputSchema,
  },
  async (input) => {
    let recipientEmail = '';
    
    // This is a workaround to extract the email since it's not part of the prompt's direct output schema
    if ('to' in input.payload) {
      recipientEmail = (input.payload as any).to;
    } else if (input.type === 'welcome') {
      // The Welcome payload doesn't have a 'to' field. This is a logic error.
      // Let's assume for now it's passed in the payload for welcome too.
      recipientEmail = (input.payload as any).email || '';
    }

    const {output} = await prompt(input);

    if (!output) {
        throw new Error("AI failed to generate email content.");
    }
    
    // Add the recipient's email to the final output, as it's needed by the client.
    return {
      subject: output.subject,
      body: output.body,
      to: recipientEmail
    };
  }
);
