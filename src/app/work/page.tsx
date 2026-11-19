import type { Metadata } from 'next';
import { Hud } from '@/components/film/Hud';
import { WorkIndex } from '@/components/work/WorkIndex';
import { ContactFooter } from '@/components/work/ContactFooter';

export const metadata: Metadata = {
  title: 'All work · Moin Vahora',
  description: 'Brands, events, music and stage, film and series, and Australian work by Moin Vahora.',
};

/**
 * All work, as a printed ledger: cream paper, black ink. Deliberately the
 * opposite of the cinematic pages: no film stage here, a paper index.
 */
export default function WorkPage() {
  return (
    <>
      <Hud name="Moin Vahora" primary={{ label: 'Home', href: '/' }} contact="Contact" />
      <main className="page page--ledger">
        <WorkIndex />
        <ContactFooter />
      </main>
    </>
  );
}
