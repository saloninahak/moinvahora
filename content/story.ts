/**
 * Home page story, in scroll order. Components hold no copy.
 *
 * Order follows what a visitor (a brand, an artist, an event) needs, in the
 * order they need it:
 *   1 Hero     who he is, and proof (IMDb, National Award film, ICC final) on screen one
 *   2 Cut      where the eye comes from: the news desk, in one sentence
 *   3 Scale    the big rooms he is trusted with
 *   4 Circle   the thread that runs through his work: garba
 *   5 Build    how he works: concept to creation, shown on one brand
 *   6 Cross    brands in Australia
 *   7 Stage    the artists who trust him with their stage
 *   8 Moin     the person, and the titles he holds
 *   9 Contact
 *
 * Anything still to confirm is marked `// CONFIRM`. Images are open-licence
 * stand-ins in /public/images; swap in Moin's frames using the same paths.
 */

/** Stills for the WebGL stage. Indexes are used below as `shot`. */
export const storyShots = [
  '/images/hero-cinema.jpg', //  0 hero: slate on location
  '/images/svc-video-editing.jpg', //  1 cut: the edit timeline
  '/images/project-bmw.jpg', //  2 scale
  '/images/project-gff.jpg', //  3 scale
  '/images/project-mfs210.jpg', //  4 scale
  '/images/project-inbl.jpg', //  5 scale
  '/images/svc-photography.jpg', //  6 scale (tourism)
  '/images/project-icc.jpg', //  7 scale: hold
  '/images/project-aishwarya.jpg', //  8 circle
  '/images/project-rangtaali.jpg', //  9 build
  '/images/project-mitras.jpg', // 10 cross
  '/images/project-ishq-sufiyana.jpg', // 11 stage
  '/images/project-bulleh-shah.jpg', // 12 stage
  '/images/project-marhaba.jpg', // 13 stage
  '/images/project-youforia.jpg', // 14 stage
  '/images/portrait.jpg', // 15 Moin
  '/images/svc-event-coverage.jpg', // 16 contact
] as const;

export const story = {
  meta: {
    title: 'Moin Vahora · I build brands.',
    description:
      'Moin Vahora is an editor turned creative lead from Ahmedabad, featured on IMDb. He runs brands end to end, from the idea to the campaign, in India and Australia.',
  },

  hud: { name: 'Moin Vahora', primary: { label: 'All work', href: '/work' }, contact: 'Contact' },

  /** The contact panel that opens from the dock on every page. */
  contactPanel: {
    status: 'Taking on new projects',
    city: 'Ahmedabad',
    tz: 'Asia/Kolkata',
    title: ['Let’s make something', 'people remember.'],
    email: 'vahoramoin2896@gmail.com',
    copy: 'Copy',
    copied: 'Copied',
    briefKicker: 'Start a brief · three taps',
    needLabel: 'What do you need?',
    needs: ['Brand film', 'Campaign & social', 'Event coverage', 'Music & stage', 'Product film', 'The whole brand'],
    whenLabel: 'When?',
    whens: ['This month', 'Next 3 months', 'Just exploring'],
    send: 'Send the brief',
    subject: 'Project enquiry',
    links: [
      { label: 'Showreel', href: 'https://drive.google.com/drive/folders/1nstx6Bzyc5C8cnlcc5MHw32a-IYcIhM8' },
      { label: 'IMDb', href: 'https://www.imdb.com/name/nm11477653/' },
      { label: 'Instagram', href: 'https://www.instagram.com/moin_2896/' },
      { label: 'LinkedIn', href: 'https://in.linkedin.com/in/moin-vahora-2ba727120' },
    ],
    haptics: 'Haptics',
    hint: 'Press C anywhere · Esc to close',
  },

  /** Loader: fast flipbook of frames, labelled with real work. */
  loader: {
    frames: [
      { src: '/images/project-icc.jpg', label: 'ICC T20 Final' },
      { src: '/images/project-rangtaali.jpg', label: 'Rangtaali' },
      { src: '/images/project-bmw.jpg', label: 'BMW' },
      { src: '/images/project-bulleh-shah.jpg', label: 'Bulleh Shah' },
      { src: '/images/project-gff.jpg', label: 'GFF' },
      { src: '/images/project-ishq-sufiyana.jpg', label: 'Ishq Sufiyana' },
      { src: '/images/project-inbl.jpg', label: 'INBL' },
      { src: '/images/project-aishwarya.jpg', label: 'Navratri' },
      { src: '/images/project-mitras.jpg', label: 'Australia' },
      { src: '/images/project-youforia.jpg', label: 'Youforia' },
      { src: '/images/project-mfs210.jpg', label: 'Mantra' },
      { src: '/images/project-marhaba.jpg', label: 'Marhaba' },
    ],
  },

  /* 1 · Hero --------------------------------------------------------------- */
  hero: {
    chapter: 'Moin',
    kicker: 'Moin Vahora · Ahmedabad',
    /** Reads as one sentence with the word below: "I build brands." */
    lead: 'I build',
    /** The word his work plays inside. */
    word: 'brands.',
    /** Moin at work, standing in the hero's right side. */
    onset: {
      src: '/images/moin-filming.png',
      alt: 'Moin Vahora filming on a gimbal at Laksh Maheshwari Live',
      tag: 'Behind the camera',
      caption: 'On set · Laksh Maheshwari Live',
    },
    // Says he leads (brief, team, launch) without saying "manager".
    sub: 'It started at the edit. These days the brief, the team and the launch come to me first.',
    imdb: { badge: 'IMDb', label: 'Featured on IMDb', cta: 'View credits', href: 'https://www.imdb.com/name/nm11477653/' },
    cue: 'Scroll',
    frameCaption: 'Now showing · Selected work',
  },

  /* 2 · Cut ---------------------------------------------------------------- */
  cut: {
    chapter: 'Cut',
    kicker: 'Where it started · The news desk, 2016 – 2021',
    // `k: true` words survive the edit: "Cut to what matters."
    sentence: [
      { t: 'Cut', k: true },
      { t: ' every' },
      { t: ' second' },
      { t: ' that' },
      { t: ' doesn’t' },
      { t: ' earn' },
      { t: ' its' },
      { t: ' place,' },
      { t: ' down' },
      { t: ' to', k: true },
      { t: ' what', k: true },
      { t: ' matters', k: true },
      { t: '.', k: true },
    ],
    runtime: { from: 30, to: 4, label: 'Runtime' },
    after: 'Gujarat Samachar and GTPL Hathway taught him to edit against the clock. Every project since gets the same test.',
  },

  /* 3 · Scale -------------------------------------------------------------- */
  scale: {
    chapter: 'Scale',
    kicker: 'Trusted with the big rooms',
    reel: [
      { title: 'BMW', note: 'Launch event and campaign films', shot: 2 },
      { title: 'Global Fintech Fest', note: 'Jio World Centre, Mumbai', shot: 3 },
      { title: 'Mantra Softech', note: 'Plant shoot · Product launch · SaaS', shot: 4 },
      { title: 'INBL', note: 'Indian National Basketball League · 2022', shot: 5 },
      { title: 'Gujarat Tourism', note: 'Madhavpur Melo', shot: 6 },
    ],
    hold: {
      title: 'ICC Men’s T20 World Cup Final',
      note: 'For Gujarat Police · Narendra Modi Stadium · 2026',
      shot: 7,
    },
    after: 'Live, on the day, with no second take.',
  },

  /* 4 · Circle ------------------------------------------------------------- */
  circle: {
    chapter: 'Circle',
    intro: 'One thread runs through his work: garba.',
    stops: [
      { year: '2019', place: 'Hellaro', line: 'The documentary of a National Award film about a garba a village forbade.' },
      { year: '2022', place: 'Ahmedabad', line: 'Navshakti Navratri, first edition. No passes, everyone in the circle.' },
      { year: '2023', place: 'Melbourne', line: 'Rangtaali. The same dance, 10,000 km from home.' },
      { year: '2026', place: 'Australia', line: 'Four editions on, he runs the Rangtaali brand.' },
    ],
    outro: 'From a film, to a festival, to a brand.',
  },

  /* 5 · Build: one frame, made in front of you -------------------------- */
  build: {
    chapter: 'Build',
    kicker: 'Concept to creation · Rangtaali, Australia',
    title: 'Watch one frame get made.',
    steps: [
      { k: 'Idea', v: 'It starts as one sentence.' },
      { k: 'Frame', v: 'Find the shot before the shoot.' },
      { k: 'Grade', v: 'Give it the colour of the night.' },
      { k: 'Mark', v: 'Give it a name people remember.' },
      { k: 'Formats', v: 'One shoot, every screen.' },
      { k: 'Night', v: 'The circle fills.' },
    ],
    brief: 'Make one night in Melbourne feel like Navratri at home.',
    palette: [
      { name: 'Kumkum', hex: '#C8102E' },
      { name: 'Marigold', hex: '#F5A623' },
      { name: 'Temple night', hex: '#1B1440' },
      { name: 'Chalk', hex: '#F3EFE7' },
    ],
    wordmark: 'Rangtaali',
    tagline: 'Navratri · Melbourne',
    /** The same shot, cropped for each place it runs. `r` is width / height. */
    formats: [
      { k: 'Film', note: '2.39 : 1', r: 2.39 },
      { k: 'Reel', note: '9 : 16', r: 9 / 16 },
      { k: 'Post', note: '1 : 1', r: 1 },
      { k: 'Banner', note: '3 : 1', r: 3 },
    ],
    after: 'Script, reels, banners, statics and social, for four editions. The whole brand, not just the edit.',
    cta: { label: 'Read the case study', href: '/work/rangtaali-australia' },
  },

  /* 6 · Cross -------------------------------------------------------------- */
  cross: {
    chapter: 'Cross',
    kicker: 'Ahmedabad → Australia',
    from: { city: 'Ahmedabad', tz: 'Asia/Kolkata' },
    to: { city: 'Melbourne', tz: 'Australia/Melbourne' },
    distance: '≈ 10,100 km',
    title: ['Australian brands', 'hire him from Ahmedabad.'],
    clients: ['Aussizz Group · Footscray', 'FTS Visa Services · Sydney', 'Malabar Gold & Diamonds · Australia', 'Shubh Aus Group · Rangtaali'],
    // CONFIRM: location of these brands; listed together with the Australian clients in the brief.
    more: 'Also: Victory Group, Grosco, AM Advisory, 1SELL, Organic Mantra and WholesaleSelect.com.',
    after: 'He knows the audience because he is from it: Indian families building a life far from home.',
  },

  /* 7 · Stage -------------------------------------------------------------- */
  stage: {
    chapter: 'Stage',
    /** Set big over the stage, in the same style the verse used. */
    headline: ['Poets, singers, storytellers', 'trust him with their stage.'],
    bill: [
      { title: 'Iktara', who: 'Hardik Dave · Shabad Parikrama', role: 'Chief Editor', year: 'Ongoing', shot: 11 },
      { title: 'Rafinaama', who: 'Mohd Rafi centenary · 50+ artists', role: 'Creative Head', year: '2025', shot: 12 },
      { title: 'The Bulleh Shah Project', who: 'Abhivyakti', role: 'Direction · Camera · Edit', year: '2025', shot: 12 },
      { title: 'Ishq Sufiyana', who: 'Laksh Maheshwari', role: 'Camera · Edit', year: '2025', shot: 11 },
      { title: 'Youforia: Parth', who: 'Hrutul', role: 'Visual storytelling', year: '2025', shot: 14 },
      { title: 'Mohabbat Zindabad', who: 'Live storytelling', role: 'Film', year: '2024', shot: 14 },
      { title: 'Daastaan-e-Ghori', who: 'Meet Dave', role: 'Film', year: '2023', shot: 13 },
      { title: 'Marhaba', who: 'Munaf Luhar', role: 'Edit', year: '', shot: 13 },
      { title: 'Safar: A Poetic Journey', who: 'Gujarati web series', role: 'Film', year: '2021', shot: 14 },
    ],
  },

  /* 8 · Moin --------------------------------------------------------------- */
  self: {
    chapter: 'Moin',
    over: 'The person behind it',
    title: ['Moin Vahora.'],
    line: 'He listens first, frames second and cuts last. What he cares about is what the audience feels after the screen goes dark.',
    titles: [
      { role: 'Chief Editor', org: 'Iktara' },
      { role: 'Creative Head', org: 'Rafinaama' },
      { role: 'Team Lead', org: 'Mantra Softech' },
    ],
    facts: [
      { k: 'Since', v: '2016, from the news desk' },
      { k: 'Does', v: 'Concept, direction, camera, edit, brand and social' },
      { k: 'Speaks', v: 'English, Hindi, Gujarati' },
    ],
  },

  /* 9 · Contact ------------------------------------------------------------ */
  end: {
    chapter: 'Contact',
    name: ['Moin', 'Vahora'],
    line: 'Have a story that needs to land? Start here.',
    work: { label: 'See all work', href: '/work' },
    links: [
      { label: 'Email', href: 'mailto:vahoramoin2896@gmail.com' },
      { label: 'Showreel', href: 'https://drive.google.com/drive/folders/1nstx6Bzyc5C8cnlcc5MHw32a-IYcIhM8' },
      { label: 'IMDb', href: 'https://www.imdb.com/name/nm11477653/' },
      { label: 'Instagram', href: 'https://www.instagram.com/moin_2896/' },
      { label: 'LinkedIn', href: 'https://in.linkedin.com/in/moin-vahora-2ba727120' },
    ],
    footer: '© 2026 Moin Vahora · Ahmedabad',
  },
} as const;
