import type { Metadata } from 'next';
import { StageCanvas } from '@/components/film/StageCanvas';
import { FilmReel } from '@/components/work/FilmReel';
import { shots } from '@content/work';

export const metadata: Metadata = {
  title: 'Selected films · Moin Vahora',
  description: 'Selected work by Moin Vahora, one project per screen.',
};

/**
 * Cinema mode: dark, full-bleed, nothing except the film and the slate.
 * No global HUD on this page; a minimal exit sits in the corner.
 */
export default function FilmPage() {
  return (
    <>
      <StageCanvas shots={shots} />
      <main>
        <FilmReel />
      </main>
    </>
  );
}
