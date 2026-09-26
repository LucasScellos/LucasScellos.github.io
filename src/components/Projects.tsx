import { motion } from 'framer-motion';
import { profile, type Project } from '../data/profile';
import { fadeUp, inView, stagger } from '../motion';
import { ArrowUpRight } from './Icons';

function Body({ p }: { p: Project }) {
  return (
    <>
      <span className="project-top">
        <span className="project-year">{p.year ?? 'Live'}</span>
        {p.link && (
          <span className="card-more-icon" aria-hidden="true">
            <ArrowUpRight width={15} height={15} />
          </span>
        )}
      </span>
      <span className="project-name">{p.name}</span>
      <span className="project-desc">{p.description}</span>
      <span className="project-tags">{p.tags.join(' · ')}</span>
    </>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="split container" aria-labelledby="projects-title">
      <motion.h2 id="projects-title" className="section-title" {...inView} variants={fadeUp}>
        Side projects
      </motion.h2>
      <motion.ul className="project-row" {...inView} variants={stagger(0.06)}>
        {profile.projects.map((p) => (
          <motion.li key={p.name} variants={fadeUp}>
            {p.link ? (
              <a
                className="project-card is-link"
                href={p.link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${p.name}: ${p.link.label} (opens in a new tab)`}
              >
                <Body p={p} />
              </a>
            ) : (
              <div className="project-card">
                <Body p={p} />
              </div>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
