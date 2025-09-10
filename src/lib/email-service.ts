
/**
 * @fileOverview A service to generate plain text email content for mailto links.
 */

import type { WelcomeEmailTemplateArgs, ConfirmationEmailTemplateArgs } from '@/lib/types';

const APP_NAME_EN = "AGS Activities Hub";
const APP_NAME_AR = "منصة أنشطة مدارس الأجيال المتطورة";


const generateWelcomeBody = (args: WelcomeEmailTemplateArgs): string => {
    return `
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
};

const generateConfirmationBody = (args: ConfirmationEmailTemplateArgs): string => {
    const costTextAr = args.cost && args.cost > 0 ? `${args.cost} ر.س` : 'مجاني';
    const costTextEn = args.cost && args.cost > 0 ? `${args.cost} SAR` : 'Free';
    const paymentNoteAr = args.cost && args.cost > 0 ? 'ملاحظة: سيتم إرسال تفاصيل الدفع في رسالة منفصلة. يتم تأكيد مكانكم عند إتمام الدفع.' : '';
    const paymentNoteEn = args.cost && args.cost > 0 ? 'Please note: Payment details will be sent to you separately. Your spot is confirmed upon payment.' : '';

    // Simple, reliable, plain text output.
    return `
عزيزي ولي الأمر ${args.parentName}،

نشكركم على تسجيل ابنكم/ابنتكم، ${args.studentName}، في النشاط القادم.

تفاصيل التسجيل:
- النشاط: ${args.activityTitleAr}
- التاريخ: ${args.activityDate}
- الوقت: ${args.activityTime}
- الموقع: ${args.activityLocationAr}
- التكلفة: ${costTextAr}

${paymentNoteAr}

نتطلع لرؤيتكم هناك!
شكراً لكم،
فريق أنشطة مدارس الأجيال المتطورة

--------------------------------------------------

Dear ${args.parentName},

Thank you for registering your child, ${args.studentName}, for an upcoming activity.

Registration Details:
- Activity: ${args.activityTitleEn}
- Date: ${args.activityDate}
- Time: ${args.activityTime}
- Location: ${args.activityLocationEn}
- Cost: ${costTextEn}

${paymentNoteEn}

We look forward to seeing you there!
Thank you,
The AGS Activities Team
`;
};


export const EmailTemplates = {
  welcome: (args: WelcomeEmailTemplateArgs) => {
    return {
      subject: `أهلاً بك في ${APP_NAME_AR}! / Welcome to ${APP_NAME_EN}!`,
      body: generateWelcomeBody(args),
    };
  },
  confirmation: (args: ConfirmationEmailTemplateArgs) => {
    const subject = `Confirmation for: ${args.activityTitleEn} / تأكيد التسجيل في: ${args.activityTitleAr}`;
    const body = generateConfirmationBody(args);
    return { subject, body };
  },
};
