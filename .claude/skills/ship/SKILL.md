---
name: ship
description: Build, commit and deploy the site (and the chatbot worker when content changed).
disable-model-invocation: true
---

1. Run `npm run build`. Stop if it fails.
2. Commit the changes with a short message.
3. Push to `master`. If the SSH push fails, push over HTTPS with `git -c credential.helper='!gh auth git-credential' push https://github.com/LucasScellos/LucasScellos.github.io.git master`.
4. If `src/data/profile.ts` changed, run `cd worker && npx wrangler deploy`.
5. Wait for the Pages deploy with `gh run watch` and report the result.
