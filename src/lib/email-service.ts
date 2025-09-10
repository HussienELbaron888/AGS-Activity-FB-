
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
    en: (args: WelcomeEmailTemplateArgs) => {
      const html = `Hi ${args.userName},<br><br>Welcome to the AGS Activities Hub! We're thrilled to have you with us.<br>You can now browse and register for all our exciting school activities, events, and trips.<br><br>Thank you,<br>The AGS Activities Team`;
      return {
        subject: "Welcome to AGS Activities Hub!",
        body: generateMailtoBody(html),
      }
    },
    ar: (args: WelcomeEmailTemplateArgs) => {
      const html = `مرحباً ${args.userName},<br><br>أهلاً بك في ${APP_NAME_AR}! يسعدنا انضمامك إلينا.<br>يمكنك الآن تصفح جميع أنشطتنا وفعالياتنا ورحلاتنا المدرسية المثيرة والتسجيل فيها.<br><br>شكراً لك،<br>فريق أنشطة مدارس الأجيال المتطورة`;
      return {
        subject: `أهلاً بك في ${APP_NAME_AR}!`,
        body: generateMailtoBody(html),
      }
    },
  },
  confirmation: {
    en: (args: ConfirmationEmailTemplateArgs) => {
        const html = `Dear ${args.parentName},<br><br>Thank you for registering your child, ${args.studentName}, for an upcoming activity.<br><br><strong>Registration Details:</strong><br>- Activity: ${args.activityTitle}<br>- Date: ${args.activityDate}<br>- Time: ${args.activityTime}<br>- Location: ${args.activityLocation}<br>- Cost: ${args.cost && args.cost > 0 ? `${args.cost} SAR` : 'Free'}<br><br>${args.cost && args.cost > 0 ? 'Please note: Payment details will be sent to you separately. Your spot is confirmed upon payment.' : ''}<br><br>We look forward to seeing you there!<br><br>Thank you,<br>The AGS Activities Team`;
        return {
            subject: `Confirmation for ${args.activityTitle}`,
            body: generateMailtoBody(html)
        }
    },
    ar: (args: ConfirmationEmailTemplateArgs) => {
        const html = `عزيزي ولي الأمر ${args.parentName},<br><br>نشكركم على تسجيل ابنكم/ابنتكم، ${args.studentName}, في النشاط القادم.<br><br><strong>تفاصيل التسجيل:</strong><br>- النشاط: ${args.activityTitle}<br>- التاريخ: ${args.activityDate}<br>- الوقت: ${args.activityTime}<br>- الموقع: ${args.activityLocation}<br>- التكلفة: ${args.cost && args.cost > 0 ? `${args.cost} ر.س` : 'مجاني'}<br><br>${args.cost && args.cost > 0 ? 'ملاحظة: سيتم إرسال تفاصيل الدفع في رسالة منفصلة. يتم تأكيد مكانكم عند إتمام الدفع.' : ''}<br><br>نتطلع لرؤيتكم هناك!<br><br>شكراً لكم،<br>فريق أنشطة مدارس الأجيال المتطورة`;
        return {
            subject: `تأكيد التسجيل في: ${args.activityTitle}`,
            body: generateMailtoBody(html)
        }
    },
  },
};
