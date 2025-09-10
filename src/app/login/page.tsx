
'use client';

import Link from "next/link"
import Image from "next/image"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-provider";

export default function LoginPage() {
  const [email, setEmail] = useState('admin@ags.edu');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  if (loading || user) {
    return null; 
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // With mock auth, password is not checked.
      login(email);
      // The provider will handle redirect.
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Link href="/" className="flex items-center gap-2 text-foreground">
                    <Image src="/aclogo.png" alt="AGS Activities Hub Logo" width={150} height={40} />
                </Link>
            </div>
          <CardTitle className="text-2xl font-headline">{t('Login', 'تسجيل الدخول')}</CardTitle>
          <CardDescription>
            {t('Enter your email below to login to your account', 'أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2 text-left">
                <Label htmlFor="email">{t('Email', 'البريد الإلكتروني')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('m@example.com', 'm@example.com')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2 text-left">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('Password', 'كلمة المرور')}</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    {t('Forgot your password?', 'هل نسيت كلمة المرور؟')}
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('Logging in...', '...جارٍ تسجيل الدخول') : t('Login', 'تسجيل الدخول')}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {t("Don't have an account?", 'ليس لديك حساب؟')}{" "}
            <Link href="/register" className="underline">
              {t('Sign up', 'التسجيل')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
