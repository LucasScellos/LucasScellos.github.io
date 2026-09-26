# LucasScellos.github.io

Lucas Scellos's portfolio: a Vite + React + TypeScript single page animated with framer-motion, plus a Cloudflare Worker (`worker/`) behind the "Talk with me" chatbot.

- `npm run build` runs the type check and must pass before committing. There are no tests: check UI changes visually in light, dark and at 390px width.
- All site content lives in `src/data/profile.ts`; its French translation is `src/data/profile.fr.ts` (update both) and UI strings are in `src/i18n.tsx`. The language defaults to the browser's (saved as `lang` in localStorage). The worker builds its prompt from it, so content changes also need `cd worker && npx wrangler deploy`.
- `scripts/agentContent.ts` (a Vite plugin) also builds from it: the plain-HTML copy inside `#root`, the JSON-LD, and `llms.txt`, `llms-full.txt`, `cv.md`, `robots.txt`, `sitemap.xml`. Don't hand-write these.
- Pushing to `master` deploys the site to GitHub Pages.
- Before touching styles or animations, read `docs/DESIGN.md`. For the chatbot backend, read `worker/AGENTS.md`.

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.
