'use client';

import { useState } from 'react';
import type { Activity } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/language-provider';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

interface ActivityRegistrationModalProps {
  activity: Activity;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ActivityRegistrationModal({ activity, isOpen, onOpenChange }: ActivityRegistrationModalProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = language === 'en' ? activity.title : activity.titleAr;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
    toast({
      title: t("Registration Successful!", "تم التسجيل بنجاح!"),
      description: t(`You will receive a confirmation email shortly.`, `سوف تتلقى رسالة تأكيد بالبريد الإلكتروني قريبا.`),
      variant: 'default',
    });
  };
  
  const handleClose = () => {
    onOpenChange(false);
    // Reset state after a delay to allow for closing animation
    setTimeout(() => {
        setIsSubmitted(false);
        setIsLoading(false);
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!isSubmitted ? (
            <>
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">{t('Register for', 'التسجيل في')}: {title}</DialogTitle>
                <DialogDescription>
                {t('Please fill out the form below to register.', 'يرجى ملء النموذج أدناه للتسجيل.')}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('Full Name', 'الاسم الكامل')}</Label>
                    <Input id="name" placeholder={t('Your full name', 'اسمك الكامل')} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t('Email Address', 'البريد الإلكتروني')}</Label>
                    <Input id="email" type="email" placeholder={t('your.email@example.com', 'email@example.com')} required />
                </div>
                 {activity.cost && activity.cost > 0 && (
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="font-semibold">{t('Total Cost', 'التكلفة الإجمالية')}: ${activity.cost}</p>
                        <p className="text-xs text-muted-foreground">{t('Payment details will be sent via email.', 'سيتم إرسال تفاصيل الدفع عبر البريد الإلكتروني.')}</p>
                    </div>
                )}
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>{t('Cancel', 'إلغاء')}</Button>
                    <Button type="submit" disabled={isLoading}>
                    {isLoading ? t('Submitting...', 'جارٍ الإرسال...') : t('Confirm Registration', 'تأكيد التسجيل')}
                    </Button>
                </DialogFooter>
            </form>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h2 className="text-2xl font-bold font-headline">{t('Registration Confirmed!', 'تم تأكيد التسجيل!')}</h2>
                <p className="text-muted-foreground">{t('Thank you for registering for', 'شكرًا لتسجيلك في')} {title}. {t('A confirmation email is on its way.', 'رسالة التأكيد في طريقها إليك.')}</p>
                <Button onClick={handleClose}>{t('Done', 'تم')}</Button>
            </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
