
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import type { ConfirmationEmailInput, WelcomeEmailInput } from '@/lib/types';

// Force Node.js runtime for Resend SDK compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Schemas for validation
const WelcomeEmailPayloadSchema = z.object({
  to: z.string().email(),
  name: z.string(),
});

const ConfirmationEmailPayloadSchema = z.object({
  to: z.string().email(),
  parentName: z.string(),
  studentName: z.string(),
  activityTitle: z.string(),
  activityDate: z.string(),
  activityTime: z.string(),
  activityLocation: z.string(),
  cost: z.number().optional(),
});

const EmailRequestSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal('welcome'), payload: WelcomeEmailPayloadSchema }),
    z.object({ type: z.literal('confirmation'), payload: ConfirmationEmailPayloadSchema }),
]);


export async function POST(req: NextRequest) {
  try {
    if (!resend) {
      console.error('[API/SEND-EMAIL] Resend is not configured. RESEND_API_KEY is missing.');
      return NextResponse.json(
        { success: false, message: 'Email service is not configured on the server.' },
        { status: 500 }
      );
    }
    
    const body = await req.json();
    const parsedRequest = EmailRequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      console.error('[API/SEND-EMAIL] Invalid request body:', parsedRequest.error.flatten());
      return NextResponse.json(
        { success: false, message: 'Invalid request body.', errors: parsedRequest.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { type, payload } = parsedRequest.data;
    const fromAddress = 'AGS Activities Hub <noreply@ags-activities.com>';
    let subject: string;
    let htmlBody: string;

    if (type === 'welcome') {
        const data = payload as WelcomeEmailInput;
        subject = 'Welcome to AGS Activities Hub!';
        htmlBody = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>Dear ${data.name},</p>
                <p>Welcome to the <strong>AGS Activities Hub</strong>!</p>
                <p>We are thrilled to have you with us. You can now browse, discover, and register for all the exciting activities, events, and trips our school has to offer.</p>
                <p>Get started by exploring the activities on our platform.</p>
                <p>Best regards,<br/>The AGS Activities Hub Team</p>
            </div>
        `;
    } else { // type === 'confirmation'
        const data = payload as ConfirmationEmailInput;
        subject = `Confirmation for ${data.activityTitle}`;
        htmlBody = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>Dear ${data.parentName},</p>
                <p>Thank you for registering your child, <strong>${data.studentName}</strong>, for the upcoming activity:</p>
                <ul>
                    <li><strong>Activity:</strong> ${data.activityTitle}</li>
                    <li><strong>Date:</strong> ${data.activityDate}</li>
                    <li><strong>Time:</strong> ${data.activityTime}</li>
                    <li><strong>Location:</strong> ${data.activityLocation}</li>
                    <li><strong>Cost:</strong> ${data.cost ? `${data.cost} SAR` : 'Free'}</li>
                </ul>
                ${data.cost && data.cost > 0 ? '<p>Payment instructions will be sent in a separate email.</p>' : ''}
                <p>We look forward to seeing ${data.studentName} there!</p>
                <p>Best regards,<br/>AGS Activities Hub</p>
            </div>
        `;
    }

    console.log(`[API/SEND-EMAIL] Attempting to send '${type}' email to ${payload.to}`);
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [payload.to],
      subject: subject,
      html: htmlBody,
    });

    if (error) {
      console.error('[API/SEND-EMAIL] Resend returned an error:', error);
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to send email due to a Resend error.' },
        { status: 502 } // Bad Gateway, indicates an error from an upstream service
      );
    }

    console.log(`[API/SEND-EMAIL] Email sent successfully. ID: ${data?.id}`);
    return NextResponse.json(
      { success: true, message: 'Email sent successfully!', id: data?.id },
      { status: 200 }
    );

  } catch (e: any) {
    console.error('[API/SEND-EMAIL] An unexpected exception occurred:', e);
    return NextResponse.json(
      { success: false, message: e.message || 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
