import TopBar from './components/TopBar';
import Hero from './components/Hero';
import About from './components/About';
import Tunnel from './components/Tunnel';
import Constellation from './components/Constellation';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ChatWidget from './components/ChatWidget';
import Cursor from './components/Cursor';
import { useI18n } from './i18n';

export default function App() {
  const { t } = useI18n();
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipToContent}
      </a>
      <TopBar />
      <main id="main">
        <Hero />
        <About />
        <Tunnel />
        <Constellation />
        <Projects />
      </main>
      <Contact />
      <ChatWidget />
      <Cursor />
    </>
  );
}
