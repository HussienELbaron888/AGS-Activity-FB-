
'use server';
/**
 * @fileOverview An AI flow to generate email content.
 *
 * - generateEmail - A function that generates email subject and body.
 * - GenerateEmailInput - The input type for the generateEmail function.
 * - GenerateEmailOutput - The return type for the generateEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WelcomeEmailPayloadSchema = z.object({
  name: z.string().describe('The name of the new user.'),
});

const ConfirmationEmailPayloadSchema = z.object({
  parentName: z.string().describe("The name of the parent registering."),
  studentName: z.string().describe("The name of the student being registered."),
  activityTitle: z.string().describe("The title of the activity."),
  activityDate: z.string().describe("The date of the activity."),
  activityTime: z.string().describe("The time of the activity."),
  activityLocation: z.string().describe("The location of the activity."),
  cost: z.number().optional().describe("The cost of the activity in SAR. If 0 or undefined, it's free."),
});


export const GenerateEmailInputSchema = z.object({
  type: z.enum(['welcome', 'confirmation']),
  language: z.enum(['en', 'ar']).describe("The language for the email content."),
  payload: z.union([WelcomeEmailPayloadSchema, ConfirmationEmailPayloadSchema]),
});

export type GenerateEmailInput = z.infer<typeof GenerateEmailInputSchema>;

export const GenerateEmailOutputSchema = z.object({
  subject: z.string().describe('The generated email subject line.'),
  body: z.string().describe('The generated email body in HTML format.'),
  to: z.string().email().describe('The recipient email address.'),
});
export type GenerateEmailOutput = z.infer<typeof GenerateEmailOutputSchema>;


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
    }

    const {output} = await prompt(input);
    
    // Add the recipient's email to the final output, as it's needed by the client.
    return {
      subject: output!.subject,
      body: output!.body,
      to: recipientEmail
    };
  }
);
