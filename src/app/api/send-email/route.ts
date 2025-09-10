import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Force Node.js runtime for Resend SDK compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Define a schema for the overall request body, which includes type and payload
const EmailRequestSchema = z.object({
  type: z.enum(['welcome', 'confirmation']),
  payload: z.any(),
});

// Specific schemas for each email type's payload
const WelcomePayloadSchema = z.object({
  to: z.string().email(),
  name: z.string(),
});

const ConfirmationPayloadSchema = z.object({
  to: z.string().email(),
  parentName: z.string(),
  studentName: z.string(),
  activityTitle: z.string(),
  activityDate: z.string(),
  activityTime: z.string(),
  activityLocation: z.string(),
  cost: z.number().optional(),
});


export async function POST(req: NextRequest) {
  try {
    if (!resend) {
      return NextResponse.json(
        { success: false, message: 'Email service is not configured on the server. RESEND_API_KEY is missing.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const requestParseResult = EmailRequestSchema.safeParse(body);

    if (!requestParseResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request structure. Must include type and payload.', errors: requestParseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { type, payload } = requestParseResult.data;
    const fromAddress = 'AGS Activities Hub <noreply@ags-activities.com>';
    
    let to: string;
    let subject: string;
    let html: string;

    if (type === 'welcome') {
        const welcomeParseResult = WelcomePayloadSchema.safeParse(payload);
        if (!welcomeParseResult.success) {
            return NextResponse.json({ success: false, message: 'Invalid welcome email payload.', errors: welcomeParseResult.error.flatten().fieldErrors }, { status: 400 });
        }
        const { name } = welcomeParseResult.data;
        to = welcomeParseResult.data.to;
        subject = `Welcome to AGS Activities Hub, ${name}!`;
        html = `<h1>Welcome, ${name}!</h1><p>Thank you for creating an account at AGS Activities Hub. We're excited to have you.</p>`;

    } else if (type === 'confirmation') {
        const confirmationParseResult = ConfirmationPayloadSchema.safeParse(payload);
        if (!confirmationParseResult.success) {
            return NextResponse.json({ success: false, message: 'Invalid confirmation email payload.', errors: confirmationParseResult.error.flatten().fieldErrors }, { status: 400 });
        }
        const { parentName, studentName, activityTitle, activityDate, activityTime, activityLocation, cost } = confirmationParseResult.data;
        to = confirmationParseResult.data.to;
        subject = `Registration Confirmed for ${activityTitle}`;
        html = `
          <h2>Registration Confirmation</h2>
          <p>Dear ${parentName},</p>
          <p>This email confirms the registration for <strong>${studentName}</strong> in the following activity:</p>
          <ul>
            <li><strong>Activity:</strong> ${activityTitle}</li>
            <li><strong>Date:</strong> ${activityDate}</li>
            <li><strong>Time:</strong> ${activityTime}</li>
            <li><strong>Location:</strong> ${activityLocation}</li>
            <li><strong>Cost:</strong> ${cost ? `${cost} SAR` : 'Free'}</li>
          </ul>
          <p>If payment is required, further instructions will be sent in a separate email.</p>
          <p>Thank you!</p>
          <p><strong>AGS Activities Hub</strong></p>
        `;
    } else {
        return NextResponse.json({ success: false, message: 'Invalid email type specified.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('[API/SEND-EMAIL] Resend returned an error:', error);
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to send email due to a Resend error.' },
        { status: 502 }
      );
    }

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
