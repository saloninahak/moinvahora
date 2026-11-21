import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Geist_Mono } from 'next/font/google';
import { SmoothScroll } from '@/components/SmoothScroll';
import { PageTransition } from '@/components/PageTransition';
import { HapticHint, HapticTaps } from '@/components/Haptics';
import { story } from '@content/story';
import './globals.css';

// Variable on wght, wdth and opsz: reveals animate width and weight.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz', 'wdth'],
  variable: '--font-display',
  display: 'swap',
});
// Only for timecode and small overlay labels (tabular digits).
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: story.meta.title,
  description: story.meta.description,
};

export const viewport: Viewport = {
  themeColor: '#06090c',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Lenis and the stage add classes to <html> after hydration; that is expected.
    <html lang="en" className={`${bricolage.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Before first paint: mark JS-on so reveals start hidden (no flash of the hero). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('film');try{if(sessionStorage.getItem('moin.loaded')==='1')d.classList.add('skip-loader')}catch(e){}",
          }}
        />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <PageTransition />
        <HapticTaps />
        <HapticHint label="Tap once to feel the film" />
      </body>
    </html>
  );
}
