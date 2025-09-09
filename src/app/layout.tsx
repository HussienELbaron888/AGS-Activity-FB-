import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/language-provider';
import { AppLayout } from './app-layout';
import { DataProvider } from '@/contexts/data-provider';
import { AuthProvider } from '@/contexts/auth-provider';

export const metadata: Metadata = {
  title: 'AGS Activities Hub',
  description: 'Your central place for all school activities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <AppLayout>{children}</AppLayout>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
