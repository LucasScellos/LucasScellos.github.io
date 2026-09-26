import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { chapters, kindLabel, type Chapter } from '../data/chapters';
import { useScrollLock } from '../hooks';
import { ease, morphSpring } from '../motion';
import { ArrowLeft, ArrowRight, CloseIcon } from './Icons';

interface Props {
  chapter?: Chapter;
  /** Chapter whose card the header elements morph from, if any. */
  morphId?: string;
  panelLayoutId?: string;
  panelKey?: string;
  prev?: Chapter;
  next?: Chapter;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onExitComplete: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ChapterDialog({
  chapter,
  morphId,
  panelLayoutId,
  panelKey,
  prev,
  next,
  onPrev,
  onNext,
  onClose,
  onExitComplete,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const open = Boolean(chapter);
  useScrollLock(open);

  // Slide direction when paging between chapters (newer = left, older = right).
  const lastIndex = useRef(-1);
  const index = chapter ? chapters.indexOf(chapter) : -1;
  const direction = lastIndex.current === -1 || index === lastIndex.current ? 0 : index > lastIndex.current ? 1 : -1;
  useEffect(() => {
    lastIndex.current = index;
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  useEffect(() => {
    if (open) closeRef.current?.focus({ preventScroll: true });
  }, [open]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    } else if (e.key === 'ArrowLeft' && prev) {
      e.preventDefault();
      onPrev();
    } else if (e.key === 'ArrowRight' && next) {
      e.preventDefault();
      onNext();
    } else if (e.key === 'Tab' && panelRef.current) {
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const lid = (part: string) => (morphId ? `${part}-${morphId}` : undefined);
  const morphing = Boolean(panelLayoutId);

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {chapter && (
        <div className="dialog-root" key="dialog" onKeyDown={onKeyDown}>
          <motion.div
            className="dialog-backdrop"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          />
          <motion.div
            key={panelKey}
            ref={panelRef}
            layoutId={panelLayoutId}
            className={`dialog-panel kind-${chapter.kind}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            tabIndex={-1}
            style={{ borderRadius: 28 }}
            transition={morphSpring}
            initial={morphing ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
            animate={morphing ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={morphing ? undefined : { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.2 } }}
          >
            <motion.button
              ref={closeRef}
              layout="position"
              type="button"
              className="dialog-close icon-btn"
              onClick={onClose}
              aria-label="Close chapter"
            >
              <CloseIcon />
            </motion.button>

            <motion.div className="dialog-scroll" ref={scrollRef} layoutScroll>
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.article
                  key={chapter.id}
                  className="dialog-content"
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 32 }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: d * -32 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease }}
                >
                  <header className="dialog-head">
                    <p className="dialog-meta">
                      <motion.span layoutId={lid('kind')} className="card-kind">
                        {kindLabel[chapter.kind]}
                        {chapter.current && <span className="badge-now">Now</span>}
                      </motion.span>
                      <motion.span layoutId={lid('period')} className="card-period">
                        {chapter.period}
                      </motion.span>
                    </p>
                    <motion.h2 layoutId={lid('org')} id="dialog-title" className="dialog-org">
                      {chapter.org}
                    </motion.h2>
                    <motion.p layoutId={lid('title')} className="dialog-title">
                      {chapter.title}
                    </motion.p>
                    {(chapter.via || chapter.location) && (
                      <p className="dialog-place">
                        {[chapter.via && `via ${chapter.via}`, chapter.location].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </header>

                  <motion.div
                    layout
                    className="dialog-body"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: morphId ? 0.18 : 0, duration: 0.4, ease } }}
                  >
                    <p className="dialog-summary">{chapter.summary}</p>

                    {chapter.highlights && chapter.highlights.length > 0 && (
                      <section className="dialog-block" aria-label="Highlights">
                        <h3 className="block-label">Highlights</h3>
                        <ul className="highlights">
                          {chapter.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {chapter.items && (
                      <section className="dialog-block" aria-label={chapter.items.label}>
                        <h3 className="block-label">{chapter.items.label}</h3>
                        <ul className="items">
                          {chapter.items.list.map((m) => (
                            <li key={m.title}>
                              <p className="item-title">{m.title}</p>
                              {m.period && <p className="item-period">{m.period}</p>}
                              {m.details && <p className="item-details">{m.details}</p>}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {chapter.tags && chapter.tags.length > 0 && (
                      <ul className="tags" aria-label="Tags">
                        {chapter.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </motion.article>
              </AnimatePresence>
            </motion.div>

            <motion.nav layout="position" className="dialog-nav" aria-label="Other chapters">
              {prev ? (
                <button type="button" className="pager" onClick={onPrev}>
                  <ArrowLeft />
                  <span className="pager-text">
                    <span className="pager-hint">Newer</span>
                    <span className="pager-name">{prev.org}</span>
                  </span>
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <button type="button" className="pager pager-next" onClick={onNext}>
                  <span className="pager-text">
                    <span className="pager-hint">Older</span>
                    <span className="pager-name">{next.org}</span>
                  </span>
                  <ArrowRight />
                </button>
              ) : (
                <span />
              )}
            </motion.nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
