
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      
      // Redirect logic
      const isAdminPage = pathname.startsWith('/admin');
      if (!loading && !currentUser && isAdminPage) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, loading, pathname, router]);

  const isAdmin = useMemo(() => !!user && user.email === 'admin@ags.edu', [user]);

  const value = useMemo(() => ({
    user,
    loading,
    isAdmin,
  }), [user, loading, isAdmin]);

  // Don't render children until loading is false to avoid flashes of unauthenticated content
  if (loading) {
    return null; // Or a full-page loader
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
