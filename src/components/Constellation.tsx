import { useLayoutEffect, useRef, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { profile } from '../data/profile';
import { fadeUp, inView, morphSpring, stagger } from '../motion';
import { useI18n } from '../i18n';

interface Star {
  name: string;
  group: number;
  /** Resting position in the cloud, in % of the field. */
  left: number;
  top: number;
  /** Per-star drift, so the cloud never moves in lockstep. */
  delay: number;
  duration: number;
}

// Skill names are the same in every language (only group names are translated), so the cloud is built once.
// Golden-angle spiral: an even, organic spread with no overlaps.
const all = profile.skills.flatMap((g, group) => g.items.map((name) => ({ name, group })));
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const stars: Star[] = all.map((s, i) => {
  const r = Math.sqrt((i + 0.6) / all.length);
  const a = i * GOLDEN;
  return {
    ...s,
    left: 50 + Math.cos(a) * r * 44,
    top: 50 + Math.sin(a) * r * 40,
    delay: -((i * 1.7) % 9),
    duration: 9 + ((i * 3.1) % 6),
  };
});

type Point = { x: number; y: number };

/** Nudges labels apart until none overlap, keeping them inside the field. */
function relax(sizes: { w: number; h: number }[], width: number, height: number): Point[] {
  const gap = width < 500 ? 6 : 10;
  const pad = width < 500 ? 8 : 14;
  const pts = stars.map((s) => ({ x: (s.left / 100) * width, y: (s.top / 100) * height }));
  for (let iter = 0; iter < 500; iter++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[j].x - pts[i].x;
        const dy = pts[j].y - pts[i].y;
        const ox = (sizes[i].w + sizes[j].w) / 2 + gap - Math.abs(dx);
        const oy = (sizes[i].h + sizes[j].h) / 2 + gap - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        moved = true;
        if (ox < oy * 2.2) {
          const push = (ox / 2) * (dx < 0 ? -1 : 1);
          pts[i].x -= push;
          pts[j].x += push;
        } else {
          const push = (oy / 2) * (dy < 0 ? -1 : 1);
          pts[i].y -= push;
          pts[j].y += push;
        }
      }
    }
    pts.forEach((p, i) => {
      p.x = Math.min(width - sizes[i].w / 2 - pad, Math.max(sizes[i].w / 2 + pad, p.x));
      p.y = Math.min(height - sizes[i].h / 2 - pad, Math.max(sizes[i].h / 2 + pad, p.y));
    });
    if (!moved) break;
  }
  return pts;
}

/** Skills drift as a slow cloud; picking a group gathers its stars into a readable line. */
export default function Constellation() {
  const [active, setActive] = useState<number | null>(null);
  const { t, profile: localized } = useI18n();
  const sky = useRef<HTMLDivElement>(null);
  const sizes = useRef<{ w: number; h: number }[] | null>(null);
  const [points, setPoints] = useState<Point[] | null>(null);

  // Lay the cloud out from real label sizes, and again whenever the field resizes.
  useLayoutEffect(() => {
    const el = sky.current;
    if (!el) return;
    const layout = () => {
      const labels = el.querySelectorAll<HTMLElement>('.sky-cloud .star-drift');
      if (labels.length === stars.length) {
        sizes.current = [...labels].map((l) => ({ w: l.offsetWidth, h: l.offsetHeight }));
      }
      if (sizes.current) setPoints(relax(sizes.current, el.clientWidth, el.clientHeight));
    };
    layout();
    // Web fonts change label widths once they arrive.
    document.fonts?.ready.then(() => {
      sizes.current = null;
      layout();
    });
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section id="skills" className="skills container" aria-labelledby="skills-title">
      <motion.header className="section-head" {...inView} variants={stagger(0.08)}>
        <motion.h2 id="skills-title" className="kicker" variants={fadeUp}>
          {t.skills}
        </motion.h2>
        <motion.p className="section-title" variants={fadeUp}>
          {t.skillsTitle[0]}
          <em>{t.skillsTitle[1]}</em>
        </motion.p>
      </motion.header>

      <LayoutGroup>
        <div className="skills-layout">
          <ul className="skill-groups" role="list" onMouseLeave={() => setActive(null)}>
            {localized.skills.map((g, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="skill-group"
                  aria-pressed={active === i}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(i)}
                >
                  {active === i && <motion.span layoutId="group-active" className="skill-group-bg" transition={morphSpring} />}
                  <span className="skill-group-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="skill-group-name">{g.name}</span>
                  <span className="skill-group-count">{g.items.length}</span>
                </button>
              </li>
            ))}
          </ul>

          <div ref={sky} className={active === null ? 'sky' : 'sky is-focused'} aria-live="polite">
            <ul className="sky-cloud" aria-label={t.allSkills}>
              {stars.map((s, i) =>
                s.group === active ? null : (
                  <motion.li
                    key={s.name}
                    layoutId={`star-${s.name}`}
                    transition={morphSpring}
                    className="star"
                    style={points ? { left: points[i].x, top: points[i].y } : { left: `${s.left}%`, top: `${s.top}%` }}
                    animate={{ opacity: active === null ? 1 : 0.16 }}
                  >
                    <span className="star-drift" style={{ animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` }}>
                      {s.name}
                    </span>
                  </motion.li>
                ),
              )}
            </ul>
            {active !== null && (
              <div className="sky-focus">
                <motion.p
                  key={active}
                  className="sky-focus-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {localized.skills[active].name}
                </motion.p>
                <ul className="sky-focus-list">
                  {stars
                    .filter((s) => s.group === active)
                    .map((s) => (
                      <motion.li key={s.name} layoutId={`star-${s.name}`} transition={morphSpring} className="star is-lit">
                        {s.name}
                      </motion.li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </LayoutGroup>
    </section>
  );
}
