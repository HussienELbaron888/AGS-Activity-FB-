import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';              // مهم: Node وليس Edge
export const dynamic = 'force-dynamic';       // اختياري

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { to, subject, html } = body;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Missing RESEND_API_KEY env var' },
        { status: 500 }
      );
    }
    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'noreply@ags-activity.com', // الدومين لازم يكون Verified في Resend
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, message: error.message || 'Resend failed' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: 'Email sent', id: data?.id ?? null });
  } catch (e: any) {
    console.error('API send-email exception:', e);
    return NextResponse.json(
      { success: false, message: e?.message || 'Unhandled server error' },
      { status: 500 }
    );
  }
}
