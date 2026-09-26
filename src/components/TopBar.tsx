import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '../hooks';
import { useI18n } from '../i18n';
import { chatEnabled, openChat } from './ChatWidget';
import { MoonIcon, SunIcon } from './Icons';

const LINKS = ['work', 'skills', 'projects', 'contact'] as const;

export default function TopBar() {
  const [theme, toggleTheme] = useTheme();
  const { lang, toggleLang, t, profile } = useI18n();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  return (
    <header className="topbar">
      <motion.span className="topbar-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="topbar-inner container">
        <a href="#top" className="brand" aria-label={t.backToTop}>
          {profile.name}
        </a>
        <nav className="topbar-nav" aria-label={t.navLabel}>
          {LINKS.map((id) => (
            <a key={id} href={`#${id}`}>
              {t.nav[id]}
            </a>
          ))}
        </nav>
        <div className="topbar-actions">
          <button
            type="button"
            className="icon-btn lang-btn"
            onClick={toggleLang}
            aria-label={t.switchLang}
            lang={lang === 'fr' ? 'en' : 'fr'}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.toLight : t.toDark}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -60, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 60, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'inline-flex' }}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </AnimatePresence>
          </button>
          {chatEnabled && (
            <button type="button" className="btn btn-solid btn-sm" onClick={openChat}>
              {t.talkWithMe}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
