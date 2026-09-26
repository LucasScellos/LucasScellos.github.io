import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { fadeUp, inView, stagger } from '../motion';
import { ArrowUpRight, DownloadIcon, GitHubIcon, LinkedInIcon } from './Icons';

export default function Contact() {
  const { email, linkedin, github } = profile.contact;
  return (
    <footer id="contact" className="contact container" aria-labelledby="contact-title">
      <motion.div className="contact-inner" {...inView} variants={stagger(0.08)}>
        <motion.h2 id="contact-title" className="contact-title" variants={fadeUp}>
          Let’s talk.
        </motion.h2>
        <motion.a className="contact-email" href={`mailto:${email}`} variants={fadeUp}>
          {email}
          <ArrowUpRight width={22} height={22} />
        </motion.a>
        <motion.ul className="contact-links" variants={fadeUp}>
          <li>
            <a href={linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon /> LinkedIn
            </a>
          </li>
          <li>
            <a href={github} target="_blank" rel="noreferrer">
              <GitHubIcon /> GitHub
            </a>
          </li>
          <li>
            <a href={profile.cv} download>
              <DownloadIcon /> CV (PDF)
            </a>
          </li>
        </motion.ul>
      </motion.div>
      <div className="colophon">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{profile.location}</span>
      </div>
    </footer>
  );
}
