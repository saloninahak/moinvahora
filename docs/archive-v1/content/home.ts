/**
 * All copy for the film, in page order. Edit text here; components hold no copy.
 *
 * Placeholders in [brackets] are unconfirmed facts (see content/moin-facts.ts
 * and docs/audio/notes.md). Replace them once confirmed. A link whose href
 * starts with "[" renders as plain text, so placeholders never become broken links.
 */

export type Clip = { src: string; label: string };
export type CreditBlock = { role: string; names: string[]; href?: string };
export type ContactLink = { label: string; href: string };

export const home = {
  hook: {
    title: ['This is not', 'a portfolio.'],
    sub: 'It’s a film. Scroll to roll.',
  },

  newsroom: {
    title: ['It started', 'in a newsroom.'],
    line: '[Newsroom name], [years]. Press media, where every second has to earn its place.',
    onAir: 'On air',
    ticker: ['Live', '[Newsroom name]', 'Press media', '[years]', 'On air'],
  },

  frame: {
    line: 'Before the cut, there is a frame. Where you stand decides what people feel.',
    image: '/images/hero-cinema.jpg',
    alt: 'A still frame seen through a camera viewfinder (stand-in image)',
  },

  cut: {
    line: 'A film is made twice. Once on set, once in the edit.',
    clips: [
      { src: '/images/project-bmw.jpg', label: 'A001_BMW' },
      { src: '/images/project-honda.jpg', label: 'A002_HONDA' },
      { src: '/images/project-gff.jpg', label: 'A003_GFF' },
      { src: '/images/project-inbl.jpg', label: 'A004_INBL' },
      { src: '/images/project-rangtaali.jpg', label: 'A005_RANGTAALI' },
      { src: '/images/project-navratri.jpg', label: 'A006_NAVRATRI' },
    ] satisfies Clip[],
    /** Index of the clip the blade slices (it ends up under the playhead). */
    splitIndex: 3,
    /** The image the match cut carries the shape into. */
    next: { src: '/images/hero-portrait.jpg', alt: 'The next shot after the match cut (stand-in image)' },
  },

  sound: {
    line: 'Half of every cut is decided by the music.',
    titles: ['The Bulleh Shah Project', 'Marhaba', 'Ishq Sufiyana'],
  },

  credits: {
    name: ['Moin', 'Vahora'],
    roll: [
      { role: 'A film by', names: ['Moin Vahora'] },
      { role: 'Began in', names: ['[Newsroom name]', '[years]'] },
      { role: 'Featured on', names: ['IMDb'], href: '[imdbUrl]' },
      { role: 'Music films', names: ['The Bulleh Shah Project', 'Marhaba', 'Ishq Sufiyana'] },
      {
        role: 'Brands',
        names: ['BMW', 'Honda', 'Mercedes-Benz', 'Gujarat Tourism', 'Mantra Softech', 'Global Fintech Fest', 'INBL'],
      },
      { role: 'Based in', names: ['Ahmedabad, India'] },
    ] satisfies CreditBlock[],
  },

  postCredits: {
    line: 'Stay for the post-credits scene.',
    clapLabel: 'Clap the board to reveal contact links',
    hint: 'Click the clapperboard.',
    links: [
      { label: 'Email', href: 'mailto:vahoramoin2896@gmail.com' },
      { label: 'Instagram', href: 'https://www.instagram.com/moin_2896/' },
      // Handle carried over from the old site; confirm the real channel URL.
      { label: 'YouTube', href: 'https://www.youtube.com/@moin_2896' },
      { label: 'LinkedIn', href: 'https://in.linkedin.com/in/moin-vahora-2ba727120' },
      { label: 'Spotify', href: 'https://open.spotify.com/user/31zjro7kodpnrfys35hqnmjov43i' },
      { label: 'Showreel', href: 'https://drive.google.com/drive/folders/1nstx6Bzyc5C8cnlcc5MHw32a-IYcIhM8' },
    ] satisfies ContactLink[],
    footer: '© 2026 Moin Vahora',
  },
} as const;

/** True for unconfirmed placeholder values like "[imdbUrl]". */
export const isPlaceholder = (value: string) => value.trim().startsWith('[');
