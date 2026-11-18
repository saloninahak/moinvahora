/**
 * All copy for the site, in scroll order. Components hold no copy.
 *
 * Sources: Moin's LinkedIn and his previous site (E:\other\v.moin\content:
 * about.ts, projects.ts). Images in /public/images are stand-in stills, not his
 * own frames: replace them with exported frames from the films (same filenames).
 *
 * `shot` values are indexes into `shots` below: the WebGL stage dissolves
 * between them as you scroll.
 */

export const shots = [
  '/images/hero-cinema.jpg', // 0  newsroom / signal
  '/images/project-icc.jpg', // 1
  '/images/project-bmw.jpg', // 2
  '/images/project-gff.jpg', // 3
  '/images/project-rangtaali.jpg', // 4
  '/images/svc-photography.jpg', // 5 (stand-in; the Taj Mahal still is not Gujarat)
  '/images/project-inbl.jpg', // 6
  '/images/project-mfs210.jpg', // 7
  '/images/svc-event-coverage.jpg', // 8 (stand-in; the aurora still was not Navratri)
  '/images/project-bulleh-shah.jpg', // 9
  '/images/project-marhaba.jpg', // 10
  '/images/project-ishq-sufiyana.jpg', // 11
  '/images/project-youforia.jpg', // 12
  '/images/portrait.jpg', // 13
  '/images/hero-cinema.jpg', // 14 the slate again: the film ends where it began
] as const;

export type Work = { title: string; client: string; place: string; year: string; line: string; shot: number };

export const home = {
  meta: {
    title: 'Moin Vahora, Creative Lead and Filmmaker',
    description:
      'Moin Vahora is a creative lead and filmmaker in Ahmedabad. From a newsroom edit desk in 2016 to films for BMW, the ICC T20 World Cup Final and Sufi music stages.',
  },

  hud: {
    name: 'Moin Vahora',
    reel: 'Showreel',
    contact: 'Contact',
  },

  gate: {
    hold: 'Hold to roll',
    keys: 'Or hold Space',
    skip: 'Skip intro',
    status: ['Standing by', 'Rolling', 'Speed'],
  },

  signal: {
    chapter: 'Signal',
    kicker: '2016 · Gujarat Samachar',
    title: ['It started', 'in a newsroom.'],
    body: 'A video editor on the news desk. A story had to land before the next one broke, so every second had to earn its place.',
  },

  timeline: {
    chapter: 'Timeline',
    title: ['He started on the timeline.', 'Now he leads the room.'],
    steps: [
      { year: '2016', role: 'Video Editor', company: 'Gujarat Samachar' },
      { year: '2019', role: 'Video Editor', company: 'GTPL Hathway' },
      { year: '2021', role: 'Senior Video Editor', company: 'Konze India' },
      { year: '2024', role: 'Creative Associate & Team Lead', company: 'Mantra Softech' },
    ],
  },

  work: {
    chapter: 'Work',
    kicker: 'Selected films',
    items: [
      {
        title: 'ICC T20 World Cup Final',
        client: 'ICC Men’s T20 World Cup',
        place: 'Narendra Modi Stadium, Ahmedabad',
        year: '2026',
        line: 'India vs New Zealand. The scale of the night, and the security operation that held it together.',
        shot: 1,
      },
      {
        title: 'BMW',
        client: 'BMW',
        place: 'Ahmedabad & Rajkot',
        year: '2024',
        line: 'The all-electric iX, the BMW × Iktara activations and a Mother’s Day film.',
        shot: 2,
      },
      {
        title: 'Global Fintech Fest',
        client: 'GFF 2025',
        place: 'Jio World Centre, Mumbai',
        year: '2025',
        line: 'Three days of keynotes, launches and conversations, cut into one film.',
        shot: 3,
      },
      {
        title: 'Rangtaali Australia',
        client: 'Shubh Aus Group',
        place: 'Australia',
        year: '2023–25',
        line: 'Three editions, end to end: the script, the reels, the banners and the social.',
        shot: 4,
      },
      {
        title: 'Madhavpur Melo',
        client: 'Gujarat Tourism',
        place: 'Madhavpur, Gujarat',
        year: '2023',
        line: 'A documentary edit of the colour, ritual and community of a Gujarat fair.',
        shot: 5,
      },
      {
        title: 'INBL',
        client: 'Indian National Basketball League',
        place: 'India',
        year: '2022',
        line: 'Coverage, a promo reel and the plan to post it, cut to the pace of the game.',
        shot: 6,
      },
      {
        title: 'MFS210',
        client: 'Mantra Softech',
        place: 'India',
        year: '2025',
        line: 'A product film that makes a biometric fingerprint scanner feel clear and premium.',
        shot: 7,
      },
      {
        title: 'Navshakti Navratri',
        client: 'Navshakti Navratri',
        place: 'Gujarat',
        year: '2025',
        line: 'Community over crowds. Concept and content for a Navratri rooted in tradition.',
        shot: 8,
      },
    ] satisfies Work[],
  },

  sound: {
    chapter: 'Sound',
    verse: 'Bullah ki jana main kaun',
    verseNote: 'Bulleh Shah, 18th century: “Bullah, who knows who I am?”',
    title: 'Some films are carried by music.',
    items: [
      { title: 'The Bulleh Shah Project', note: 'Direction, camera and edit · Abhivyakti 2025', shot: 9 },
      { title: 'Marhaba', note: 'A tribute to Nusrat Fateh Ali Khan · Edit, with Munaf Luhar', shot: 10 },
      { title: 'Ishq Sufiyana', note: 'Khusro, Bulleh Shah and Kabir · Camera and edit', shot: 11 },
    ],
  },

  trust: {
    chapter: 'Trust',
    // Paraphrased from Moin's own account. Confirm wording before launch.
    quote: ['“Creativity is up to you.', 'Just make my brand look good.”'],
    cite: 'What clients tell him',
    after: 'He takes a brand from the brief to the final frame: idea, look, shoot, edit and rollout.',
  },

  self: {
    chapter: 'Moin',
    title: ['Ten years in.', 'Still chasing the frame.'],
    facts: [
      { k: 'Since', v: '2016' },
      { k: 'Work', v: 'Films, documentaries, news, music, brands' },
      { k: 'Recognition', v: 'Featured on IMDb' },
      { k: 'Speaks', v: 'English, Hindi, Gujarati' },
      { k: 'Based in', v: 'Ahmedabad, India' },
    ],
  },

  end: {
    chapter: 'Cut',
    name: ['Moin', 'Vahora'],
    line: 'Have a story that needs to land? Start here.',
    links: [
      { label: 'Email', href: 'mailto:vahoramoin2896@gmail.com' },
      { label: 'Showreel', href: 'https://drive.google.com/drive/folders/1nstx6Bzyc5C8cnlcc5MHw32a-IYcIhM8' },
      { label: 'Instagram', href: 'https://www.instagram.com/moin_2896/' },
      { label: 'LinkedIn', href: 'https://in.linkedin.com/in/moin-vahora-2ba727120' },
      { label: 'Spotify', href: 'https://open.spotify.com/user/31zjro7kodpnrfys35hqnmjov43i' },
    ],
    footer: '© 2026 Moin Vahora · Ahmedabad',
  },
} as const;

export const reelUrl = home.end.links[1].href;
export const emailUrl = home.end.links[0].href;
