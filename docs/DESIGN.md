# Design

- Minimalist and editorial: "designer, not geeky". No terminal or code aesthetics.
- Light theme by default, dark via the toggle (saved as `theme-v2` in localStorage).
- Accent is cobalt blue (`#1f4fd6` light, `#7ea3ff` dark). No orange.
- Colours are tokens in `src/styles.css` (`:root` for light, `:root[data-theme='dark']`). Never hardcode colours in components; read tokens with `useCssVars` from `src/hooks.ts` if JS needs them.
- Fonts: Instrument Serif for display, Inter for text.
- Every animation needs a reduced-motion fallback (`useRichMotion`) and must work on touch (`useFinePointer`).
- The headline stays "Lead AI Engineer", with no subtitle.
