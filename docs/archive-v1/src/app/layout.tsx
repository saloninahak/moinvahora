import type { Metadata, Viewport } from 'next';
import { Anton, Inter } from 'next/font/google';
import { SmoothScroll } from '@/components/SmoothScroll';
import './globals.css';

const display = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });
const text = Inter({ subsets: ['latin'], variable: '--font-text', display: 'swap' });

export const metadata: Metadata = {
  title: 'Moin Vahora: The Film',
  description: 'Moin Vahora, creative lead and visual storyteller. A portfolio told as a short film.',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Lenis adds classes to <html> after hydration; that is expected.
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
