# Moin Vahora: The Film

A one-page portfolio told as a short film: Hook, Newsroom, Frame, Cut, Sound, Name + Credits, Post-credits.
Next.js 15 (App Router), GSAP ScrollTrigger + @gsap/react, Lenis smooth scroll. No Tailwind; styles live in `src/app/globals.css`.

**Run:** `npm.cmd install`, then `npm.cmd run dev` and open http://localhost:3000. Type check: `npm.cmd run typecheck`.

**Edit copy:** all text, images and links are in `content/home.ts`; the acts in `src/components/acts/` hold no copy.
Facts and their verification status live in `content/moin-facts.ts` (see `docs/audio/notes.md` for sources).

**Motion rules:** each act pins via `pinned()` in `src/lib/gsap.ts` (scrub 0.6, anticipatePin 1) and starts/ends on black.
Reduced motion gets a static stacked layout; under 810px the Cut timeline becomes a vertical sequence.

**Still placeholders:** `[Newsroom name]`, `[years]` and `[imdbUrl]` in `content/home.ts` (unconfirmed, see moin-facts.ts).
All images in `public/images/` are stand-ins copied from the old site; the YouTube URL (`@moin_2896`) is unconfirmed.
Visual check (optional): `node tools/shot/shoot.mjs desktop|mobile|reduced` writes screenshots to `tools/shot/out/`.
