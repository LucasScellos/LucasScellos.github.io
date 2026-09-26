import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { profile } from '../data/profile';
import { useRichMotion } from '../hooks';
import { fadeUp, inView, stagger } from '../motion';

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const blur = useTransform(progress, range, ['blur(3px)', 'blur(0px)']);
  return (
    <motion.span className="reveal-word" style={{ opacity, filter: blur }}>
      {word}{' '}
    </motion.span>
  );
}

/** The lead paragraph lights up word by word as it scrolls through the viewport. */
export default function About() {
  const rich = useRichMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const [lead, ...rest] = profile.about;
  const words = lead.split(' ');

  return (
    <section id="about" className="about container" aria-labelledby="about-title">
      <h2 id="about-title" className="kicker">
        About
      </h2>
      <p ref={ref} className="about-lead">
        {rich
          ? words.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
            ))
          : lead}
      </p>
      <motion.div className="about-rest" {...inView} variants={stagger(0.1)}>
        {rest.map((p) => (
          <motion.p key={p} variants={fadeUp}>
            {p}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
}
