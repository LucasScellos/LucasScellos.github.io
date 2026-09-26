import { motion } from 'framer-motion';
import { fadeUp, inView, stagger } from '../motion';
import { useI18n } from '../i18n';

/** One card per skill group: the skills, then where they were put into practice. */
export default function Skills() {
  const { t, profile } = useI18n();
  return (
    <section id="skills" className="skills container" aria-labelledby="skills-title">
      <motion.header className="section-head" {...inView} variants={stagger(0.08)}>
        <motion.h2 id="skills-title" className="kicker" variants={fadeUp}>
          {t.skills}
        </motion.h2>
        <motion.p className="section-title" variants={fadeUp}>
          {t.skillsTitle[0]}
          <em>{t.skillsTitle[1]}</em>
        </motion.p>
      </motion.header>

      <motion.ul className="scard-grid" {...inView} viewport={{ once: true, amount: 0.1 }} variants={stagger(0.08)}>
        {profile.skills.map((g, i) => (
          <motion.li key={i} className="scard" variants={fadeUp}>
            <span className="scard-index" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="scard-name">{g.name}</h3>
            <ul className="scard-items" aria-label={t.skills}>
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="scard-proof">
              <span className="scard-proof-label">{t.inPractice}</span>
              {g.evidence}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
