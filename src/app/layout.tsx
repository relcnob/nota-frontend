'use client';

import { ReactNode } from 'react';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <title>Nota - Shopping List App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="bg-background text-foreground antialiased">
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}
