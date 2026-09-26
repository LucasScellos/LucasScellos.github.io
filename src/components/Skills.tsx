import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { fadeUp, inView, stagger } from '../motion';

export default function Skills() {
  return (
    <section id="skills" className="split container" aria-labelledby="skills-title">
      <motion.h2 id="skills-title" className="section-title" {...inView} variants={fadeUp}>
        Skills
      </motion.h2>
      <motion.div className="skills-grid" {...inView} variants={stagger(0.06)}>
        {profile.skills.map((g) => (
          <motion.div key={g.name} className="skill-group" variants={fadeUp}>
            <h3 className="block-label">{g.name}</h3>
            <ul>
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
