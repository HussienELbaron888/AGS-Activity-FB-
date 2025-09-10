import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { GenerateEmailInput, WelcomeEmailPayload, ConfirmationEmailPayload } from '@/lib/types';
import { generateEmail } from '@/ai/flows/generate-email-flow';

// Force Node.js runtime for Resend SDK compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resendApiKey = process.env.RESEND_API_KEY;

let resend: Resend | null = null;
if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn("RESEND_API_KEY is not set. Email sending will be disabled.");
}

export async function POST(req: NextRequest) {
  if (!resend) {
    return NextResponse.json({ error: 'Email sending is disabled due to missing API key.' }, { status: 500 });
  }

  try {
    const input: GenerateEmailInput = await req.json();

    // Generate the email content using the same flow (which now uses templates)
    const { subject, body, to } = await generateEmail(input);

    const { data, error } = await resend.emails.send({
      from: 'AGS Activities Hub <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: body,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully!', data });
  } catch (error) {
    const e = error as Error;
    console.error("API Route Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
