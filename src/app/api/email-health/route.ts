import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // جرّب تمرير البريد عبر ?to=you@example.com (اختياري)
  const url = new URL(req.url);
  const toParam = url.searchParams.get('to') || '';

  // بريد اختبار افتراضي (ASCII فقط)
  const fallbackTo = 'test@ags-activity.com'; // غيّره لبريدك الحقيقي

  // دالة تحقق بسيطة
  const to = (toParam || fallbackTo).trim();
  const isAscii = /^[\x00-\x7F]+$/.test(to); // كلّه ASCII؟
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to);

  if (!isAscii || !looksLikeEmail) {
    return NextResponse.json(
      { ok: false, message: 'Invalid ASCII email in `to` (use e.g. you@gmail.com)' },
      { status: 422 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'noreply@ags-activity.com',
      to,
      subject: 'AGS Email Health',
      html: '<p>It works ✅</p>',
    });

    if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message }, { status: 500 });
  }
}
