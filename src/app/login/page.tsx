
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
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [email, setEmail] = useState('admin@ags.edu');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = getAuth(firebaseApp);
  const { user } = useAuth();
  const router = useRouter();
  
  if (user) {
    // router.replace('/'); // AuthProvider already handles this, but as a fallback.
    return null; // Render nothing while redirecting
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // AuthProvider will handle the redirect, no need to push here.
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' && email === 'admin@ags.edu') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          // Don't need to sign in again, onAuthStateChanged will handle it.
        } catch (creationError: any) {
           toast({
            title: "Admin Creation Failed",
            description: creationError.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
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
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
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
              <p className="px-1 text-center text-xs text-muted-foreground">
                Use <span className="font-semibold text-foreground">admin@ags.edu</span> and password <span className="font-semibold text-foreground">123456</span> to sign in.
              </p>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
