import { StageCanvas } from '@/components/film/StageCanvas';
import { Loader } from '@/components/film/Loader';
import { Hud } from '@/components/film/Hud';
import { Story } from '@/components/story/Story';
import { story, storyShots } from '@content/story';

/** Home: Moin's story as one continuous film over a WebGL stage. */
export default function Page() {
  return (
    <>
      <StageCanvas shots={storyShots} gated start={{ win: 0 }} />
      <Hud name={story.hud.name} primary={story.hud.primary} contact={story.hud.contact} />
      <main>
        <Story />
      </main>
      <Loader frames={story.loader.frames} hero={storyShots[0]} name={story.hud.name} />
    </>
  );
}
