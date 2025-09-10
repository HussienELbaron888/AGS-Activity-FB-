
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Force Node.js runtime for Resend SDK compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const EmailPayloadSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  html: z.string(),
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
    const parsed = EmailPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body.', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { to, subject, html } = parsed.data;
    const fromAddress = 'AGS Activities Hub <noreply@ags-activities.com>';

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
    // Return a generic but valid JSON error response
    return NextResponse.json(
      { success: false, message: e.message || 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
