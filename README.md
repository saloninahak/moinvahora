# Moin Vahora · Portfolio

The portfolio of **Moin Vahora**, editor and creative lead from Ahmedabad, featured on [IMDb](https://www.imdb.com/name/nm11477653/).

Live: **https://moinvahora.vercel.app**

## Pages

- **`/`** · The story: a short loader, the hero ("I build brands."), the news-desk edit, then an immersive film section through the work (the big rooms, the garba thread, concept to creation, Australia, the stage), and out again to meet Moin and get in touch.
- **`/work`** · Every project, filterable by Brands, Events, Music & stage, Film & series and Australia, as a list or a grid.
- **`/work/[project]`** · A case study for each project.
- **`/work/film`** · Selected work as a cinematic reel.

## Stack

Next.js 15 (App Router, statically generated), React 18, Lenis smooth scroll, and a plain WebGL 1 shader for the film stage (`src/lib/stage.ts`). No UI framework; styles live in `src/app/globals.css`. Type: Bricolage Grotesque and Geist Mono.

## Edit content

All copy lives in `content/`, so components hold no text:

- `content/story.ts` · home page
- `content/projects.ts` · projects and case studies
- `content/work.ts` · the `/work/film` reel

Images are in `public/images/`. Most are open-licence stand-ins until Moin's own frames replace them; keep the same filenames to swap them in.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

Pushing to `main` redeploys the live site on Vercel.

© 2026 Moin Vahora
