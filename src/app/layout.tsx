import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/language-provider';
import { DataProvider } from '@/contexts/data-provider';
import { AuthProvider } from '@/contexts/auth-provider';
import { AppLayout } from './app-layout';

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
      <AppLayout>
        <AuthProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthProvider>
      </AppLayout>
    </LanguageProvider>
  );
}
