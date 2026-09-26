import TopBar from './components/TopBar';
import Intro from './components/Intro';
import Chapters from './components/Chapters';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar />
      <main id="main">
        <Intro />
        <Chapters />
        <Skills />
        <Projects />
      </main>
      <Contact />
      <ChatWidget />
    </>
  );
}
