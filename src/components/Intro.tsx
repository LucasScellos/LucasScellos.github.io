import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { fadeUp, stagger } from '../motion';
import { chatEnabled, openChat } from './ChatWidget';
import { ChatIcon, DownloadIcon, GitHubIcon, LinkedInIcon } from './Icons';

export default function Intro() {
  const [role, focus] = profile.headline.split(' — ');

  return (
    <section id="top" className="intro container" aria-labelledby="intro-name">
      <motion.div className="intro-grid" initial="hidden" animate="show" variants={stagger(0.09, 0.05)}>
        <motion.div className="intro-portrait" variants={fadeUp}>
          <img src={profile.portrait} alt={`Portrait of ${profile.name}`} width={493} height={512} />
        </motion.div>

        <div className="intro-text">
          <motion.p className="eyebrow" variants={fadeUp}>
            {role}
            {focus && (
              <>
                <span className="eyebrow-sep" aria-hidden="true" />
                {focus}
              </>
            )}
          </motion.p>
          <motion.h1 id="intro-name" className="intro-name" variants={fadeUp}>
            {profile.name}
          </motion.h1>
          <motion.p className="intro-tagline" variants={fadeUp}>
            {profile.tagline}
          </motion.p>

          <motion.div className="intro-actions" variants={fadeUp}>
            {chatEnabled && (
              <button type="button" className="btn btn-accent" onClick={openChat}>
                <ChatIcon />
                Talk with me
              </button>
            )}
            <a className="btn btn-outline" href={profile.cv} download>
              <DownloadIcon />
              Download CV
            </a>
            <a className="btn btn-ghost" href={profile.contact.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon />
              LinkedIn
            </a>
            <a className="btn btn-ghost" href={profile.contact.github} target="_blank" rel="noreferrer">
              <GitHubIcon />
              GitHub
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="about"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger(0.08)}
      >
        <motion.h2 className="about-label" variants={fadeUp}>
          About
        </motion.h2>
        <div className="about-body">
          {profile.about.map((p, i) => (
            <motion.p key={i} variants={fadeUp} className={i === 0 ? 'about-lead' : undefined}>
              {p}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
