import { ReactNode } from 'react';
import './globals.css';
import { cookies } from 'next/headers';
import { Providers } from '@/util/helpers/providers';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'system';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Nota - Listing app</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <Providers theme={theme}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
