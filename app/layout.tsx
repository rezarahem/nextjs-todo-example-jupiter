import type { Metadata } from 'next';
import './globals.css';
import { HeroUiProvider } from '@/providers/heroui-provider';
import { ToastProvider } from '@/providers/toast-provider';

export const metadata: Metadata = {
  title: 'Jupier | Todo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <HeroUiProvider>
          {children}
          <ToastProvider />
        </HeroUiProvider>
      </body>
    </html>
  );
}
