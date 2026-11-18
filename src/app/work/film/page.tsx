import type { Metadata } from 'next';
import { StageCanvas } from '@/components/film/StageCanvas';
import { Hud } from '@/components/film/Hud';
import { Chapters } from '@/components/film/Chapters';
import { home, shots } from '@content/work';

export const metadata: Metadata = {
  title: 'Selected films · Moin Vahora',
  description: 'Selected work by Moin Vahora, one project per screen.',
};

/** The cinematic reel of selected work: one project per screen over the WebGL stage. */
export default function FilmPage() {
  return (
    <>
      <StageCanvas shots={shots} />
      <Hud name={home.hud.name} primary={{ label: 'All work', href: '/work' }} contact={home.hud.contact} />
      <main>
        <Chapters />
      </main>
    </>
  );
}
