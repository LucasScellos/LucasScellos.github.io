import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { profile } from '../data/profile';
import { useFinePointer, useRichMotion } from '../hooks';
import { ease, fadeUp, stagger } from '../motion';
import { chatEnabled, openChat } from './ChatWidget';
import { ChatIcon, DownloadIcon, GitHubIcon, LinkedInIcon } from './Icons';

/** Radius (px) of the pointer's "magnetic field" over the name. */
const FIELD = 240;
const OFF = -9999;

interface LetterProps {
  char: string;
  px: MotionValue<number>;
  py: MotionValue<number>;
  index: number;
}

/** One glyph of the name: lifts, swells and warms up as the pointer comes close. */
function Letter({ char, px, py, index }: LetterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const raw = useTransform<number, number>([px, py], ([x, y]) => {
    const el = ref.current;
    if (!el || x === OFF) return 0;
    const r = el.getBoundingClientRect();
    const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
    const p = Math.max(0, 1 - d / FIELD);
    return p * p * (3 - 2 * p);
  });
  const p = useSpring(raw, { stiffness: 220, damping: 22, mass: 0.5 });
  const y = useTransform(p, [0, 1], ['0em', '-0.14em']);
  const scale = useTransform(p, [0, 1], [1, 1.16]);
  const color = useTransform(p, [0, 1], ['#f2eee7', '#e8a27a']);

  return (
    <motion.span
      className="hero-letter"
      initial={{ opacity: 0, y: '0.5em', rotateX: -70 }}
      animate={{ opacity: 1, y: '0em', rotateX: 0 }}
      transition={{ delay: 0.15 + index * 0.045, duration: 0.9, ease }}
    >
      <motion.span ref={ref} className="hero-glyph" style={{ y, scale, color }}>
        {char}
      </motion.span>
    </motion.span>
  );
}

export default function Hero() {
  const rich = useRichMotion();
  const fine = useFinePointer();
  const ref = useRef<HTMLElement>(null);
  const [role, focus] = profile.headline.split(' — ');
  const words = profile.name.split(' ');

  // Pointer, in viewport coordinates.
  const px = useMotionValue(OFF);
  const py = useMotionValue(OFF);
  useEffect(() => {
    if (!rich || !fine) return;
    const move = (e: PointerEvent) => {
      px.set(e.clientX);
      py.set(e.clientY);
    };
    const leave = () => {
      px.set(OFF);
      py.set(OFF);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [rich, fine, px, py]);

  // A soft warm light that trails the pointer.
  const lx = useSpring(px, { stiffness: 60, damping: 20 });
  const ly = useSpring(py, { stiffness: 60, damping: 20 });
  const light = useMotionTemplate`radial-gradient(640px circle at ${lx}px ${ly}px, var(--glow), transparent 62%)`;

  // Scrolling away flies the camera through the name.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 1.9]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const nameBlur = useTransform(scrollYProgress, [0, 0.8], [0, 14]);
  const nameFilter = useMotionTemplate`blur(${nameBlur}px)`;
  const restOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const restY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  let index = 0;
  return (
    <section id="top" ref={ref} className="hero" aria-labelledby="hero-name">
      {rich && fine && <motion.div className="hero-light" aria-hidden="true" style={{ background: light }} />}
      <div className="grain" aria-hidden="true" />

      <div className="hero-stage container">
        <motion.p
          className="hero-eyebrow"
          style={rich ? { opacity: restOpacity, y: restY } : undefined}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <img className="hero-avatar" src={profile.portrait} alt="" width={40} height={40} />
          <span>
            {role}
            {focus && <span className="hero-focus"> · {focus}</span>}
          </span>
        </motion.p>

        <motion.h1
          id="hero-name"
          className="hero-name"
          aria-label={profile.name}
          style={rich ? { scale: nameScale, opacity: nameOpacity, filter: nameFilter } : undefined}
        >
          {words.map((w) => (
            <span key={w} className="hero-word" aria-hidden="true">
              {[...w].map((ch) => (
                <Letter key={index} char={ch} px={px} py={py} index={index++} />
              ))}
            </span>
          ))}
        </motion.h1>

        <motion.div
          className="hero-foot"
          style={rich ? { opacity: restOpacity, y: restY } : undefined}
          initial="hidden"
          animate="show"
          variants={stagger(0.08, 0.7)}
        >
          <motion.p className="hero-tagline" variants={fadeUp}>
            {profile.tagline}
          </motion.p>
          <motion.div className="hero-actions" variants={fadeUp}>
            {chatEnabled && (
              <button type="button" className="btn btn-accent" onClick={openChat}>
                <ChatIcon />
                Talk with me
              </button>
            )}
            <a className="btn btn-outline" href={profile.cv} download>
              <DownloadIcon />
              Download CV
            </a>
            <a className="icon-btn" href={profile.contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a className="icon-btn" href={profile.contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="scroll-cue"
        style={rich ? { opacity: restOpacity } : undefined}
        aria-label="Scroll to about"
      >
        <span className="scroll-cue-line" />
        Scroll to travel
      </motion.a>
    </section>
  );
}
