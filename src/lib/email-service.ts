/**
 * @fileOverview A service to generate email content using hardcoded templates.
 *
 * - generateEmailContent - A function that generates email subject and body.
 */

import type { GenerateEmailInput, GenerateEmailOutput, WelcomeEmailPayload, ConfirmationEmailPayload } from '@/lib/types';

// --- English Templates ---
const enTemplates = {
  welcome: {
    subject: "Welcome to AGS Activities Hub!",
    body: (payload: WelcomeEmailPayload) => `
      <h1>Hi ${payload.name},</h1>
      <p>Welcome to the AGS Activities Hub! We're thrilled to have you with us.</p>
      <p>You can now browse and register for all our exciting school activities, events, and trips.</p>
      <br/>
      <p>Thank you!</p>
      <p><strong>AGS Activities Hub</strong></p>
    `,
  },
  confirmation: {
    subject: (payload: ConfirmationEmailPayload) => `Confirmation for ${payload.activityTitle}`,
    body: (payload: ConfirmationEmailPayload) => `
      <p>Dear ${payload.parentName},</p>
      <p>Thank you for registering your child, <strong>${payload.studentName}</strong>, for the upcoming activity.</p>
      
      <h3>Registration Details:</h3>
      <ul>
        <li><strong>Activity:</strong> ${payload.activityTitle}</li>
        <li><strong>Date:</strong> ${payload.activityDate}</li>
        <li><strong>Time:</strong> ${payload.activityTime}</li>
        <li><strong>Location:</strong> ${payload.activityLocation}</li>
        <li><strong>Cost:</strong> ${payload.cost && payload.cost > 0 ? `${payload.cost} SAR` : 'Free'}</li>
      </ul>
      
      ${payload.cost && payload.cost > 0 ? '<p>Payment details will be sent to you in a separate email. Please ensure payment is made to confirm your spot.</p>' : ''}
      
      <p>We look forward to seeing you there!</p>
      <br/>
      <p>Thank you!</p>
      <p><strong>AGS Activities Hub</strong></p>
    `,
  },
};

// --- Arabic Templates ---
const arTemplates = {
    welcome: {
      subject: "أهلاً بك في منصة أنشطة مدارس الأجيال المتطورة!",
      body: (payload: WelcomeEmailPayload) => `
        <h1 style="text-align: right;">مرحباً ${payload.name},</h1>
        <p style="text-align: right;">أهلاً بك في منصة أنشطة مدارس الأجيال المتطورة! يسعدنا انضمامك إلينا.</p>
        <p style="text-align: right;">يمكنك الآن تصفح جميع أنشطتنا وفعالياتنا ورحلاتنا المدرسية المثيرة والتسجيل فيها.</p>
        <br/>
        <p style="text-align: right;">شكراً لك!</p>
        <p style="text-align: right;"><strong>منصة أنشطة مدارس الأجيال المتطورة</strong></p>
      `,
    },
    confirmation: {
      subject: (payload: ConfirmationEmailPayload) => `تأكيد التسجيل في ${payload.activityTitle}`,
      body: (payload: ConfirmationEmailPayload) => `
        <p style="text-align: right;">عزيزي ولي الأمر ${payload.parentName},</p>
        <p style="text-align: right;">نشكركم على تسجيل ابنكم/ابنتكم، <strong>${payload.studentName}</strong>, في النشاط القادم.</p>
        
        <h3 style="text-align: right;">تفاصيل التسجيل:</h3>
        <ul style="text-align: right; padding-right: 20px;">
          <li><strong>النشاط:</strong> ${payload.activityTitle}</li>
          <li><strong>التاريخ:</strong> ${payload.activityDate}</li>
          <li><strong>الوقت:</strong> ${payload.activityTime}</li>
          <li><strong>الموقع:</strong> ${payload.activityLocation}</li>
          <li><strong>التكلفة:</strong> ${payload.cost && payload.cost > 0 ? `${payload.cost} ر.س` : 'مجاني'}</li>
        </ul>
        
        ${payload.cost && payload.cost > 0 ? '<p style="text-align: right;">سيتم إرسال تفاصيل الدفع في رسالة منفصلة. يرجى التأكد من إتمام الدفع لتأكيد مكانكم.</p>' : ''}
        
        <p style="text-align: right;">نتطلع لرؤيتكم هناك!</p>
        <br/>
        <p style="text-align: right;">شكراً لكم!</p>
        <p style="text-align: right;"><strong>منصة أنشطة مدارس الأجيال المتطورة</strong></p>
      `,
    },
  };

export function generateEmailContent(input: GenerateEmailInput): GenerateEmailOutput {
  const templates = input.language === 'ar' ? arTemplates : enTemplates;
  let subject = '';
  let body = '';
  let to = '';

  if (input.type === 'welcome') {
    const payload = input.payload as WelcomeEmailPayload;
    subject = templates.welcome.subject;
    body = templates.welcome.body(payload);
    to = payload.to;
  } else if (input.type === 'confirmation') {
    const payload = input.payload as ConfirmationEmailPayload;
    subject = templates.confirmation.subject(payload);
    body = templates.confirmation.body(payload);
    to = payload.to;
  } else {
    throw new Error('Invalid email type specified.');
  }

  return { subject, body, to };
}
