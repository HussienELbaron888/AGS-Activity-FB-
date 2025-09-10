import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'noreply@ags-activity.com',
      to: 'ضع-بريد-الاختبار-الخاص-بك@domain.com',
      subject: 'AGS Email Health',
      html: '<p>It works ✅</p>',
    });
    if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message }, { status: 500 });
  }
}
