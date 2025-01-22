'use client';

import { HeroUIProvider } from '@heroui/react';

export function HeroUiProvider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
