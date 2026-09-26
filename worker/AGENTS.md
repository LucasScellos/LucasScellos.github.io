# worker

Cloudflare Worker that proxies the chatbot to OpenRouter, so the API key never reaches the browser.

- The key is a secret: `npx wrangler secret put OPENROUTER_API_KEY`. For local dev, put it in `.dev.vars` and run `npm run dev`.
- The model fallback chain (`MODEL`) and CORS allow-list (`ALLOWED_ORIGINS`) live in `wrangler.toml`.
- The site reads the worker URL from `VITE_CHAT_API_URL` in `../.env.production`.
