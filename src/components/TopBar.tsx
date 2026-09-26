import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../data/profile';
import { useTheme } from '../hooks';
import { chatEnabled, openChat } from './ChatWidget';
import { MoonIcon, SunIcon } from './Icons';

export default function TopBar() {
  const [theme, toggleTheme] = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={scrolled ? 'topbar scrolled' : 'topbar'}>
      <div className="topbar-inner container">
        <a href="#top" className="brand" aria-label={`${profile.name}, back to top`}>
          {profile.name}
        </a>
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
