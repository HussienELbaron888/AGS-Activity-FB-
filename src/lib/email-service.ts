
/**
 * @fileOverview A service to generate email content for mailto links.
 */

import type { WelcomeEmailTemplateArgs, ConfirmationEmailTemplateArgs } from '@/lib/types';

const APP_NAME = "AGS Activities Hub";
const APP_NAME_AR = "منصة أنشطة مدارس الأجيال المتطورة";

function generateMailtoBody(title: string, content: string): string {
    // For mailto links, we should use plain text. We will strip HTML for reliability.
    const plainTextContent = content
        .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
        .replace(/<p>/gi, '')         // Remove <p> tags
        .replace(/<\/p>/gi, '\n')     // Replace </p> with newlines
        .replace(/<li>/gi, '- ')      // Make list items look like a list
        .replace(/<[^>]*>/g, '')      // Strip all other HTML tags
        .replace(/\n\n+/g, '\n')      // Collapse multiple newlines
        .trim();
    
    return plainTextContent;
}


export const EmailTemplates = {
  welcome: {
    en: (args: WelcomeEmailTemplateArgs) => ({
      subject: "Welcome to AGS Activities Hub!",
      body: generateMailtoBody(
        "Welcome!",
        `<h3>Hi ${args.userName},</h3>
         <p>Welcome to the AGS Activities Hub! We're thrilled to have you with us.</p>
         <p>You can now browse and register for all our exciting school activities, events, and trips.</p>
         <br/>
         <p>Thank you,</p>
         <p><strong>The AGS Activities Team</strong></p>`
      ),
    }),
    ar: (args: WelcomeEmailTemplateArgs) => ({
      subject: `أهلاً بك في ${APP_NAME_AR}!`,
      body: generateMailtoBody(
        "أهلاً بك!",
        `<h3>مرحباً ${args.userName},</h3>
         <p>أهلاً بك في ${APP_NAME_AR}! يسعدنا انضمامك إلينا.</p>
         <p>يمكنك الآن تصفح جميع أنشطتنا وفعالياتنا ورحلاتنا المدرسية المثيرة والتسجيل فيها.</p>
         <br/>
         <p>شكراً لك،</p>
         <p><strong>فريق أنشطة مدارس الأجيال المتطورة</strong></p>`
      ),
    }),
  },
  confirmation: {
    en: (args: ConfirmationEmailTemplateArgs) => ({
      subject: `Confirmation for ${args.activityTitle}`,
      body: generateMailtoBody(
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
         <p><strong>The AGS Activities Team</strong></p>`
      ),
    }),
    ar: (args: ConfirmationEmailTemplateArgs) => ({
      subject: `تأكيد التسجيل في: ${args.activityTitle}`,
      body: generateMailtoBody(
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
         <p><strong>فريق أنشطة مدارس الأجيال المتطورة</strong></p>`
      ),
    }),
  },
};
