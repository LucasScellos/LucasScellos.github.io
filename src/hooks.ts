import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** True on a mouse / trackpad (hover-capable, precise pointer). */
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)');

/** True when pointer-driven and scroll-driven 3D effects should run. */
export function useRichMotion() {
  const reduced = useReducedMotion();
  return !reduced;
}

export type Theme = 'dark' | 'light';

const readTheme = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

/** Light by default; the visitor's choice is remembered. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () =>
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme-v2', next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });

  return [theme, toggle];
}

/** Current value of CSS custom properties, refreshed when the theme changes. */
export function useCssVars(names: string[]): string[] {
  const read = () => {
    const cs = getComputedStyle(document.documentElement);
    return names.map((n) => cs.getPropertyValue(n).trim());
  };
  const [values, setValues] = useState(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setValues(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return values;
}

/** Locks page scroll (e.g. while a modal is open), compensating for the scrollbar. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const gap = window.innerWidth - root.clientWidth;
    const prev = { overflow: root.style.overflow, pad: document.body.style.paddingRight };
    root.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      root.style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.pad;
    };
  }, [active]);
}
