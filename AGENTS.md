# LucasScellos.github.io

Lucas Scellos's portfolio: a Vite + React + TypeScript single page animated with framer-motion, plus a Cloudflare Worker (`worker/`) behind the "Talk with me" chatbot.

- `npm run build` runs the type check and must pass before committing. There are no tests: check UI changes visually in light, dark and at 390px width.
- All site content lives in `src/data/profile.ts`. The worker builds its prompt from it, so content changes also need `cd worker && npx wrangler deploy`.
- Pushing to `master` deploys the site to GitHub Pages.
- Before touching styles or animations, read `docs/DESIGN.md`. For the chatbot backend, read `worker/AGENTS.md`.

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.
