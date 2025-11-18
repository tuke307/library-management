"use client";
import * as React from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
