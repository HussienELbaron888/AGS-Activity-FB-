
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
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import { useLanguage } from "@/contexts/language-provider";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = getAuth(firebaseApp);
  const { t } = useLanguage();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: t("Password Reset Email Sent", "تم إرسال بريد إعادة تعيين كلمة المرور"),
        description: t("Please check your inbox to reset your password.", "يرجى التحقق من بريدك الوارد لإعادة تعيين كلمة المرور."),
      });
    } catch (error: any) {
      toast({
        title: "Error",
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
          <CardTitle className="text-2xl font-headline">{t('Forgot Password', 'نسيت كلمة المرور')}</CardTitle>
          <CardDescription>
            {t("Enter your email and we'll send you a link to reset your password.", "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4">
              <div className="grid gap-2 text-left">
                <Label htmlFor="email">{t('Email', 'البريد الإلكتروني')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('Sending...', '...جار الإرسال') : t('Send Reset Link', 'إرسال رابط إعادة التعيين')}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {t('Remember your password?', 'تذكرت كلمة مرورك؟')}{" "}
            <Link href="/login" className="underline">
              {t('Sign in', 'تسجيل الدخول')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
