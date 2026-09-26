import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { chapterIds, type Chapter } from '../data/chapters';
import { useRichMotion } from '../hooks';
import { useI18n } from '../i18n';
import { fadeUp, inView, stagger } from '../motion';
import ChapterDialog from './ChapterDialog';
import { ArrowUpRight } from './Icons';

/** Distance (px) between two chapters along the z axis. */
const DEPTH = 1100;
/** Wall frames drawn along the corridor, and their spacing. */
const FRAMES = 9;
const FRAME_GAP = DEPTH / 2;
/** Scroll progress at which the first / last chapter is in focus. */
const START = 0.03;
const END = 0.95;

const N = chapterIds.length;
/** Share of each chapter's scroll range spent holding still on it. */
const DWELL = 0.22;

/** Scroll progress → camera depth, pausing on every chapter so it can be read. */
function cameraAt(p: number) {
  const t = Math.min(1, Math.max(0, (p - START) / (END - START))) * (N - 1);
  const i = Math.floor(t);
  const f = t - i;
  const x = Math.min(1, Math.max(0, (f - DWELL) / (1 - 2 * DWELL)));
  return (i + x * x * (3 - 2 * x)) * DEPTH;
}
const focusProgress = (i: number) => START + (i / Math.max(1, N - 1)) * (END - START);
const startYear = (c: Chapter) => (c.period.match(/\d{4}/g) ?? [''])[0];

const idFromUrl = () => {
  const id = new URLSearchParams(window.location.search).get('chapter');
  return id && chapterIds.includes(id) ? id : null;
};

function CardBody({ chapter, index }: { chapter: Chapter; index: number }) {
  const { t } = useI18n();
  return (
    <>
      <span className="tcard-index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="tcard-top">
        <span className="card-kind">
          {t.kind[chapter.kind]}
          {chapter.current && <span className="badge-now">{t.now}</span>}
        </span>
        <span className="card-period">{chapter.period}</span>
      </span>
      <span className="tcard-org">{chapter.org}</span>
      <span className="tcard-title">
        {chapter.title}
        {chapter.via && <span className="tcard-via"> · {t.via} {chapter.via}</span>}
      </span>
      <span id={`summary-${chapter.id}`} className="tcard-summary">
        {chapter.summary}
      </span>
      <span className="tcard-more" aria-hidden="true">
        {t.openChapter} <ArrowUpRight width={16} height={16} />
      </span>
    </>
  );
}

interface CardProps {
  chapter: Chapter;
  index: number;
  camera: MotionValue<number>;
  onOpen: () => void;
  onFocus: () => void;
  refFn: (el: HTMLButtonElement | null) => void;
}

/** A chapter floating in the corridor; the camera flies towards it, through focus, then past it. */
function DepthCard({ chapter, index, camera, onOpen, onFocus, refFn }: CardProps) {
  const side = index % 2 === 0 ? -1 : 1;
  const rel = useTransform(camera, (c) => c - index * DEPTH);
  const z = rel;
  const x = useTransform(rel, [-3 * DEPTH, 0, 0.55 * DEPTH], [side * 260, 0, side * -420]);
  const rotateY = useTransform(rel, [-3 * DEPTH, 0, 0.55 * DEPTH], [side * -16, 0, side * 22]);
  const opacity = useTransform(
    rel,
    [-4 * DEPTH, -2.2 * DEPTH, -0.25 * DEPTH, 0.08 * DEPTH, 0.5 * DEPTH],
    [0, 0.35, 1, 1, 0],
  );
  const blurPx = useTransform(rel, [-3 * DEPTH, -0.35 * DEPTH, 0, 0.1 * DEPTH, 0.5 * DEPTH], [9, 1.5, 0, 0, 7]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const pointerEvents = useTransform(rel, (r) => (Math.abs(r) < 0.35 * DEPTH ? 'auto' : 'none'));
  const visibility = useTransform(rel, (r) => (r > -4 * DEPTH && r < 0.55 * DEPTH ? 'visible' : 'hidden'));

  return (
    <div className="tunnel-slot">
      <motion.button
        ref={refFn}
        type="button"
        className={`tcard kind-${chapter.kind}${chapter.current ? ' is-current' : ''}`}
        style={{ x, z, rotateY, opacity, filter, pointerEvents, visibility }}
        aria-haspopup="dialog"
        aria-label={`${chapter.org}, ${chapter.title}, ${chapter.period}`}
        aria-describedby={`summary-${chapter.id}`}
        onClick={onOpen}
        onFocus={onFocus}
      >
        <CardBody chapter={chapter} index={index} />
      </motion.button>
    </div>
  );
}

/** Thin rectangles that stream past the camera and give the corridor its depth. */
function Frame({ k, camera }: { k: number; camera: MotionValue<number> }) {
  const span = FRAMES * FRAME_GAP;
  const z = useTransform(camera, (c) => (((c + k * FRAME_GAP) % span) + span) % span - span + FRAME_GAP * 0.6);
  const opacity = useTransform(z, [-span, -span * 0.55, -FRAME_GAP, FRAME_GAP * 0.6], [0, 0.55, 0.3, 0]);
  return <motion.div className="tunnel-frame" style={{ z, opacity }} aria-hidden="true" />;
}

export default function Tunnel() {
  const rich = useRichMotion();
  const { t, chapters } = useI18n();
  const outer = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());
  const [openId, setOpenId] = useState<string | null>(idFromUrl);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.35 });
  const camera = useTransform(smooth, cameraAt);
  const railY = useTransform(camera, (c) => `${(c / ((N - 1) * DEPTH)) * 100}%`);

  useMotionValueEvent(camera, 'change', (c) => {
    const i = Math.min(N - 1, Math.max(0, Math.round(c / DEPTH)));
    setActive((prev) => (prev === i ? prev : i));
  });

  /** Scrolls the page so chapter i sits in focus. */
  const travelTo = useCallback((i: number, behavior: ScrollBehavior = 'smooth') => {
    const el = outer.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const length = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + focusProgress(i) * length, behavior });
  }, []);

  // Keep ?chapter=<id> in sync so an open chapter can be shared.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (openId) url.searchParams.set('chapter', openId);
    else url.searchParams.delete('chapter');
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
  }, [openId]);

  const index = openId ? chapters.findIndex((c) => c.id === openId) : -1;
  const current = index >= 0 ? chapters[index] : undefined;
  const prev = index > 0 ? chapters[index - 1] : undefined;
  const next = index >= 0 && index < N - 1 ? chapters[index + 1] : undefined;

  const close = () => {
    const target = openId;
    setOpenId(null);
    if (target) requestAnimationFrame(() => cardRefs.current.get(target)?.focus({ preventScroll: true }));
  };

  const setRef = (id: string) => (el: HTMLButtonElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  };

  const dialog = (
    <ChapterDialog
      chapter={current}
      prev={prev}
      next={next}
      onPrev={() => prev && setOpenId(prev.id)}
      onNext={() => next && setOpenId(next.id)}
      onClose={close}
      onExitComplete={() => {}}
    />
  );

  if (!rich) {
    // Reduced motion: the corridor unfolds into a calm vertical list.
    return (
      <section id="work" className="tunnel-static container" aria-labelledby="work-title">
        <motion.header className="section-head" {...inView} variants={stagger(0.08)}>
          <motion.h2 id="work-title" className="section-title" variants={fadeUp}>
            {t.chapters}
          </motion.h2>
          <motion.p className="section-sub" variants={fadeUp}>
            {t.chaptersSub}
          </motion.p>
        </motion.header>
        <ul className="static-list">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <button
                ref={setRef(c.id)}
                type="button"
                className={`tcard kind-${c.kind}${c.current ? ' is-current' : ''}`}
                aria-haspopup="dialog"
                aria-label={`${c.org}, ${c.title}, ${c.period}`}
                aria-describedby={`summary-${c.id}`}
                onClick={() => setOpenId(c.id)}
              >
                <CardBody chapter={c} index={i} />
              </button>
            </li>
          ))}
        </ul>
        {dialog}
      </section>
    );
  }

  return (
    <section id="work" className="tunnel" aria-labelledby="work-title">
      <div ref={outer} className="tunnel-track" style={{ height: `${N * 75 + 60}vh` }}>
        <div className="tunnel-sticky">
          <div className="tunnel-overlay container">
            <div>
              <h2 id="work-title" className="kicker">
                {t.chapters}
              </h2>
              <p className="tunnel-hint">{t.tunnelHint}</p>
            </div>
            <p className="tunnel-counter" aria-live="polite">
              <span className="tunnel-counter-now">{String(active + 1).padStart(2, '0')}</span>
              <span className="tunnel-counter-sep" />
              <span>{String(N).padStart(2, '0')}</span>
            </p>
          </div>

          <div className="tunnel-stage">
            {Array.from({ length: FRAMES }, (_, k) => (
              <Frame key={k} k={k} camera={camera} />
            ))}
            {chapters.map((c, i) => (
              <DepthCard
                key={c.id}
                chapter={c}
                index={i}
                camera={camera}
                refFn={setRef(c.id)}
                onOpen={() => setOpenId(c.id)}
                onFocus={() => travelTo(i, 'auto')}
              />
            ))}
          </div>

          <nav className="tunnel-rail" aria-label={t.jumpToChapter}>
            <div className="rail-line">
              <motion.span className="rail-dot" style={{ top: railY }} />
            </div>
            <ol>
              {chapters.map((c, i) => (
                <li key={c.id} style={{ top: `${(i / Math.max(1, N - 1)) * 100}%` }}>
                  <button
                    type="button"
                    tabIndex={-1}
                    className={i === active ? 'rail-mark is-active' : 'rail-mark'}
                    onClick={() => travelTo(i)}
                    aria-label={`${c.org}, ${c.period}`}
                  >
                    <span className="rail-year">{c.current ? t.now : startYear(c)}</span>
                    <span className="rail-org">{c.org}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      {dialog}
    </section>
  );
}
