import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useRichMotion } from '../hooks';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, label, [data-cursor]';

/** Soft follower circle that inverts what's under it and swells over interactive elements. */
export default function Cursor() {
  const fine = useFinePointer();
  const rich = useRichMotion();
  const enabled = fine && rich;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.6 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const check = (el: Element | null) =>
      // The chat panel keeps the native cursor only: text fields read better without a blob on top.
      setHovering(Boolean(el?.closest(INTERACTIVE)) && !el?.closest('.chat-panel'));
    // What's under a still pointer changes after clicks (dialogs) and scrolls.
    const recheck = () => requestAnimationFrame(() => check(document.elementFromPoint(x.get(), y.get())));
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      check(e.target instanceof Element ? e.target : null);
    };
    const leave = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => {
      setPressed(false);
      setTimeout(recheck, 50);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', recheck, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', recheck);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="cursor"
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      animate={{
        scale: pressed ? 0.8 : hovering ? 2.3 : 1,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    />
  );
}
