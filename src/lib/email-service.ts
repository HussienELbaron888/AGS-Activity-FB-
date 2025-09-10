
/**
 * @fileOverview A service to generate plain text email content for mailto links.
 */

import type { WelcomeEmailTemplateArgs, ConfirmationEmailTemplateArgs } from '@/lib/types';

const APP_NAME_EN = "AGS Activities Hub";
const APP_NAME_AR = "منصة أنشطة مدارس الأجيال المتطورة";

const welcomeTemplate = (args: WelcomeEmailTemplateArgs) => `
مرحباً ${args.userName}،
أهلاً بك في ${APP_NAME_AR}! يسعدنا انضمامك إلينا. يمكنك الآن تصفح جميع أنشطتنا وفعالياتنا ورحلاتنا المدرسية المثيرة والتسجيل فيها.
شكراً لك،
فريق أنشطة مدارس الأجيال المتطورة

------------------------------------

Hi ${args.userName},
Welcome to the ${APP_NAME_EN}! We're thrilled to have you with us. You can now browse and register for all our exciting school activities, events, and trips.
Thank you,
The AGS Activities Team
`;

const confirmationTemplate = (args: ConfirmationEmailTemplateArgs) => `
عزيزي ولي الأمر ${args.parentName}،
نشكركم على تسجيل ابنكم/ابنتكم، ${args.studentName}، في النشاط القادم.

تفاصيل التسجيل:
- النشاط: ${args.activityTitleAr}
- التاريخ: ${args.activityDate}
- الوقت: ${args.activityTime}
- الموقع: ${args.activityLocationAr}
- التكلفة: ${args.cost && args.cost > 0 ? `${args.cost} ر.س` : 'مجاني'}

${args.cost && args.cost > 0 ? 'ملاحظة: سيتم إرسال تفاصيل الدفع في رسالة منفصلة. يتم تأكيد مكانكم عند إتمام الدفع.' : ''}

نتطلع لرؤيتكم هناك!
شكراً لكم،
فريق أنشطة مدارس الأجيال المتطورة

------------------------------------

Dear ${args.parentName},
Thank you for registering your child, ${args.studentName}, for an upcoming activity.

Registration Details:
- Activity: ${args.activityTitleEn}
- Date: ${args.activityDate}
- Time: ${args.activityTime}
- Location: ${args.activityLocationEn}
- Cost: ${args.cost && args.cost > 0 ? `${args.cost} SAR` : 'Free'}

${args.cost && args.cost > 0 ? 'Please note: Payment details will be sent to you separately. Your spot is confirmed upon payment.' : ''}

We look forward to seeing you there!
Thank you,
The AGS Activities Team
`;

export const EmailTemplates = {
  welcome: (lang: 'en' | 'ar', args: WelcomeEmailTemplateArgs) => {
    return {
      subject: lang === 'ar' ? `أهلاً بك في ${APP_NAME_AR}!` : `Welcome to ${APP_NAME_EN}!`,
      body: welcomeTemplate(args),
    };
  },
  confirmation: (lang: 'en' | 'ar', args: ConfirmationEmailTemplateArgs) => {
    return {
      subject: lang === 'ar' ? `تأكيد التسجيل في: ${args.activityTitleAr}` : `Confirmation for ${args.activityTitleEn}`,
      body: confirmationTemplate(args),
    };
  },
};

    