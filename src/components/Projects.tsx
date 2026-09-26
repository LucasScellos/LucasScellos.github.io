import { type PointerEvent as ReactPointerEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { profile, type Project } from '../data/profile';
import { useFinePointer, useRichMotion } from '../hooks';
import { fadeUp, inView, stagger } from '../motion';
import { ArrowUpRight } from './Icons';

/** A card that tilts towards the pointer while a specular highlight slides across it. */
function TiltCard({ project }: { project: Project }) {
  const rich = useRichMotion();
  const fine = useFinePointer();
  const tilt = rich && fine;
  // Pointer position inside the card, 0 → 1 on each axis.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-11, 11]);
  const rotateX = useTransform(sy, [0, 1], [9, -9]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(255, 240, 225, 0.16), transparent 55%)`;
  const hover = useMotionValue(0);
  const sheenOpacity = useSpring(hover, { stiffness: 200, damping: 30 });

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    hover.set(0);
  };

  const body = (
    <>
      <motion.span className="pcard-sheen" aria-hidden="true" style={{ background: sheen, opacity: sheenOpacity }} />
      <span className="pcard-top">
        <span className="pcard-year">{project.year ?? 'Ongoing'}</span>
        {project.link && (
          <span className="pcard-arrow" aria-hidden="true">
            <ArrowUpRight width={18} height={18} />
          </span>
        )}
      </span>
      <span className="pcard-name">{project.name}</span>
      <span className="pcard-desc">{project.description}</span>
      <span className="pcard-tags">
        {project.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </span>
    </>
  );

  const props = {
    className: project.link ? 'pcard is-link' : 'pcard',
    style: tilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined,
    onPointerMove: tilt ? onMove : undefined,
    onPointerEnter: tilt ? () => hover.set(1) : undefined,
    onPointerLeave: tilt ? onLeave : undefined,
  };

  return (
    <motion.li variants={fadeUp} className="pcard-slot">
      {project.link ? (
        <motion.a {...props} href={project.link.href} target="_blank" rel="noreferrer" aria-label={`${project.name} — ${project.link.label}`}>
          {body}
        </motion.a>
      ) : (
        <motion.article {...props}>{body}</motion.article>
      )}
    </motion.li>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="projects container" aria-labelledby="projects-title">
      <motion.header className="section-head" {...inView} variants={stagger(0.08)}>
        <motion.h2 id="projects-title" className="kicker" variants={fadeUp}>
          Side projects
        </motion.h2>
        <motion.p className="section-title" variants={fadeUp}>
          Things I build <em>for the fun of it.</em>
        </motion.p>
      </motion.header>
      <motion.ul className="pcard-grid" {...inView} viewport={{ once: true, amount: 0.1 }} variants={stagger(0.08)}>
        {profile.projects.map((p) => (
          <TiltCard key={p.name} project={p} />
        ))}
      </motion.ul>
    </section>
  );
}
