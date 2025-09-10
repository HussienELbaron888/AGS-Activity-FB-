
'use client';

import { useState } from 'react';
import type { Activity } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/language-provider';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, MailWarning } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { useData } from '@/contexts/data-provider';
import { useAuth } from '@/contexts/auth-provider';
import { generateEmail } from '@/ai/flows/generate-email-flow';
import type { ConfirmationEmailPayload } from '@/lib/types';

interface ActivityRegistrationModalProps {
  activity: Activity;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ActivityRegistrationModal({ activity, isOpen, onOpenChange }: ActivityRegistrationModalProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { addRegistration } = useData();
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = language === 'en' ? activity.title : activity.titleAr;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const registrationData = {
        parentName: formData.get('parent-name') as string,
        email: formData.get('email') as string,
        mobile: formData.get('mobile') as string,
        studentName: formData.get('student-name') as string,
        studentClass: formData.get('class') as string,
    };

    const emailPayload: ConfirmationEmailPayload = {
      to: registrationData.email,
      parentName: registrationData.parentName,
      studentName: registrationData.studentName,
      activityTitle: title,
      activityDate: activity.date,
      activityTime: activity.time,
      activityLocation: language === 'en' ? activity.location : activity.locationAr,
      cost: activity.cost,
    };

    try {
      // 1. Generate the email content using the flow
      const emailContent = await generateEmail({
          type: 'confirmation',
          language,
          payload: emailPayload
      });
      
      // 2. Add registration to local data.
       addRegistration({
        name: registrationData.studentName,
        email: registrationData.email,
        activityId: activity.id,
        photoURL: user?.photoURL || null,
      });

      // 3. Create and open the mailto link in a new tab
      // The body needs to be decoded first, then re-encoded for the mailto link
      const decodedBody = new DOMParser().parseFromString(emailContent.body, "text/html").documentElement.textContent;
      const mailtoHref = `mailto:${emailContent.to}?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(decodedBody || '')}`;
      window.open(mailtoHref, '_blank');
      
      // 4. Show success screen
      setIsSubmitted(true);

    } catch (error) {
        const e = error as Error;
        console.error("Registration failed:", e);
        toast({
            title: t("Registration Failed", "فشل التسجيل"),
            description: e.message || t("Could not generate email. Please try again.", "لم يتمكن من إنشاء البريد الإلكتروني. يرجى المحاولة مرة أخرى."),
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
        setIsSubmitted(false);
        setIsLoading(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!isSubmitted ? (
            <>
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">{t('Register for', 'التسجيل في')}: {title}</DialogTitle>
                <DialogDescription>
                {t('Please fill out the form below to register. You will be asked to send a confirmation email from your own mail client.', 'يرجى ملء النموذج أدناه للتسجيل. سيُطلب منك إرسال بريد إلكتروني للتأكيد من عميل البريد الخاص بك.')}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <ScrollArea className="h-[60vh] max-h-[450px] pr-6 -mr-6">
                <div className="space-y-4 pr-1">
                    <div className="space-y-2">
                        <Label htmlFor="parent-name">{t('Parent\'s Name', 'اسم ولي الأمر')}</Label>
                        <Input id="parent-name" name="parent-name" placeholder={t('Parent\'s full name', 'الاسم الكامل لولي الأمر')} required defaultValue={user?.displayName || ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('Email Address', 'البريد الإلكتروني')}</Label>
                        <Input id="email" name="email" type="email" placeholder={t('your.email@example.com', 'email@example.com')} required defaultValue={user?.email || ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile">{t('Mobile Number', 'رقم الموبايل')}</Label>
                        <Input id="mobile" name="mobile" type="tel" placeholder={t('e.g. 05XXXXXXXX', 'مثال: 05XXXXXXXX')} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="student-name">{t('Student\'s Name', 'اسم الطالب')}</Label>
                        <Input id="student-name" name="student-name" placeholder={t('Student\'s full name', 'الاسم الكامل للطالب')} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="class">{t('Class', 'الفصل')}</Label>
                        <Input id="class" name="class" placeholder={t('e.g. Grade 5B', 'مثال: الصف الخامس - ب')} required />
                    </div>
                    {activity.cost && activity.cost > 0 && (
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <p className="font-semibold">{t('Total Cost', 'التكلفة الإجمالية')}: {activity.cost} {t('SAR', 'ر.س')}</p>
                            <p className="text-xs text-muted-foreground">{t('Payment details will be sent separately.', 'سيتم إرسال تفاصيل الدفع بشكل منفصل.')}</p>
                        </div>
                    )}
                </div>
              </ScrollArea>
              <DialogFooter className="pt-6">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>{t('Cancel', 'إلغاء')}</Button>
                  <Button type="submit" disabled={isLoading}>
                  {isLoading ? t('Processing...', '...جارٍ التنفيذ') : t('Open Email to Confirm', 'افتح البريد للتأكيد')}
                  </Button>
              </DialogFooter>
            </form>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h2 className="text-2xl font-bold font-headline">{t('Registration Submitted!', 'تم تقديم التسجيل!')}</h2>
                <p className="text-muted-foreground">{t('Your registration for', 'تسجيلك في')} {title} {t('has been submitted. Please check your email client.', 'قد تم تقديمه. يرجى التحقق من عميل البريد الإلكتروني الخاص بك.')}</p>
                <div className="flex items-center gap-3 p-3 text-sm bg-yellow-100/50 text-yellow-800 border border-yellow-200/80 rounded-md">
                    <MailWarning className="h-5 w-5 shrink-0"/>
                    <span>{t('Important: You must now click "Send" in the email draft that has been opened to complete your confirmation.', 'هام: يجب عليك الآن الضغط على "إرسال" في مسودة البريد الإلكتروني التي تم فتحها لإكمال تأكيدك.')}</span>
                </div>
                <Button onClick={handleClose}>{t('Done', 'تم')}</Button>
            </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
