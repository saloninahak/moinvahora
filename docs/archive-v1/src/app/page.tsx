import { Hook } from '@/components/acts/Hook';
import { Newsroom } from '@/components/acts/Newsroom';
import { Frame } from '@/components/acts/Frame';
import { Cut } from '@/components/acts/Cut';
import { Sound } from '@/components/acts/Sound';
import { Credits } from '@/components/acts/Credits';
import { PostCredits } from '@/components/acts/PostCredits';

/** The film, in running order: Hook, Newsroom, Frame, Cut, Sound, Name + Credits, Post-credits. */
export default function Page() {
  return (
    <main>
      <Hook />
      <Newsroom />
      <Frame />
      <Cut />
      <Sound />
      <Credits />
      <PostCredits />
    </main>
  );
}
