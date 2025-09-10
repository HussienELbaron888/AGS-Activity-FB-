
/**
 * @fileOverview A service to generate plain text email content for mailto links.
 */

import type { WelcomeEmailTemplateArgs, RegistrationConfirmationArgs } from '@/lib/types';

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

const generateRegistrationConfirmationBody = (args: RegistrationConfirmationArgs): string => {
    return `
لقد تم الاشتراك في >${args.activityTitleAr}< بنجاح. يمكنك التواصل مع ادارة النشاط لمزيد من التفاصيل.

------------------------------------

You have successfully subscribed to >${args.activityTitleEn}<. You can contact the activity management for more details.
`;
};

export const EmailTemplates = {
  welcome: (args: WelcomeEmailTemplateArgs) => {
    return {
      subject: `أهلاً بك في ${APP_NAME_AR}! / Welcome to ${APP_NAME_EN}!`,
      body: generateWelcomeBody(args),
    };
  },
  registrationConfirmation: (args: RegistrationConfirmationArgs) => {
    return {
      subject: `Subscription Confirmed: ${args.activityTitleEn} / تأكيد الاشتراك: ${args.activityTitleAr}`,
      body: generateRegistrationConfirmationBody(args),
    };
  },
};

    