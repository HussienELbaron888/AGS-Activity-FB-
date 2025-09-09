
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-provider";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const { t, direction } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: t("Message Sent!", "!تم إرسال الرسالة"),
      description: t("Thank you for contacting us. We will get back to you shortly.", "شكراً لتواصلك معنا. سنرد عليك قريباً."),
    });
    // @ts-ignore
    e.target.reset();
  };

  const contactInfo = [
    { icon: Mail, text: 'info@ags.edu', href: 'mailto:info@ags.edu' },
    { icon: Phone, text: '+1 (234) 567-890', href: 'tel:+1234567890' },
    { icon: MapPin, text: t('123 School Lane, Education City', '١٢٣ شارع المدرسة، مدينة التعليم'), href: '#' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('Contact Us', 'اتصل بنا')}
        </h1>
        <p className="text-muted-foreground">
          {t('We would love to hear from you. Please fill out the form below or use our contact details.', 'يسعدنا أن نسمع منك. يرجى ملء النموذج أدناه أو استخدام تفاصيل الاتصال الخاصة بنا.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('Send us a Message', 'أرسل لنا رسالة')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('Full Name', 'الاسم الكامل')}</Label>
                    <Input id="name" placeholder={t('Your Name', 'اسمك')} required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('Email Address', 'البريد الإلكتروني')}</Label>
                    <Input id="email" type="email" placeholder={t('your.email@example.com', 'example@email.com')} required disabled={isLoading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('Subject', 'الموضوع')}</Label>
                  <Input id="subject" placeholder={t('How can we help?', 'كيف يمكننا المساعدة؟')} required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('Message', 'الرسالة')}</Label>
                  <Textarea id="message" placeholder={t('Your message here...', '...اكتب رسالتك هنا')} rows={6} required disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Send className="mr-2 h-4 w-4" />
                  {isLoading ? t('Sending...', '...جار الإرسال') : t('Send Message', 'إرسال الرسالة')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('Contact Information', 'معلومات الاتصال')}</CardTitle>
              <CardDescription>{t('Reach out to us directly through the channels below.', 'تواصل معنا مباشرة عبر القنوات أدناه.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <a href={item.href} className="hover:underline text-sm font-medium">
                      {item.text}
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
           <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>{t('Our Location', 'موقعنا')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="aspect-w-16 aspect-h-9">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.536294724933!2d31.2452816151152!3d30.04901988188175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840b896b83f3d%3A0x286b245e3c1a3b83!2sTahrir%20Square!5e0!3m2!1sen!2seg!4v1625585094958!5m2!1sen!2seg"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={t('School Location Map', 'خريطة موقع المدرسة')}
                ></iframe>
                </div>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
