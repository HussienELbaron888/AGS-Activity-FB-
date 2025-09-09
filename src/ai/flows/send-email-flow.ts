
'use server';

/**
 * @fileOverview A mock email sending service.
 * This file defines a Genkit flow that simulates sending a confirmation email.
 * In a real application, this would integrate with an actual email service like SendGrid, Mailgun, or AWS SES.
 *
 * - sendConfirmationEmail - A function that handles the email sending process.
 * - ConfirmationEmailInput - The input type for the sendConfirmationEmail function.
 * - ConfirmationEmailOutput - The return type for the sendConfirmationEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ConfirmationEmailInputSchema = z.object({
  to: z.string().email().describe('The recipient\'s email address.'),
  parentName: z.string().describe('The name of the parent.'),
  studentName: z.string().describe('The name of the student.'),
  activityTitle: z.string().describe('The title of the activity.'),
  activityDate: z.string().describe('The date of the activity.'),
  activityTime: z.string().describe('The time of the activity.'),
  activityLocation: z.string().describe('The location of the activity.'),
  cost: z.number().optional().describe('The cost of the activity, if any.'),
});
type ConfirmationEmailInput = z.infer<typeof ConfirmationEmailInputSchema>;

const ConfirmationEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
  message: z.string().describe('A message indicating the status of the email sending process.'),
});
type ConfirmationEmailOutput = z.infer<typeof ConfirmationEmailOutputSchema>;


/**
 * Sends a confirmation email.
 * This is an exported wrapper function that calls the Genkit flow.
 * @param input - The email details.
 * @returns A promise that resolves to the output of the email sending flow.
 */
export async function sendConfirmationEmail(input: ConfirmationEmailInput): Promise<ConfirmationEmailOutput> {
  return sendConfirmationEmailFlow(input);
}


const sendConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'sendConfirmationEmailFlow',
    inputSchema: ConfirmationEmailInputSchema,
    outputSchema: ConfirmationEmailOutputSchema,
  },
  async (input) => {
    console.log('--- Simulating Email Send ---');
    console.log('To:', input.to);
    console.log('Subject:', `Confirmation for ${input.activityTitle}`);
    console.log('Body:');
    console.log(`
        Dear ${input.parentName},

        Thank you for registering your child, ${input.studentName}, for the upcoming activity:

        Activity: ${input.activityTitle}
        Date: ${input.activityDate}
        Time: ${input.activityTime}
        Location: ${input.activityLocation}
        Cost: ${input.cost ? `${input.cost} SAR` : 'Free'}

        ${input.cost && input.cost > 0 ? 'Payment instructions will be sent in a separate email.' : ''}
        
        We look forward to seeing ${input.studentName} there!

        Best regards,
        AGS Activities Hub
    `);
    console.log('-----------------------------');
    
    // In a real application, you would have logic here to call an email service API.
    // For this mock, we will always return success.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    return {
      success: true,
      message: `Email successfully simulated for ${input.to}. Check server logs for content.`,
    };
  }
);
