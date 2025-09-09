
'use server';

/**
 * @fileOverview An email sending service using Resend.
 * This file defines a Genkit flow that sends a real confirmation email.
 * It requires a RESEND_API_KEY to be set in the environment variables.
 *
 * - sendConfirmationEmail - A function that handles the email sending process.
 */

import { ai } from '@/ai/genkit';
import { Resend } from 'resend';
import {
  ConfirmationEmailInputSchema,
  type ConfirmationEmailInput,
  ConfirmationEmailOutputSchema,
  type ConfirmationEmailOutput
} from './email-types';


/**
 * Sends a confirmation email using Resend.
 * This is an exported wrapper function that calls the Genkit flow.
 * @param input - The email details.
 * @returns A promise that resolves to the output of the email sending flow.
 */
export async function sendConfirmationEmail(input: ConfirmationEmailInput): Promise<ConfirmationEmailOutput> {
  return sendConfirmationEmailFlow(input);
}


// The actual Genkit flow definition
const sendConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'sendConfirmationEmailFlow',
    inputSchema: ConfirmationEmailInputSchema,
    outputSchema: ConfirmationEmailOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.error('Resend API key is not configured. Set RESEND_API_KEY in your .env file.');
        return {
            success: false,
            message: 'Email service is not configured on the server. Please contact support.',
        };
    }

    const resend = new Resend(resendApiKey);

    const emailBody = `
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
    `;
    
    const emailHtmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Dear ${input.parentName},</p>
            <p>Thank you for registering your child, <strong>${input.studentName}</strong>, for the upcoming activity:</p>
            <ul>
                <li><strong>Activity:</strong> ${input.activityTitle}</li>
                <li><strong>Date:</strong> ${input.activityDate}</li>
                <li><strong>Time:</strong> ${input.activityTime}</li>
                <li><strong>Location:</strong> ${input.activityLocation}</li>
                <li><strong>Cost:</strong> ${input.cost ? `${input.cost} SAR` : 'Free'}</li>
            </ul>
            ${input.cost && input.cost > 0 ? '<p>Payment instructions will be sent in a separate email.</p>' : ''}
            <p>We look forward to seeing ${input.studentName} there!</p>
            <p>Best regards,<br/>AGS Activities Hub</p>
        </div>
    `;

    try {
        // !! CRITICAL !!
        // The 'from' address 'onboarding@resend.dev' is for testing only.
        // For emails to be delivered reliably, you MUST verify your own domain in your Resend account
        // and use an email address from that domain, e.g., 'noreply@yourverifieddomain.com'.
        const { data, error } = await resend.emails.send({
            from: 'AGS Activities Hub <onboarding@resend.dev>',
            to: [input.to],
            subject: `Confirmation for ${input.activityTitle}`,
            text: emailBody,
            html: emailHtmlBody,
        });

        if (error) {
            console.error('Resend API error:', error);
            return { success: false, message: `Failed to send email: ${error.message}` };
        }

        console.log('Email sent successfully:', data);
        return { success: true, message: `Email successfully sent to ${input.to}.` };

    } catch (e) {
        const error = e as Error;
        console.error('Failed to send email:', error);
        return { success: false, message: `An unexpected error occurred: ${error.message}` };
    }
  }
);
