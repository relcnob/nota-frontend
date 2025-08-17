'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <PersistThemeToCookies />
      {children}
    </NextThemesProvider>
  );
}

function PersistThemeToCookies() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme) {
      Cookies.set('theme', resolvedTheme, {
        expires: 365,
        path: '/',
      });
    }
  }, [resolvedTheme]);

  return null;
}
