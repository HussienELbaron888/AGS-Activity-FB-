
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-provider";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register, user, loading } = useAuth();
  const { t } = useLanguage();

  // If user is already logged in, redirect them.
  if (loading || user) {
    return null;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      // With mock auth, password is not used.
      await register(fullName, email);
      // The provider will handle redirect and toast.
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Link href="/" className="flex items-center gap-2 text-foreground">
                    <Image src="/aclogo.png" alt="AGS Activities Hub Logo" width={150} height={40} />
                </Link>
            </div>
          <CardTitle className="text-2xl font-headline">{t('Sign Up', 'إنشاء حساب')}</CardTitle>
          <CardDescription>
            {t('Enter your information to create an account', 'أدخل معلوماتك لإنشاء حساب')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid gap-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">{t('First name', 'الاسم الأول')}</Label>
                  <Input 
                    id="first-name" 
                    placeholder={t('Max', 'ماكس')} 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">{t('Last name', 'اسم العائلة')}</Label>
                  <Input 
                    id="last-name" 
                    placeholder={t('Robinson', 'روبنسون')} 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <Label htmlFor="password">{t('Password', 'كلمة المرور')}</Label>
                <Input 
                  id="password" 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('Creating Account...', '...جارٍ إنشاء الحساب') : t('Create an account', 'إنشاء حساب')}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {t('Already have an account?', 'هل لديك حساب بالفعل؟')}{" "}
            <Link href="/login" className="underline">
              {t('Sign in', 'تسجيل الدخول')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
