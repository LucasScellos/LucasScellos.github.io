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
