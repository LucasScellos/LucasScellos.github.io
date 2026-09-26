import TopBar from './components/TopBar';
import Hero from './components/Hero';
import About from './components/About';
import Tunnel from './components/Tunnel';
import Constellation from './components/Constellation';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ChatWidget from './components/ChatWidget';
import Cursor from './components/Cursor';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
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
