# Moin Vahora: portfolio

Two pages over one WebGL stage. Built with Next.js 15 (App Router), Lenis smooth scroll and a plain WebGL 1 shader (`src/lib/stage.ts`). There is no Tailwind; styles live in `src/app/globals.css`.

- **`/` Home:** Moin's story in eleven chapters: Cut, Listen, Circle, Build, Cross, Stage, Scale, Lead, Credit, Moin, Contact. Copy is in `content/story.ts` and components are in `src/components/story/Story.tsx`.
- **`/work` Work:** the full portfolio, one project per screen. Copy is in `content/work.ts` and components are in `src/components/film/Chapters.tsx`.

**Run:** `npm.cmd install`, then `npm.cmd run dev`, then open http://localhost:3000. Type check: `npm.cmd run typecheck`.

**How motion works:** each chapter is a tall section with a sticky stage. Every frame, `lib/timeline.ts` measures the chapters. The chapter on screen sets the stage targets (`direct({...})` in `lib/director.ts`) and toggles `.is-in` / `.is-past` on elements that have `data-at` / `data-out` (in units of pinned progress). The stage eases toward its targets. Stage effects: dissolve, film burn, warp, static, lens defocus (`focus`), sound ripples (`pulse`), hard cuts (`cut`).

**Images:** all files in `public/images` are open-licence stand-ins. To swap in Moin's frames, keep the same filenames, or edit `storyShots` and `shots`.

**Still to confirm** (marked `// CONFIRM` in `content/story.ts`):
- His role on the Hellaro documentary.
- The "merit…immigration" brand name.
- Details for Victory Group, Grosco, AM Advisory, 1SELL, Organic Mantra, WholesaleSelect and Hoon Taaro Re.
- The wording of the client quote.

**Visual check:** `node tools/shot/shoot.mjs desktop|mobile|reduced [/route]` writes frames to `tools/shot/out/<mode>-<route>/`. To review them as a grid, run `node tools/shot/sheet.mjs <dir> <cols> <out.jpg>`.

The previous single-page version is archived in `docs/archive-v1`.
