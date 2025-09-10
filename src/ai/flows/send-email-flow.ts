
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

    console.log('--- Email Flow Started ---');

    if (!resendApiKey || resendApiKey.trim() === '') {
        console.error('[EMAIL FLOW ERROR] RESEND_API_KEY is not configured or is empty.');
        console.log('--- Email Flow Ended with Error ---');
        return {
            success: false,
            message: 'Email service is not configured on the server. API key is missing.',
        };
    }

    console.log('[EMAIL FLOW INFO] Resend API Key found.');

    const resend = new Resend(resendApiKey);

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

    const payload = {
        from: 'AGS Activities Hub <noreply@ags-activities.com>',
        to: [input.to],
        subject: `Confirmation for ${input.activityTitle}`,
        html: emailHtmlBody,
        text: `Dear ${input.parentName},\n\nThank you for registering your child, ${input.studentName}, for the upcoming activity: Activity: ${input.activityTitle}, Date: ${input.activityDate}, Time: ${input.activityTime}, Location: ${input.activityLocation}, Cost: ${input.cost ? `${input.cost} SAR` : 'Free'}.\n\nWe look forward to seeing ${input.studentName} there!\n\nBest regards,\nAGS Activities Hub`
    };

    try {
        console.log('[EMAIL FLOW INFO] Attempting to send email with payload:', JSON.stringify(payload, null, 2));
        const { data, error } = await resend.emails.send(payload);

        if (error) {
            console.error('[EMAIL FLOW ERROR] Resend API returned an error:', JSON.stringify(error, null, 2));
            console.log('--- Email Flow Ended with API Error ---');
            return { success: false, message: `Failed to send email: ${error.message}` };
        }

        console.log('[EMAIL FLOW SUCCESS] Email sent successfully. Response:', JSON.stringify(data, null, 2));
        console.log('--- Email Flow Ended Successfully ---');
        return { success: true, message: `Email successfully sent to ${input.to}.` };

    } catch (e) {
        console.error('[EMAIL FLOW CRITICAL] An unexpected exception occurred:', e);
        const error = e as Error;
        console.log('--- Email Flow Ended with Exception ---');
        return { success: false, message: `An unexpected error occurred: ${error.message}` };
    }
  }
);
