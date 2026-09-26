import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { profile } from '../data/profile';
import { useTheme } from '../hooks';
import { chatEnabled, openChat } from './ChatWidget';
import { MoonIcon, SunIcon } from './Icons';

const LINKS = [
  { href: '#work', label: 'Chapters' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function TopBar() {
  const [theme, toggleTheme] = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  return (
    <header className="topbar">
      <motion.span className="topbar-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="topbar-inner container">
        <a href="#top" className="brand" aria-label={`${profile.name}, back to top`}>
          {profile.name}
        </a>
        <nav className="topbar-nav" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="topbar-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
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
              Talk with me
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
