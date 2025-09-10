
import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/ai/flows/send-email-flow';
import { sendWelcomeEmail } from '@/ai/flows/send-welcome-email-flow';
import { z } from 'zod';
import { ConfirmationEmailInputSchema, WelcomeEmailInputSchema } from '@/ai/flows/email-types';

// Define a schema for the request body to validate the type of email
const EmailRequestSchema = z.object({
  type: z.enum(['welcome', 'confirmation']),
  payload: z.any(),
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[API ROUTE] Received request:', body);

    const parsedRequest = EmailRequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      console.error('[API ROUTE] Invalid request body:', parsedRequest.error);
      const errorMessage = parsedRequest.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ success: false, message: `Invalid request body: ${errorMessage}` }, { status: 400 });
    }

    const { type, payload } = parsedRequest.data;

    if (type === 'welcome') {
      const welcomePayload = WelcomeEmailInputSchema.safeParse(payload);
      if (!welcomePayload.success) {
        console.error('[API ROUTE] Invalid welcome email payload:', welcomePayload.error);
        const errorMessage = welcomePayload.error.errors.map(e => `(${e.path.join('.')}) ${e.message}`).join('; ');
        return NextResponse.json({ success: false, message: `Invalid welcome email payload: ${errorMessage}` }, { status: 400 });
      }
      const result = await sendWelcomeEmail(welcomePayload.data);
      return NextResponse.json(result);

    } else if (type === 'confirmation') {
      const confirmationPayload = ConfirmationEmailInputSchema.safeParse(payload);
       if (!confirmationPayload.success) {
        console.error('[API ROUTE] Invalid confirmation email payload:', confirmationPayload.error);
        const errorMessage = confirmationPayload.error.errors.map(e => `(${e.path.join('.')}) ${e.message}`).join('; ');
        return NextResponse.json({ success: false, message: `Invalid confirmation email payload: ${errorMessage}` }, { status: 400 });
      }
      const result = await sendConfirmationEmail(confirmationPayload.data);
      return NextResponse.json(result);

    } else {
        console.error('[API ROUTE] Unknown email type:', type);
        return NextResponse.json({ success: false, message: 'Unknown email type.' }, { status: 400 });
    }

  } catch (error) {
    const e = error as Error;
    console.error('[API ROUTE] An unexpected error occurred:', e);
    return NextResponse.json({ success: false, message: e.message || 'An unexpected server error occurred.' }, { status: 500 });
  }
}

