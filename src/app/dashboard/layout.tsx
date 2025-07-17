'use client';

import AppSidebar from '@/components/ui/app-sidebar';
import '../globals.css';
import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/auth-context';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function RootLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex h-screen w-full flex-col">
          <section className="bg-background flex w-full items-center justify-start gap-6 px-4 py-4">
            <SidebarTrigger className="cursor-pointer" />
            {loading ? (
              <Skeleton className="h-[24px] w-[140px] rounded-full" />
            ) : (
              <h2 className="text-lg font-semibold">{`Hi ${user?.username} `}</h2>
            )}
          </section>
          {children}
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}
