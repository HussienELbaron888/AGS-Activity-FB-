/**
 * @fileOverview A service to generate email content for mailto links.
 */

import type { WelcomeEmailTemplateArgs, ConfirmationEmailTemplateArgs } from '@/lib/types';

const APP_NAME = "AGS Activities Hub";
const APP_NAME_AR = "منصة أنشطة مدارس الأجيال المتطورة";

function generateMailtoBody(content: string): string {
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
        `Hi ${args.userName},
         
Welcome to the AGS Activities Hub! We're thrilled to have you with us.
You can now browse and register for all our exciting school activities, events, and trips.

Thank you,
The AGS Activities Team`
      ),
    }),
    ar: (args: WelcomeEmailTemplateArgs) => ({
      subject: `أهلاً بك في ${APP_NAME_AR}!`,
      body: generateMailtoBody(
        `مرحباً ${args.userName},
         
أهلاً بك في ${APP_NAME_AR}! يسعدنا انضمامك إلينا.
يمكنك الآن تصفح جميع أنشطتنا وفعالياتنا ورحلاتنا المدرسية المثيرة والتسجيل فيها.

شكراً لك،
فريق أنشطة مدارس الأجيال المتطورة`
      ),
    }),
  },
  confirmation: {
    en: (args: ConfirmationEmailTemplateArgs) => ({
      subject: `Confirmation for ${args.activityTitle}`,
      body: generateMailtoBody(
        `Dear ${args.parentName},

Thank you for registering your child, ${args.studentName}, for an upcoming activity.

Registration Details:
- Activity: ${args.activityTitle}
- Date: ${args.activityDate}
- Time: ${args.activityTime}
- Location: ${args.activityLocation}
- Cost: ${args.cost && args.cost > 0 ? `${args.cost} SAR` : 'Free'}

${args.cost && args.cost > 0 ? 'Please note: Payment details will be sent to you separately. Your spot is confirmed upon payment.' : ''}

We look forward to seeing you there!

Thank you,
The AGS Activities Team`
      ),
    }),
    ar: (args: ConfirmationEmailTemplateArgs) => ({
      subject: `تأكيد التسجيل في: ${args.activityTitle}`,
      body: generateMailtoBody(
        `عزيزي ولي الأمر ${args.parentName},

نشكركم على تسجيل ابنكم/ابنتكم، ${args.studentName}, في النشاط القادم.

تفاصيل التسجيل:
- النشاط: ${args.activityTitle}
- التاريخ: ${args.activityDate}
- الوقت: ${args.activityTime}
- الموقع: ${args.activityLocation}
- التكلفة: ${args.cost && args.cost > 0 ? `${args.cost} ر.س` : 'مجاني'}

${args.cost && args.cost > 0 ? 'ملاحظة: سيتم إرسال تفاصيل الدفع في رسالة منفصلة. يتم تأكيد مكانكم عند إتمام الدفع.' : ''}

نتطلع لرؤيتكم هناك!

شكراً لكم،
فريق أنشطة مدارس الأجيال المتطورة`
      ),
    }),
  },
};
