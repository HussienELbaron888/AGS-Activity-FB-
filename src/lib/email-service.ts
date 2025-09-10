
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
        .replace(/<hr\s*\/?>/gi, '\n------------------------------------\n') // Convert <hr> to a separator
        .replace(/<[^>]*>/g, '')      // Strip all other HTML tags
        .replace(/\n\n+/g, '\n')      // Collapse multiple newlines
        .trim();
    
    return plainTextContent;
}


export const EmailTemplates = {
  welcome: {
    en: (args: WelcomeEmailTemplateArgs) => {
      const html = `
        <p>Hi ${args.userName},</p>
        <p>Welcome to the AGS Activities Hub! We're thrilled to have you with us. You can now browse and register for all our exciting school activities, events, and trips.</p>
        <p>Thank you,<br>The AGS Activities Team</p>
        <hr>
        <div dir="rtl" style="text-align: right;">
          <p>مرحباً ${args.userName}،</p>
          <p>أهلاً بك في ${APP_NAME_AR}! يسعدنا انضمامك إلينا. يمكنك الآن تصفح جميع أنشطتنا وفعالياتنا ورحلاتنا المدرسية المثيرة والتسجيل فيها.</p>
          <p>شكراً لك،<br>فريق أنشطة مدارس الأجيال المتطورة</p>
        </div>
      `;
      return {
        subject: "Welcome to AGS Activities Hub!",
        body: generateMailtoBody(html),
      }
    },
    ar: (args: WelcomeEmailTemplateArgs) => {
      const html = `
        <div dir="rtl" style="text-align: right;">
          <p>مرحباً ${args.userName}،</p>
          <p>أهلاً بك في ${APP_NAME_AR}! يسعدنا انضمامك إلينا. يمكنك الآن تصفح جميع أنشطتنا وفعالياتنا ورحلاتنا المدرسية المثيرة والتسجيل فيها.</p>
          <p>شكراً لك،<br>فريق أنشطة مدارس الأجيال المتطورة</p>
        </div>
        <hr>
        <p>Hi ${args.userName},</p>
        <p>Welcome to the AGS Activities Hub! We're thrilled to have you with us. You can now browse and register for all our exciting school activities, events, and trips.</p>
        <p>Thank you,<br>The AGS Activities Team</p>
      `;
      return {
        subject: `أهلاً بك في ${APP_NAME_AR}!`,
        body: generateMailtoBody(html),
      }
    },
  },
  confirmation: {
    en: (args: ConfirmationEmailTemplateArgs) => {
        const html = `
            <p>Dear ${args.parentName},</p>
            <p>Thank you for registering your child, <strong>${args.studentName}</strong>, for an upcoming activity.</p>
            <br>
            <p><strong>Registration Details:</strong></p>
            <ul>
                <li>Activity: ${args.activityTitle}</li>
                <li>Date: ${args.activityDate}</li>
                <li>Time: ${args.activityTime}</li>
                <li>Location: ${args.activityLocation}</li>
                <li>Cost: ${args.cost && args.cost > 0 ? `${args.cost} SAR` : 'Free'}</li>
            </ul>
            <p>${args.cost && args.cost > 0 ? 'Please note: Payment details will be sent to you separately. Your spot is confirmed upon payment.' : ''}</p>
            <p>We look forward to seeing you there!</p>
            <br>
            <p>Thank you,<br>The AGS Activities Team</p>
            <hr>
            <div dir="rtl" style="text-align: right;">
                <p>عزيزي ولي الأمر ${args.parentName}،</p>
                <p>نشكركم على تسجيل ابنكم/ابنتكم، <strong>${args.studentName}</strong>، في النشاط القادم.</p>
                <br>
                <p><strong>تفاصيل التسجيل:</strong></p>
                <ul>
                    <li>النشاط: ${args.activityTitle}</li>
                    <li>التاريخ: ${args.activityDate}</li>
                    <li>الوقت: ${args.activityTime}</li>
                    <li>الموقع: ${args.activityLocation}</li>
                    <li>التكلفة: ${args.cost && args.cost > 0 ? `${args.cost} ر.س` : 'مجاني'}</li>
                </ul>
                <p>${args.cost && args.cost > 0 ? 'ملاحظة: سيتم إرسال تفاصيل الدفع في رسالة منفصلة. يتم تأكيد مكانكم عند إتمام الدفع.' : ''}</p>
                <p>نتطلع لرؤيتكم هناك!</p>
                <br>
                <p>شكراً لكم،<br>فريق أنشطة مدارس الأجيال المتطورة</p>
            </div>
        `;
        return {
            subject: `Confirmation for ${args.activityTitle}`,
            body: generateMailtoBody(html)
        }
    },
    ar: (args: ConfirmationEmailTemplateArgs) => {
        const html = `
            <div dir="rtl" style="text-align: right;">
                <p>عزيزي ولي الأمر ${args.parentName}،</p>
                <p>نشكركم على تسجيل ابنكم/ابنتكم، <strong>${args.studentName}</strong>، في النشاط القادم.</p>
                <br>
                <p><strong>تفاصيل التسجيل:</strong></p>
                <ul>
                    <li>النشاط: ${args.activityTitle}</li>
                    <li>التاريخ: ${args.activityDate}</li>
                    <li>الوقت: ${args.activityTime}</li>
                    <li>الموقع: ${args.activityLocation}</li>
                    <li>التكلفة: ${args.cost && args.cost > 0 ? `${args.cost} ر.س` : 'مجاني'}</li>
                </ul>
                <p>${args.cost && args.cost > 0 ? 'ملاحظة: سيتم إرسال تفاصيل الدفع في رسالة منفصلة. يتم تأكيد مكانكم عند إتمام الدفع.' : ''}</p>
                <p>نتطلع لرؤيتكم هناك!</p>
                <br>
                <p>شكراً لكم،<br>فريق أنشطة مدارس الأجيال المتطورة</p>
            </div>
            <hr>
            <p>Dear ${args.parentName},</p>
            <p>Thank you for registering your child, <strong>${args.studentName}</strong>, for an upcoming activity.</p>
            <br>
            <p><strong>Registration Details:</strong></p>
            <ul>
                <li>Activity: ${args.activityTitle}</li>
                <li>Date: ${args.activityDate}</li>
                <li>Time: ${args.activityTime}</li>
                <li>Location: ${args.activityLocation}</li>
                <li>Cost: ${args.cost && args.cost > 0 ? `${args.cost} SAR` : 'Free'}</li>
            </ul>
            <p>${args.cost && args.cost > 0 ? 'Please note: Payment details will be sent to you separately. Your spot is confirmed upon payment.' : ''}</p>
            <p>We look forward to seeing you there!</p>
            <br>
            <p>Thank you,<br>The AGS Activities Team</p>
        `;
        return {
            subject: `تأكيد التسجيل في: ${args.activityTitle}`,
            body: generateMailtoBody(html)
        }
    },
  },
};
