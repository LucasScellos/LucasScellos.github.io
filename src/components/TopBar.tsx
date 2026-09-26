import { motion, useScroll, useSpring } from 'framer-motion';
import { profile } from '../data/profile';
import { chatEnabled, openChat } from './ChatWidget';

const LINKS = [
  { href: '#work', label: 'Chapters' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function TopBar() {
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
        {chatEnabled && (
          <button type="button" className="btn btn-solid btn-sm" onClick={openChat}>
            Talk with me
          </button>
        )}
      </div>
    </header>
  );
}
