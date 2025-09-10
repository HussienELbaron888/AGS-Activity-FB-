
'use server';

/**
 * @fileOverview An email sending service using Resend for welcome emails.
 * This file defines a Genkit flow that sends a welcome email to new users.
 * It requires a RESEND_API_KEY to be set in the environment variables.
 * 
 * - sendWelcomeEmail - A function that handles the email sending process.
 */
import { config } from 'dotenv';
config({ path: './src/app/.env' });

import { ai } from '@/ai/genkit';
import { Resend } from 'resend';
import { 
    WelcomeEmailInputSchema,
    type WelcomeEmailInput, 
    EmailOutputSchema,
    type EmailOutput 
} from './email-types';


/**
 * Sends a welcome email to a new user.
 * This is an exported wrapper function that calls the Genkit flow.
 * @param input - The welcome email details.
 * @returns A promise that resolves to the output of the email sending flow.
 */
export async function sendWelcomeEmail(input: WelcomeEmailInput): Promise<EmailOutput> {
    return sendWelcomeEmailFlow(input);
}


const sendWelcomeEmailFlow = ai.defineFlow(
    {
        name: 'sendWelcomeEmailFlow',
        inputSchema: WelcomeEmailInputSchema,
        outputSchema: EmailOutputSchema,
    },
    async (input) => {
        const resendApiKey = process.env.RESEND_API_KEY;

        console.log('--- Welcome Email Flow Started ---');
        console.log('[WELCOME EMAIL INFO] Input received:', JSON.stringify(input, null, 2));

        if (!resendApiKey || resendApiKey.trim() === '') {
            console.error('[WELCOME EMAIL ERROR] RESEND_API_KEY is not configured or is empty.');
            console.log('--- Welcome Email Flow Ended with Error ---');
            return {
                success: false,
                message: 'Email service is not configured on the server. API key is missing.',
            };
        }

        console.log('[WELCOME EMAIL INFO] Resend API Key found.');
        const resend = new Resend(resendApiKey);

        const emailHtmlBody = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>Dear ${input.name},</p>
                <p>Welcome to the <strong>AGS Activities Hub</strong>!</p>
                <p>We are thrilled to have you with us. You can now browse, discover, and register for all the exciting activities, events, and trips our school has to offer.</p>
                <p>Get started by exploring the activities on our platform.</p>
                <p>Best regards,<br/>The AGS Activities Hub Team</p>
            </div>
        `;

        const payload = {
            from: 'AGS Activities Hub <noreply@ags-activities.com>',
            to: [input.to],
            subject: 'Welcome to AGS Activities Hub!',
            html: emailHtmlBody,
            text: `Dear ${input.name},\n\nWelcome to the AGS Activities Hub! We are thrilled to have you with us. You can now browse, discover, and register for all the exciting activities, events, and trips our school has to offer.\n\nBest regards,\nThe AGS Activities Hub Team`
        };

        try {
            console.log('[WELCOME EMAIL INFO] Attempting to send welcome email with payload:', JSON.stringify(payload, null, 2));
            const { data, error } = await resend.emails.send(payload);

            if (error) {
                console.error('[WELCOME EMAIL ERROR] Resend API returned an error:', JSON.stringify(error, null, 2));
                console.log('--- Welcome Email Flow Ended with API Error ---');
                return { success: false, message: `Failed to send email: ${error.message}` };
            }

            console.log('[WELCOME EMAIL SUCCESS] Email sent successfully. Response:', JSON.stringify(data, null, 2));
            console.log('--- Welcome Email Flow Ended Successfully ---');
            return { success: true, message: `Welcome email successfully sent to ${input.to}.` };

        } catch (e) {
            console.error('[WELCOME EMAIL CRITICAL] An unexpected exception occurred:', e);
            const error = e as Error;
            console.log('--- Welcome Email Flow Ended with Exception ---');
            return { success: false, message: `An unexpected error occurred: ${error.message}` };
        }
    }
);
