
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A loading component to show while auth state is being determined
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

    const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
    
    // If on an auth page and logged in, redirect away
    if (user && isAuthPage) {
      router.replace(isAdmin ? '/admin' : '/');
      return;
    }

    // If trying to access admin page but not logged in as admin, redirect to login
    if (pathname.startsWith('/admin') && !isAdmin) {
      router.replace('/login');
      return;
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
