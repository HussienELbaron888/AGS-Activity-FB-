
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-provider";
import { Mail, Phone, MapPin, Send, Building, School, User, Baby } from "lucide-react";
import { FaYoutube, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

export default function ContactPage() {
  const { t } = useLanguage();
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

  const socialLinks = [
    { icon: FaFacebook, href: 'https://www.facebook.com/agsjed/', 'aria-label': 'Facebook' },
    { icon: FaYoutube, href: 'https://www.youtube.com/channel/UCQBuf0VTJ6qApRQFqxdJHVQ', 'aria-label': 'YouTube' },
    { icon: FaTwitter, href: 'https://x.com/ags_jeddah', 'aria-label': 'X (Twitter) - Main' },
    { icon: FaTwitter, href: 'https://x.com/ags_events', 'aria-label': 'X (Twitter) - Events' },
    { icon: FaInstagram, href: 'https://instagram.com/agsjeddah', 'aria-label': 'Instagram' },
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
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Building className="h-4 w-4 text-primary" />{t('School Administration', 'إدارة المدرسة')}</h4>
                        <div className="space-y-2 pl-6 text-sm">
                            <a href="mailto:info@ags.edu.sa" className="flex items-center gap-2 hover:underline text-muted-foreground"><Mail className="h-4 w-4" /> info@ags.edu.sa</a>
                            <a href="mailto:administration@ags.edu.sa" className="flex items-center gap-2 hover:underline text-muted-foreground"><Mail className="h-4 w-4" /> administration@ags.edu.sa</a>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{t('Reach Us by Phone', 'للتواصل عبر الهاتف')}</h4>
                        <div className="space-y-2 pl-6 text-sm">
                            <a href="tel:+966126570068" className="flex items-center gap-2 hover:underline text-muted-foreground"><Building className="h-4 w-4" /> {t('School Administration', 'إدارة المدرسة')}: +966 12 657 0068</a>
                            <a href="tel:+966126570068" className="flex items-center gap-2 hover:underline text-muted-foreground"><Baby className="h-4 w-4" /> {t('KG School', 'مرحلة الروضة')}: +966 12 657 0068</a>
                            <a href="tel:+966126058011" className="flex items-center gap-2 hover:underline text-muted-foreground"><User className="h-4 w-4" /> {t('Boys School', 'مدارس البنين')}: +966 12 605 8011</a>
                            <a href="tel:+966126580110" className="flex items-center gap-2 hover:underline text-muted-foreground"><School className="h-4 w-4" /> {t('Primary & Girls School', 'الابتدائي والبنات')}: +966 12 658 0110</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{t('Our Location', 'موقعنا')}</h4>
                        <p className="pl-6 text-sm text-muted-foreground">{t('4744 Al Safaa, An Nahdah District, 7607, Jeddah 23615', '٤٧٤٤ الصفا، حي النهضة، ٧٦٠٧، جدة ٢٣٦١٥')}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">{t('Follow Us', 'تابعنا')}</h4>
                        <div className="flex gap-4 pl-6">
                            {socialLinks.map((social, index) => (
                                <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social['aria-label']} className="text-muted-foreground hover:text-primary transition-colors">
                                    <social.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>{t('Find Us on Map', 'تجدنا على الخريطة')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="aspect-w-16 aspect-h-9">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.281896883256!2d39.18738387588385!3d21.5750275685516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3db47f01736e9%3A0x464948f9468f7636!2sAdvanced%20Generation%20Schools%20(AGS)!5e0!3m2!1sen!2sae!4v1722341853613!5m2!1sen!2sae"
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
