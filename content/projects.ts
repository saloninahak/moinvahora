/**
 * Every project, for /work (index) and /work/[slug] (case study).
 *
 * Sources: the client meeting list, Moin's previous site (descriptions marked
 * "old site"), LinkedIn, and public pages (BookMyShow for Rafinaama,
 * sheetalsangeet.com for Safar, star.bio / iktarashabad.com for Iktara and
 * Navshakti, Wikipedia / Times of India for Hellaro).
 *
 * `draft: true` means only the headline facts are confirmed. The case study
 * page then shows those facts and says the full write-up is coming, instead
 * of inventing detail. Images are open-licence stand-ins.
 */

export type Category = 'brand' | 'event' | 'stage' | 'film' | 'australia';

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'brand', label: 'Brands' },
  { id: 'event', label: 'Events' },
  { id: 'stage', label: 'Music & stage' },
  { id: 'film', label: 'Film & series' },
  { id: 'australia', label: 'Australia' },
];

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  place: string;
  cats: Category[];
  role: string[];
  image: string;
  /** One line for the index. */
  summary: string;
  /** Case study body, one paragraph per entry. */
  story: string[];
  /** Optional "how it was made" steps for full case studies. */
  process?: { k: string; v: string }[];
  featured?: boolean;
  draft?: boolean;
};

const SHOWREEL = 'https://drive.google.com/drive/folders/1nstx6Bzyc5C8cnlcc5MHw32a-IYcIhM8';
export const showreelUrl = SHOWREEL;

export const projects: Project[] = [
  {
    slug: 'icc-t20-world-cup-final',
    title: 'ICC Men’s T20 World Cup Final',
    client: 'Gujarat Police · Ahmedabad Police',
    year: '2026',
    place: 'Narendra Modi Stadium, Ahmedabad',
    cats: ['event'],
    role: ['Event coverage', 'Cinematography', 'Visual storytelling'],
    image: '/images/project-icc.jpg',
    summary: 'India vs New Zealand: the scale of the night, and the security operation that held it together.',
    story: [
      'Coverage of the ICC Men’s T20 World Cup Final, India vs New Zealand, at Narendra Modi Stadium, made for Gujarat Police.',
      'The film follows the atmosphere of one of the biggest nights in world cricket and the coordination between Ahmedabad Police, Gujarat Police and specialised security teams: the scale of the event, the energy of the crowd, and the crowd management that brought the match to a safe finish.',
    ],
    featured: true,
  },
  {
    slug: 'rangtaali-australia',
    title: 'Rangtaali',
    client: 'Shubh Aus Group',
    year: '2023 – 2026',
    place: 'Melbourne, Australia',
    cats: ['australia', 'event', 'brand'],
    role: ['Brand management', 'Script', 'Reels', 'Banners & statics', 'Social media'],
    image: '/images/project-rangtaali.jpg',
    summary: 'Four editions of a Navratri garba in Australia, run end to end as a brand.',
    story: [
      'Rangtaali brings Navratri garba to the Gujarati community in Australia. Moin has run its marketing for four editions, from 2023 to 2026, for the Shubh Aus Group.',
      'The remit is the whole brand, not just the edit: writing the script, cutting the reels, designing banners and static posts, and running social media, so every touchpoint reads as one campaign.',
    ],
    process: [
      { k: 'Brief', v: 'Make one night in Melbourne feel like Navratri at home.' },
      { k: 'Audience', v: 'Gujarati families, students and new migrants across Australia.' },
      { k: 'Identity', v: 'A palette of kumkum, marigold and temple night, and a wordmark that works on a poster and a phone.' },
      { k: 'Campaign', v: 'Countdown reels, artist reveals, statics and a last call, planned as one grid.' },
      { k: 'Event night', v: 'Coverage on the night feeds next year’s campaign.' },
    ],
    featured: true,
  },
  {
    slug: 'hellaro-documentary',
    title: 'Hellaro: the documentary',
    client: 'Hellaro · Dir. Abhishek Shah',
    year: '2019',
    place: 'Gujarat',
    cats: ['film'],
    role: ['Documentary'], // CONFIRM exact role
    image: '/images/hero-cinema.jpg',
    summary: 'The documentary of the first Gujarati film to win the National Award for Best Feature Film.',
    story: [
      'Hellaro (2019), directed by Abhishek Shah, follows a group of women in a Kutch village who are forbidden to dance garba. It became the first Gujarati film to win the National Film Award for Best Feature Film.',
      'Moin worked on the film’s documentary.',
    ],
    featured: true,
    draft: true,
  },
  {
    slug: 'abhishek-shah-acting-workshop',
    title: 'Casting & acting workshop',
    client: 'Abhishek Shah',
    year: '',
    place: 'Gujarat',
    cats: ['film', 'event'],
    role: ['Film'],
    image: '/images/svc-cinematography.jpg',
    summary: 'A casting and acting workshop with the director of Hellaro.',
    story: ['Abhishek Shah is the director of Hellaro and one of Gujarati cinema’s best-known casting directors. Moin worked on his casting and acting workshop.'],
    draft: true,
  },
  {
    slug: 'bmw',
    title: 'BMW',
    client: 'BMW',
    year: '2024',
    place: 'Ahmedabad & Rajkot',
    cats: ['brand', 'event'],
    role: ['Launch event shoot', 'Cinematography', 'Editing'],
    image: '/images/project-bmw.jpg',
    summary: 'Launch event coverage and campaign films: the iX, BMW × Iktara and Mother’s Day.',
    story: [
      'A run of work for BMW: launch event coverage, the all-electric iX, the BMW × Iktara activations in Ahmedabad and Rajkot, and a Mother’s Day film.',
      'Premium automotive storytelling with clean cinematography and tightly paced edits for a luxury audience.',
    ],
    featured: true,
  },
  {
    slug: 'iktara',
    title: 'Iktara',
    client: 'Hardik Dave',
    year: 'Ongoing',
    place: 'Gujarat',
    cats: ['stage'],
    role: ['Chief Editor'],
    image: '/images/project-marhaba.jpg',
    summary: 'Chief Editor for Iktara, the bhajan and shabad project of folk singer Hardik Dave.',
    story: [
      'Iktara began as an informal bhajan gathering of friends: Hardik Dave singing, Meet Dave on the one-string iktara, Parth Somani on udu. Its Shabad Parikrama concerts carry the words of saints such as Kabir, Gorakh, Gangasati and Bulleh Shah to young listeners.',
      'Moin is Iktara’s Chief Editor.',
    ],
    featured: true,
  },
  {
    slug: 'shabad-parikrama',
    title: 'Shabad Parikrama',
    client: 'Iktara · Abhivyakti',
    year: '2022',
    place: 'Ahmedabad',
    cats: ['stage', 'event'],
    role: ['Event film'],
    image: '/images/project-ishq-sufiyana.jpg',
    summary: 'Iktara’s concert of saint poetry, at the Abhivyakti festival.',
    story: ['Shabad Parikrama is Iktara’s concert of the words of saints, presented at Abhivyakti, Ahmedabad’s arts festival.'],
    draft: true,
  },
  {
    slug: 'rafinaama',
    title: 'Rafinaama',
    client: 'Surili Virasat · Rajpath Club',
    year: '2025',
    place: 'Rajpath Club, Ahmedabad',
    cats: ['stage', 'event'],
    role: ['Creative Head'],
    image: '/images/project-aishwarya.jpg',
    summary: 'A four-hour Mohd Rafi centenary concert with 50+ artists on stage. Creative Head.',
    story: [
      'Rafinaama was a four-hour concert for the 100th birth year of Mohd Rafi, presented by Surili Virasat and Rajpath Club on 8 March 2025: fifteen singers and the Sandeep Christian orchestra, more than fifty artists on stage, in front of a giant LED backdrop.',
      'Moin was its Creative Head.',
    ],
    featured: true,
  },
  {
    slug: 'bulleh-shah-project',
    title: 'The Bulleh Shah Project',
    client: 'Abhivyakti 2025',
    year: '2025',
    place: 'Ahmedabad',
    cats: ['stage', 'film'],
    role: ['Creative direction', 'Cinematography', 'Editing'],
    image: '/images/project-bulleh-shah.jpg',
    summary: 'A contemporary Sufi performance built around Bulleh Shah’s question: “Who am I?”',
    story: [
      'A contemporary performing-arts piece on the poetry of Bulleh Shah, built around his question “Bullah ki jana main kaun”: who am I? Music, movement, theatre and visuals move from inner conflict to surrender, through compositions like Bullah Ki Jana Main Kaun, Chal Bulleya and Mera Piya Ghar Aaya.',
      'A minimal stage, atmospheric light and fluid choreography, filmed so each sequence plays as a moment of reflection rather than a record of a show.',
    ],
  },
  {
    slug: 'ishq-sufiyana',
    title: 'Ishq Sufiyana',
    client: 'Laksh Maheshwari',
    year: '2025',
    place: 'Palladium Mall, Ahmedabad',
    cats: ['stage', 'event'],
    role: ['Cinematography', 'Event coverage', 'Editing'],
    // Real frame: Moin filming at Laksh Maheshwari Live.
    image: '/images/moin-filming.png',
    summary: 'Storyteller Laksh Maheshwari’s evening of Khusro, Bulleh Shah and Kabir.',
    story: [
      'Ishq Sufiyana is a musical storytelling evening by Laksh Maheshwari, told through the stories of Amir Khusro, Bulleh Shah and Kabir.',
      'Filming it meant moving with the rhythm of the qawwalis: a night where stories became prayers and the music became a bridge between the stage and the audience.',
    ],
  },
  {
    slug: 'navshakti-navratri',
    title: 'Navshakti Navratri',
    client: 'Navshakti Navratri',
    year: '2022',
    place: 'Ahmedabad',
    cats: ['event'],
    role: ['Concept & content'],
    image: '/images/svc-event-coverage.jpg',
    summary: 'The first edition of a Navratri built on community over crowds.',
    story: [
      'Navshakti Navratri was started in Ahmedabad in 2022 by Hardik Dave: no passes, no sponsors, only Indian instruments, and everyone in the circle.',
      'Moin worked on its first edition. The content direction asked people to let go of ego and share the rhythm, devotion and creativity of the nine nights.',
    ],
  },
  {
    slug: 'global-fintech-fest-2025',
    title: 'Global Fintech Fest',
    client: 'GFF 2025 · Mantra Softech',
    year: '2025',
    place: 'Jio World Centre, Mumbai',
    cats: ['event', 'brand'],
    role: ['Event coverage', 'Cinematography', 'Editing'],
    image: '/images/project-gff.jpg',
    summary: 'Three days of keynotes, launches and conversations, cut into one film.',
    story: ['Coverage of GFF 2025 at Jio World Centre, Mumbai. Over three days: keynotes, product showcases and conversations among global fintech leaders, showing how fast the ecosystem is moving.'],
  },
  {
    slug: 'mantra-softech',
    title: 'Mantra Softech',
    client: 'Mantra Softech',
    year: '2024 – now',
    place: 'Ahmedabad',
    cats: ['brand'],
    role: ['Creative Associate & Team Lead'],
    image: '/images/svc-creative-direction.jpg',
    summary: 'Plant shoot, product launch event, GFF coverage and SaaS films, as creative team lead.',
    story: ['As Creative Associate and Team Lead at Mantra Softech, Moin leads the company’s video work: the manufacturing plant shoot, the product launch event, coverage at Global Fintech Fest and films for its SaaS products.'],
    draft: true,
  },
  {
    slug: 'mfs210',
    title: 'MFS210',
    client: 'Mantra Softech',
    year: '2025',
    place: 'India',
    cats: ['brand'],
    role: ['Editing', 'Motion graphics'],
    image: '/images/project-mfs210.jpg',
    summary: 'A product film that makes a biometric fingerprint scanner feel clear and premium.',
    story: ['A product film for the MFS210, India’s first FAP 20 optical fingerprint scanner with hardware spoof detection. Tight editing and motion graphics make complex biometric technology easy to follow.'],
  },
  {
    slug: 'inbl',
    title: 'INBL',
    client: 'Indian National Basketball League',
    year: '2022',
    place: 'India',
    cats: ['event', 'brand'],
    role: ['Videography', 'Photography', 'Editing', 'Social'],
    image: '/images/project-inbl.jpg',
    summary: 'Coverage, a promo reel and the plan to post it, cut to the pace of the game.',
    story: ['Event photography, videography and a promotional reel for the Indian National Basketball League, plus the marketing plan, shoot, edit and posting: fast, high-energy content built for social reach.'],
  },
  {
    slug: 'gujarat-tourism',
    title: 'Gujarat Tourism · Madhavpur Melo',
    client: 'Gujarat Tourism',
    year: '2023',
    place: 'Madhavpur, Gujarat',
    cats: ['film', 'brand'],
    role: ['Documentary edit'],
    image: '/images/svc-photography.jpg',
    summary: 'A documentary edit of the colour, ritual and community of a Gujarat fair.',
    story: ['A documentary edit of the Madhavpur Melo for Gujarat Tourism, weaving the colour, ritual and community of one of Gujarat’s cultural fairs into one story for a state-tourism audience.'],
  },
  {
    slug: 'youforia-parth',
    title: 'Youforia: Parth',
    client: 'Team Youforia · Hrutul',
    year: '2025',
    place: 'India',
    cats: ['stage', 'film'],
    role: ['Visual storytelling', 'Editing'],
    image: '/images/project-youforia.jpg',
    summary: 'A 19-part cinematic series on the Bhagavad Gita.',
    story: ['A content series for Youforia’s chapter Parth, created, written and directed by Hrutul. Across 19 cinematic posts, each built on a Gita shloka, it shows how modern life still echoes Arjuna’s questions: “You are your own Parth: the battle is within.”'],
  },
  {
    slug: 'marhaba',
    title: 'Marhaba',
    client: 'Munaf Luhar',
    year: '',
    place: 'India',
    cats: ['stage'],
    role: ['Editing'],
    image: '/images/project-marhaba.jpg',
    summary: 'A song by Munaf Luhar, a tribute to Ustad Nusrat Fateh Ali Khan.',
    story: ['Marhaba is a song by Munaf Luhar, a tribute to Ustad Nusrat Fateh Ali Khan. Editing it meant working inside the language of Sufi qawwali, where every line is about devotion and love.'],
  },
  {
    slug: 'safar-a-poetic-journey',
    title: 'Safar: A Poetic Journey',
    client: 'Dir. Prashant Deshaval',
    year: '2021',
    place: 'Gujarat',
    cats: ['film'],
    role: ['Film'], // CONFIRM role
    image: '/images/svc-video-editing.jpg',
    summary: 'A Gujarati web series released on YouTube.',
    story: ['Safar: A Poetic Journey is a Gujarati web series released on YouTube on 17 January 2021, starring Aanchal Shah, Ricky Kesariya and Manasi Oza, produced by Dhruv Deshaval and Dipesh Gujarati and directed by Prashant Deshaval.'],
    draft: true,
  },
  {
    slug: 'mohabbat-zindabad',
    title: 'Mohabbat Zindabad',
    client: 'Live storytelling',
    year: '2024',
    place: '',
    cats: ['stage'],
    role: ['Film'],
    image: '/images/project-youforia.jpg',
    summary: 'A live storytelling show.',
    story: ['Mohabbat Zindabad is a live storytelling show.'],
    draft: true,
  },
  {
    slug: 'sab-theek-ho-jaega',
    title: 'Sab Theek Ho Jaega',
    client: 'Ashish Bagrecha',
    year: '',
    place: '',
    cats: ['stage'],
    role: ['Film'],
    image: '/images/project-bulleh-shah.jpg',
    summary: 'A show by poet Ashish Bagrecha.',
    story: ['Sab Theek Ho Jaega is a show by poet Ashish Bagrecha.'],
    draft: true,
  },
  {
    slug: 'daastaan-e-ghori',
    title: 'Daastaan-e-Ghori',
    client: 'Meet Dave',
    year: '2023',
    place: '',
    cats: ['stage'],
    role: ['Film'],
    image: '/images/project-aishwarya.jpg',
    summary: 'A show by Meet Dave.',
    story: ['Daastaan-e-Ghori is a 2023 show by Meet Dave, who plays the iktara in Iktara.'],
    draft: true,
  },
  {
    slug: 'hoon-taaro-re',
    title: 'Hoon Taaro Re',
    client: 'Song',
    year: '',
    place: '',
    cats: ['stage'],
    role: ['Film'],
    image: '/images/project-marhaba.jpg',
    summary: 'A Gujarati song.',
    story: ['Hoon Taaro Re is a song.'],
    draft: true,
  },
  {
    slug: 'malabar-gold-australia',
    title: 'Malabar Gold & Diamonds',
    client: 'Malabar Gold & Diamonds',
    year: '',
    place: 'Australia',
    cats: ['australia', 'brand'],
    role: ['Brand content'],
    image: '/images/project-baroda.jpg',
    summary: 'Content for the jeweller’s Australian business.',
    story: ['Malabar Gold & Diamonds opened its first Australian store in 2024. Moin creates content for its Australian business.'],
    draft: true,
  },
  {
    slug: 'aussizz-group-footscray',
    title: 'Aussizz Group · Footscray',
    client: 'Aussizz Group',
    year: '',
    place: 'Footscray, Melbourne',
    cats: ['australia', 'brand'],
    role: ['Brand content'],
    image: '/images/project-mitras.jpg',
    summary: 'Content for a migration and education consultancy in Melbourne.',
    story: ['Aussizz Group is a migration and education consultancy. Moin creates content for its Footscray office in Melbourne.'],
    draft: true,
  },
  {
    slug: 'fts-visa-services',
    title: 'FTS Visa Services',
    client: 'FTS Education & Visa Services',
    year: '',
    place: 'Sydney',
    cats: ['australia', 'brand'],
    role: ['Brand content'],
    image: '/images/svc-motion-graphics.jpg',
    summary: 'Content for a migration and education agency in Sydney.',
    story: ['FTS Education & Visa Services is a migration and education agency in Parramatta, Sydney. Moin creates content for the brand.'],
    draft: true,
  },
  ...['Victory Group', 'Grosco', 'AM Advisory', '1SELL', 'Organic Mantra', 'WholesaleSelect.com'].map(
    (name, i): Project => ({
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''),
      title: name,
      client: name,
      year: '',
      place: '', // CONFIRM location (listed with the Australian clients)
      cats: ['brand'],
      role: ['Brand content'],
      image: ['/images/project-honda.jpg', '/images/hero-portrait.jpg', '/images/svc-cinematography.jpg', '/images/svc-creative-direction.jpg', '/images/svc-motion-graphics.jpg', '/images/svc-photography.jpg'][i],
      summary: `Brand content for ${name}.`,
      story: [`Moin creates brand content for ${name}.`],
      draft: true,
    }),
  ),
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** The next project in the list (wraps), for the case study footer. */
export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export const countFor = (id: Category | 'all') => (id === 'all' ? projects.length : projects.filter((p) => p.cats.includes(id)).length);
