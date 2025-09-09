
'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';
import Link from 'next/link';

export function AppFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-start">
          <div>
            <h3 className="text-lg font-bold font-headline mb-4">{t('Contact Us', 'تواصل معنا')}</h3>
            <div className="space-y-3">
              <p className="flex items-center justify-center md:justify-start gap-3">
                <Mail className="h-5 w-5" />
                <a href="mailto:info@ags.edu" className="hover:underline">info@ags.edu</a>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="h-5 w-5" />
                <span>+1 (234) 567-890</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-3">
                <MapPin className="h-5 w-5" />
                <span>{t('123 School Lane, Education City', '١٢٣ شارع المدرسة، مدينة التعليم')}</span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold font-headline mb-4">{t('Quick Links', 'روابط سريعة')}</h3>
            <ul className="space-y-2">
              <li><Link href="/events" className="hover:underline">{t('Events', 'الفعاليات')}</Link></li>
              <li><Link href="/gallery" className="hover:underline">{t('Gallery', 'معرض الصور')}</Link></li>
              <li><Link href="/contact" className="hover:underline">{t('Contact Us', 'اتصل بنا')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold font-headline mb-4">{t('Follow Us', 'تابعنا')}</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {/* Add social media icons here if available */}
            </div>
             <p className="text-sm mt-4 opacity-80">
              {t('Stay connected with us on social media for the latest updates.', 'ابق على تواصل معنا على وسائل التواصل الاجتماعي للحصول على آخر التحديثات.')}
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {t('AGS Activity Hub. All rights reserved.', 'مركز أنشطة AGS. جميع الحقوق محفوظة.')}</p>
        </div>
      </div>
    </footer>
  );
}
