import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { chapters, kindLabel, type Chapter, type ChapterKind } from '../data/chapters';
import { fadeUp, inView, morphSpring, stagger } from '../motion';
import ChapterDialog from './ChapterDialog';
import { ArrowUpRight } from './Icons';

type Filter = 'all' | ChapterKind;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'work', label: 'Work' },
  { value: 'education', label: 'Education' },
];

interface OpenState {
  /** Chapter currently shown. */
  id: string;
  /** Chapter the dialog was opened from (its card is the morph partner). */
  origin: string;
  /** Whether the dialog morphs from/to the origin card (false for deep links). */
  morph: boolean;
}

const idFromUrl = () => {
  const id = new URLSearchParams(window.location.search).get('chapter');
  return id && chapters.some((c) => c.id === id) ? id : null;
};

const years = (c: Chapter) => c.period.match(/\d{4}/g) ?? [];
const newest = years(chapters[0]).pop();
const oldest = years(chapters[chapters.length - 1])[0];

export default function Chapters() {
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<OpenState | null>(() => {
    const id = idFromUrl();
    return id ? { id, origin: id, morph: false } : null;
  });
  // After navigating inside the dialog, the origin card is detached from the
  // morph so closing doesn't fly the dialog back into a different card.
  const [detached, setDetached] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());

  const visible = useMemo(
    () => (filter === 'all' ? chapters : chapters.filter((c) => c.kind === filter)),
    [filter],
  );

  // Keep ?chapter=<id> in sync so an open chapter can be shared.
  const openId = open?.id ?? null;
  useEffect(() => {
    const url = new URL(window.location.href);
    if (openId) url.searchParams.set('chapter', openId);
    else url.searchParams.delete('chapter');
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
  }, [openId]);

  const close = useCallback(() => {
    if (!open) return;
    const navigated = open.id !== open.origin || !open.morph;
    const target = open.id;
    setOpen(null);
    requestAnimationFrame(() => cardRefs.current.get(target)?.focus({ preventScroll: !navigated }));
  }, [open]);

  const list = open && visible.some((c) => c.id === open.id) ? visible : chapters;
  const index = open ? list.findIndex((c) => c.id === open.id) : -1;
  const prev = index > 0 ? list[index - 1] : undefined;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : undefined;

  const go = useCallback(
    (target?: Chapter) => {
      if (!open || !target) return;
      if (open.morph) setDetached(open.origin);
      setOpen({ ...open, id: target.id });
    },
    [open],
  );

  const current = open ? chapters.find((c) => c.id === open.id) : undefined;
  const morphId = open && open.morph && open.id === open.origin && detached !== open.origin ? open.origin : undefined;

  return (
    <section id="chapters" className="chapters container" aria-labelledby="chapters-title">
      <motion.header className="section-head" {...inView} variants={stagger(0.08)}>
        <div>
          <motion.h2 id="chapters-title" className="section-title" variants={fadeUp}>
            Chapters
          </motion.h2>
          <motion.p className="section-sub" variants={fadeUp}>
            Where I work now, back to where it all started. Pick a chapter to open it.
          </motion.p>
        </div>
        <motion.div className="chapters-controls" variants={fadeUp}>
          <p className="chapters-range" aria-hidden="true">
            <span>{newest}</span>
            <span className="range-line" />
            <span>{oldest}</span>
          </p>
          <div className="chips" role="group" aria-label="Filter chapters">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className="chip"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {filter === f.value && (
                  <motion.span layoutId="chip-active" className="chip-bg" transition={morphSpring} />
                )}
                <span className="chip-label">{f.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.header>

      <motion.ul className="chapter-grid" {...inView} viewport={{ once: true, amount: 0.05 }} variants={stagger(0.07)}>
        <AnimatePresence mode="popLayout">
          {visible.map((c) => {
            const linked = detached !== c.id;
            const lid = (part: string) => (linked ? `${part}-${c.id}` : undefined);
            return (
              <motion.li
                key={c.id}
                className={c.current ? 'is-featured' : undefined}
                layout
                variants={fadeUp}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              >
                <motion.button
                  key={linked ? c.id : `${c.id}-detached`}
                  ref={(el) => {
                    if (el) cardRefs.current.set(c.id, el);
                    else cardRefs.current.delete(c.id);
                  }}
                  type="button"
                  layoutId={lid('chapter')}
                  transition={morphSpring}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.985 }}
                  style={{ borderRadius: 22 }}
                  className={`chapter-card kind-${c.kind}${c.current ? ' is-current' : ''}`}
                  aria-haspopup="dialog"
                  aria-label={`${c.org}, ${c.title}, ${c.period}`}
                  aria-describedby={`summary-${c.id}`}
                  onClick={() => setOpen({ id: c.id, origin: c.id, morph: true })}
                >
                  <span className="card-top">
                    <motion.span layoutId={lid('kind')} className="card-kind">
                      {kindLabel[c.kind]}
                      {c.current && <span className="badge-now">Now</span>}
                    </motion.span>
                    <motion.span layoutId={lid('period')} className="card-period">
                      {c.period}
                    </motion.span>
                  </span>
                  <span className="card-main">
                    <motion.span layoutId={lid('org')} className="card-org">
                      {c.org}
                    </motion.span>
                    <motion.span layoutId={lid('title')} className="card-title">
                      {c.title}
                    </motion.span>
                    {c.note && <span className="card-note">{c.note}</span>}
                  </span>
                  <span id={`summary-${c.id}`} className="card-summary">
                    {c.summary}
                  </span>
                  <span className="card-more" aria-hidden="true">
                    <span>Open chapter</span>
                    <span className="card-more-icon">
                      <ArrowUpRight width={16} height={16} />
                    </span>
                  </span>
                </motion.button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      <ChapterDialog
        chapter={current}
        morphId={morphId}
        panelLayoutId={open?.morph ? `chapter-${open.origin}` : undefined}
        panelKey={open?.origin}
        prev={prev}
        next={next}
        onPrev={() => go(prev)}
        onNext={() => go(next)}
        onClose={close}
        onExitComplete={() => setDetached(null)}
      />
    </section>
  );
}
