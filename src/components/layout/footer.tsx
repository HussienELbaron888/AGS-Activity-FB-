
'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';
import Link from 'next/link';
import { FaYoutube, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

export function AppFooter() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: FaFacebook, href: 'https://www.facebook.com/agsjed/', 'aria-label': 'Facebook' },
    { icon: FaYoutube, href: 'https://www.youtube.com/channel/UCQBuf0VTJ6qApRQFqxdJHVQ', 'aria-label': 'YouTube' },
    { icon: FaTwitter, href: 'https://x.com/ags_jeddah', 'aria-label': 'X (Twitter) - Main' },
    { icon: FaTwitter, href: 'https://x.com/ags_events', 'aria-label': 'X (Twitter) - Events' },
    { icon: FaInstagram, href: 'https://instagram.com/agsjeddah', 'aria-label': 'Instagram' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div>
            <h3 className="text-lg font-bold font-headline mb-4">{t('School Administration', 'إدارة المدرسة')}</h3>
            <div className="space-y-3 text-sm">
              <a href="mailto:info@ags.edu.sa" className="flex items-start gap-3 hover:underline">
                <Mail className="h-5 w-5 mt-0.5 shrink-0" />
                <span>info@ags.edu.sa</span>
              </a>
              <a href="mailto:administration@ags.edu.sa" className="flex items-start gap-3 hover:underline">
                <Mail className="h-5 w-5 mt-0.5 shrink-0" />
                <span>administration@ags.edu.sa</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold font-headline mb-4">{t('Reach Us by Phone', 'للتواصل عبر الهاتف')}</h3>
            <div className="space-y-3 text-sm">
                <a href="tel:+966126570068" className="flex items-start gap-3 hover:underline">
                    <Phone className="h-5 w-5 mt-0.5 shrink-0" />
                    <span>{t('Admin & KG', 'الإدارة والروضة')}:<br/>+966 12 657 0068</span>
                </a>
                 <a href="tel:+966126058011" className="flex items-start gap-3 hover:underline">
                    <Phone className="h-5 w-5 mt-0.5 shrink-0" />
                    <span>{t('Boys School', 'مدارس البنين')}:<br/>+966 12 605 8011</span>
                </a>
                 <a href="tel:+966126580110" className="flex items-start gap-3 hover:underline">
                    <Phone className="h-5 w-5 mt-0.5 shrink-0" />
                    <span>{t('Primary & Girls', 'الابتدائي والبنات')}:<br/>+966 12 658 0110</span>
                </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-headline mb-4">{t('Our Location', 'موقعنا')}</h3>
            <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                <span>{t('4744 Al Safaa, An Nahdah District, 7607, Jeddah 23615', '٤٧٤٤ الصفا، حي النهضة، ٧٦٠٧، جدة ٢٣٦١٥')}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-headline mb-4">{t('Follow Us', 'تابعنا')}</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                  <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social['aria-label']} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                      <social.icon className="h-6 w-6" />
                  </a>
              ))}
            </div>
          </div>

        </div>
        <div className="mt-10 pt-8 border-t border-primary-foreground/20 text-center text-sm">
          <p>{t('AGS© Activities Platform - All rights reserved 2025 - 2026', 'منصة انشطة مدارس الأجيال المتطورة العالمية© - جميع الحقوق محفوظة 2025 - 2026')}</p>
        </div>
      </div>
    </footer>
  );
}
