import type { Metadata } from 'next';
import { StageCanvas } from '@/components/film/StageCanvas';
import { Hud } from '@/components/film/Hud';
import { WorkIndex } from '@/components/work/WorkIndex';
import { ContactFooter } from '@/components/work/ContactFooter';
import { projects } from '@content/projects';

export const metadata: Metadata = {
  title: 'All work · Moin Vahora',
  description: 'Brands, events, music and stage, film and series, and Australian work by Moin Vahora.',
};

/** All work: a filterable index. Hovering a project brings its frame up on the stage behind. */
export default function WorkPage() {
  return (
    <>
      <StageCanvas shots={projects.map((p) => p.image)} start={{ dim: 0.82, warp: 0.08, zoom: 1.04, focus: 0.5, burn: 0 }} />
      <Hud name="Moin Vahora" primary={{ label: 'Home', href: '/' }} contact="Contact" />
      <main className="page">
        <WorkIndex />
        <ContactFooter />
      </main>
    </>
  );
}
