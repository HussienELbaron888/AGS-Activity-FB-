
'use client';

import { usePathname } from 'next/navigation';
import { AppFooter } from '@/components/layout/footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  const isContactPage = pathname.includes('/contact');

  if (isContactPage) {
    return null;
  }

  return <AppFooter />;
}
