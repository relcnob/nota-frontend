// app/layout.tsx
import Link from 'next/link';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'My App',
  description: 'Next.js App Router Example',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>My App</h1>
<nav>
  <Link href="/">Home</Link>
  <Link href="/login">About</Link>
</nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}