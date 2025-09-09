
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

const AuthLoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background">
    <Image src="/aclogo.png" alt="AGS Activities Hub Logo" width={200} height={60} className="mb-8" />
    <div className="flex items-center space-x-2">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    <p className="mt-4 text-muted-foreground">Loading user session...</p>
  </div>
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const isAdmin = useMemo(() => !!user && user.email === 'admin@ags.edu', [user]);

  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/login', '/register', '/forgot-password'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    const isAdminPath = pathname.startsWith('/admin');

    if (user) {
      // User is logged in
      if (isPublicPath) {
        // If on a public page, redirect away
        router.replace(isAdmin ? '/admin' : '/');
      } else if (isAdminPath && !isAdmin) {
        // If a non-admin tries to access an admin path, redirect to home
        router.replace('/');
      }
    } else {
      // User is not logged in
      if (isAdminPath) {
        // If trying to access admin path, redirect to login
        router.replace('/login');
      }
    }
  }, [user, loading, pathname, router, isAdmin]);

  const value = useMemo(() => ({
    user,
    loading,
    isAdmin,
  }), [user, loading, isAdmin]);

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
