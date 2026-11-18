import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StageCanvas } from '@/components/film/StageCanvas';
import { Hud } from '@/components/film/Hud';
import { CaseStudy } from '@/components/work/CaseStudy';
import { ContactFooter } from '@/components/work/ContactFooter';
import { getProject, nextProject, projects } from '@content/projects';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.title} · Moin Vahora`, description: p.summary };
}

/** One case study. The project's frame sits on the WebGL stage behind the hero. */
export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = nextProject(slug);
  return (
    <>
      <StageCanvas shots={[project.image, next.image]} start={{ dim: 0.6, warp: 0.06, zoom: 1.08, burn: 0 }} />
      <Hud name="Moin Vahora" primary={{ label: 'All work', href: '/work' }} contact="Contact" />
      <main className="page">
        <CaseStudy project={project} next={next} />
        <ContactFooter />
      </main>
    </>
  );
}
