/**
 * @fileOverview A service to generate email content for mailto links.
 */

import type { WelcomeEmailTemplateArgs, ConfirmationEmailTemplateArgs } from '@/lib/types';

const APP_NAME = "AGS Activities Hub";
const APP_NAME_AR = "منصة أنشطة مدارس الأجيال المتطورة";

function generateEmailHTML(title: string, content: string, lang: 'en' | 'ar'): string {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    return `
<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 1.6; color: #333; }
        .container { width: 90%; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .header { background-color: #004d99; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 0.8em; color: #777; }
        ul { padding-${lang === 'ar' ? 'right' : 'left'}: 20px; }
    </style>
</head>
<body style="direction: ${dir};">
    <div class="container">
        <div class="header">
            <h1>${lang === 'ar' ? APP_NAME_AR : APP_NAME}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${APP_NAME}</p>
        </div>
    </div>
</body>
</html>
    `;
}


export const EmailTemplates = {
  welcome: {
    en: (args: WelcomeEmailTemplateArgs) => ({
      subject: "Welcome to AGS Activities Hub!",
      body: generateEmailHTML(
        "Welcome!",
        `<h3>Hi ${args.userName},</h3>
         <p>Welcome to the AGS Activities Hub! We're thrilled to have you with us.</p>
         <p>You can now browse and register for all our exciting school activities, events, and trips.</p>
         <br/>
         <p>Thank you,</p>
         <p><strong>The AGS Activities Team</strong></p>`,
        'en'
      ),
    }),
    ar: (args: WelcomeEmailTemplateArgs) => ({
      subject: `أهلاً بك في ${APP_NAME_AR}!`,
      body: generateEmailHTML(
        "أهلاً بك!",
        `<h3>مرحباً ${args.userName},</h3>
         <p>أهلاً بك في ${APP_NAME_AR}! يسعدنا انضمامك إلينا.</p>
         <p>يمكنك الآن تصفح جميع أنشطتنا وفعالياتنا ورحلاتنا المدرسية المثيرة والتسجيل فيها.</p>
         <br/>
         <p>شكراً لك،</p>
         <p><strong>فريق أنشطة مدارس الأجيال المتطورة</strong></p>`,
        'ar'
      ),
    }),
  },
  confirmation: {
    en: (args: ConfirmationEmailTemplateArgs) => ({
      subject: `Confirmation for ${args.activityTitle}`,
      body: generateEmailHTML(
        "Registration Confirmation",
        `<p>Dear ${args.parentName},</p>
         <p>Thank you for registering your child, <strong>${args.studentName}</strong>, for an upcoming activity.</p>
         <h4>Registration Details:</h4>
         <ul>
           <li><strong>Activity:</strong> ${args.activityTitle}</li>
           <li><strong>Date:</strong> ${args.activityDate}</li>
           <li><strong>Time:</strong> ${args.activityTime}</li>
           <li><strong>Location:</strong> ${args.activityLocation}</li>
           <li><strong>Cost:</strong> ${args.cost && args.cost > 0 ? `${args.cost} SAR` : 'Free'}</li>
         </ul>
         ${args.cost && args.cost > 0 ? '<p>Please note: Payment details will be sent to you separately. Your spot is confirmed upon payment.</p>' : ''}
         <p>We look forward to seeing you there!</p>
         <br/>
         <p>Thank you,</p>
         <p><strong>The AGS Activities Team</strong></p>`,
        'en'
      ),
    }),
    ar: (args: ConfirmationEmailTemplateArgs) => ({
      subject: `تأكيد التسجيل في: ${args.activityTitle}`,
      body: generateEmailHTML(
        "تأكيد التسجيل",
        `<p>عزيزي ولي الأمر ${args.parentName},</p>
         <p>نشكركم على تسجيل ابنكم/ابنتكم، <strong>${args.studentName}</strong>, في النشاط القادم.</p>
         <h4>تفاصيل التسجيل:</h4>
         <ul>
           <li><strong>النشاط:</strong> ${args.activityTitle}</li>
           <li><strong>التاريخ:</strong> ${args.activityDate}</li>
           <li><strong>الوقت:</strong> ${args.activityTime}</li>
           <li><strong>الموقع:</strong> ${args.activityLocation}</li>
           <li><strong>التكلفة:</strong> ${args.cost && args.cost > 0 ? `${args.cost} ر.س` : 'مجاني'}</li>
         </ul>
         ${args.cost && args.cost > 0 ? '<p>ملاحظة: سيتم إرسال تفاصيل الدفع في رسالة منفصلة. يتم تأكيد مكانكم عند إتمام الدفع.</p>' : ''}
         <p>نتطلع لرؤيتكم هناك!</p>
         <br/>
         <p>شكراً لكم،</p>
         <p><strong>فريق أنشطة مدارس الأجيال المتطورة</strong></p>`,
        'ar'
      ),
    }),
  },
};
