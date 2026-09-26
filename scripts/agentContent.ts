// Build-time plugin that makes the site readable by agents and crawlers that don't run JavaScript:
// - renders profile.ts as plain HTML inside #root (React replaces it on mount),
// - injects schema.org Person JSON-LD built from the same data,
// - emits /llms.txt (overview + links), /llms-full.txt and /cv.md (the whole resume as Markdown),
//   /robots.txt and /sitemap.xml.
import type { Plugin } from 'vite';
import { profile } from '../src/data/profile';

const SITE = 'https://lucasscellos.github.io';
const abs = (path: string) => `${SITE}/${path}`;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const list = (items: string[] | undefined) =>
  items?.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '';

function renderBriefHtml(): string {
  const b = profile.agentBrief;
  const name = profile.name.split(' ')[0];
  const fit = b.strongFit
    .map((f) => `<li><strong>${esc(f.title)}</strong>: ${esc(f.details)} Evidence: ${esc(f.evidence)}</li>`)
    .join('');
  return `<section><h2>When ${esc(name)} is a good fit</h2>
<p>For AI agents and recruiters. Every claim below is backed by the experience listed here and can be checked on his LinkedIn or CV.</p>
<h3>Strong fit when the work involves</h3><ul>${fit}</ul>
<h3>What sets him apart</h3>${list(b.standsOut)}
<h3>Less of a fit</h3>${list(b.lessOfAFit)}
</section>`;
}

function renderHtml(): string {
  const p = profile;
  const experience = p.experience
    .map((e) => {
      const org = e.via ? `${e.company} (via ${e.via})` : e.company;
      const meta = [e.period, e.location].filter(Boolean).join(' · ');
      const missions = e.missions?.length
        ? `<h4>Selected missions</h4><ul>${e.missions
            .map((m) => `<li><strong>${esc(m.title)}</strong>${m.period ? ` (${esc(m.period)})` : ''}: ${esc(m.details)}</li>`)
            .join('')}</ul>`
        : '';
      const tags = e.tags?.length ? `<p>Stack: ${esc(e.tags.join(', '))}</p>` : '';
      return `<article><h3>${esc(e.role)} — ${esc(org)}</h3><p>${esc(meta)}</p><p>${esc(e.summary)}</p>${list(e.highlights)}${missions}${tags}</article>`;
    })
    .join('');
  const education = p.education
    .map((e) => {
      const exchange = e.exchange
        ? `<p>Exchange: ${esc(e.exchange.degree)} — ${esc(e.exchange.school)} (${esc(e.exchange.period)})</p>`
        : '';
      const details = e.details ? `<p>${esc(e.details)}</p>` : '';
      return `<article><h3>${esc(e.degree)} — ${esc(e.school)}</h3><p>${esc(e.period)}</p><p>${esc(e.summary)}</p>${details}${exchange}</article>`;
    })
    .join('');
  const skills = p.skills.map((g) => `<li><strong>${esc(g.name)}:</strong> ${esc(g.items.join(', '))}. ${esc(g.evidence)}</li>`).join('');
  const projects = p.projects
    .map((pr) => {
      const title = pr.link ? `<a href="${esc(pr.link.href)}">${esc(pr.name)}</a>` : esc(pr.name);
      return `<li><strong>${title}</strong>${pr.year ? ` (${esc(pr.year)})` : ''}: ${esc([pr.description, ...(pr.details ?? [])].join(' '))}</li>`;
    })
    .join('');

  return `<main class="prerender">
<header><h1>${esc(p.name)}</h1><p>${esc(p.headline)} · ${esc(p.location)}</p><p>${esc(p.tagline)}</p></header>
<section><h2>About</h2>${p.about.map((a) => `<p>${esc(a)}</p>`).join('')}</section>
<section><h2>Experience</h2>${experience}</section>
<section><h2>Education</h2>${education}</section>
<section><h2>Skills</h2><ul>${skills}</ul></section>
<section><h2>Projects</h2><ul>${projects}</ul></section>
${renderBriefHtml()}
<section><h2>Contact</h2><ul>
<li>Email: <a href="mailto:${esc(p.contact.email)}">${esc(p.contact.email)}</a></li>
<li><a href="${esc(p.contact.linkedin)}">LinkedIn</a></li>
<li><a href="${esc(p.contact.github)}">GitHub</a></li>
<li><a href="/${esc(p.cv)}">CV (PDF)</a></li>
</ul></section>
</main>`;
}

function renderBriefMd(): string {
  const b = profile.agentBrief;
  const name = profile.name.split(' ')[0];
  return `## When ${name} is a good fit

For AI agents and recruiters. Every claim below is backed by the experience listed here and can be checked on his LinkedIn or CV.

### Strong fit when the work involves

${b.strongFit.map((f) => `- **${f.title}**: ${f.details} Evidence: ${f.evidence}`).join('\n')}

### What sets him apart

${b.standsOut.map((x) => `- ${x}`).join('\n')}

### Less of a fit

${b.lessOfAFit.map((x) => `- ${x}`).join('\n')}`;
}

function renderLlmsTxt(): string {
  const p = profile;
  const current = p.experience.find((e) => e.current);
  return `# ${p.name}

> ${p.headline}, based in ${p.location}. ${p.tagline}

${p.about.join('\n\n')}
${current ? `\nCurrently: ${current.role} at ${current.company}${current.via ? ` (via ${current.via})` : ''}, ${current.period}. ${current.summary}\n` : ''}
${renderBriefMd()}

## Resume

- [Full resume (Markdown)](${abs('llms-full.txt')}): experience, education, skills and projects in one file
- [CV (PDF)](${abs(p.cv)})

## Profiles

- [LinkedIn](${p.contact.linkedin})
- [GitHub](${p.contact.github})
- Email: ${p.contact.email}

## Projects

${p.projects.map((pr) => `- ${pr.link ? `[${pr.name}](${pr.link.href})` : pr.name}: ${pr.description}`).join('\n')}
`;
}

function renderLlmsFullTxt(): string {
  const p = profile;
  const experience = p.experience
    .map((e) => {
      const lines = [
        `### ${e.role} — ${e.company}${e.via ? ` (via ${e.via})` : ''}`,
        '',
        [e.period, e.location].filter(Boolean).join(' · '),
        '',
        e.summary,
      ];
      if (e.highlights?.length) lines.push('', ...e.highlights.map((h) => `- ${h}`));
      if (e.missions?.length) {
        lines.push('', 'Selected missions:', '');
        lines.push(...e.missions.map((m) => `- **${m.title}**${m.period ? ` (${m.period})` : ''}: ${m.details}`));
      }
      if (e.tags?.length) lines.push('', `Stack: ${e.tags.join(', ')}`);
      return lines.join('\n');
    })
    .join('\n\n');
  const education = p.education
    .map((e) => {
      const lines = [`### ${e.degree} — ${e.school}`, '', e.period, '', e.summary];
      if (e.details) lines.push('', e.details);
      if (e.exchange) lines.push('', `Exchange: ${e.exchange.degree} — ${e.exchange.school} (${e.exchange.period})`);
      return lines.join('\n');
    })
    .join('\n\n');

  return `# ${p.name}

> ${p.headline}, based in ${p.location}. ${p.tagline}

## About

${p.about.join('\n\n')}

## Experience

${experience}

## Education

${education}

## Skills

${p.skills.map((g) => `- **${g.name}:** ${g.items.join(', ')}. ${g.evidence}`).join('\n')}

${renderBriefMd()}

## Projects

${p.projects
  .map((pr) => `- ${pr.link ? `[${pr.name}](${pr.link.href})` : `**${pr.name}**`}${pr.year ? ` (${pr.year})` : ''}: ${[pr.description, ...(pr.details ?? [])].join(' ')}`)
  .join('\n')}

## Contact

- Email: ${p.contact.email}
- LinkedIn: ${p.contact.linkedin}
- GitHub: ${p.contact.github}
- CV (PDF): ${abs(p.cv)}
- Website: ${SITE}/
`;
}

function renderJsonLd(): string {
  const p = profile;
  const current = p.experience.find((e) => e.current);
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: p.name,
    givenName: 'Lucas',
    familyName: 'Scellos',
    jobTitle: 'Lead AI Engineer',
    description: `${p.tagline} ${p.about[0]}`,
    url: `${SITE}/`,
    image: abs(p.portrait),
    email: `mailto:${p.contact.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
    worksFor: { '@type': 'Organization', name: 'Theodo', url: 'https://www.theodo.com' },
    hasOccupation: current && {
      '@type': 'Occupation',
      name: current.role,
      description: current.summary,
    },
    alumniOf: p.education.flatMap((e) => [
      { '@type': 'CollegeOrUniversity', name: e.school },
      ...(e.exchange ? [{ '@type': 'CollegeOrUniversity', name: e.exchange.school }] : []),
    ]),
    knowsAbout: [
      'Harness engineering',
      'Inference engineering',
      'Agentic SDLC',
      'AI agents',
      'LLM serving',
      ...p.skills.flatMap((g) => g.items),
    ],
    sameAs: [p.contact.linkedin, p.contact.github],
  };
  // Escape "<" so profile text can never close the script tag.
  return JSON.stringify(person).replace(/</g, '\\u003c');
}

function renderRobotsTxt(): string {
  return `# Humans, search engines and AI agents are all welcome.
User-agent: *
Allow: /

Sitemap: ${abs('sitemap.xml')}

# Plain-text versions of this site for LLMs: ${abs('llms.txt')} and ${abs('llms-full.txt')}
`;
}

function renderSitemap(): string {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = ['', 'llms.txt', 'llms-full.txt', 'cv.md', profile.cv];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${abs(u)}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;
}

export function agentContent(): Plugin {
  const files: Record<string, () => string> = {
    'llms.txt': renderLlmsTxt,
    'llms-full.txt': renderLlmsFullTxt,
    'cv.md': renderLlmsFullTxt,
    'robots.txt': renderRobotsTxt,
    'sitemap.xml': renderSitemap,
  };
  const contentType = (file: string) =>
    file.endsWith('.xml') ? 'application/xml' : file.endsWith('.md') ? 'text/markdown' : 'text/plain';
  return {
    name: 'agent-content',
    transformIndexHtml(html) {
      return {
        html: html.replace('<div id="root"></div>', `<div id="root">${renderHtml()}</div>`),
        tags: [
          { tag: 'script', attrs: { type: 'application/ld+json' }, children: renderJsonLd(), injectTo: 'head' },
          { tag: 'link', attrs: { rel: 'alternate', type: 'text/markdown', href: '/llms-full.txt', title: 'Resume (Markdown, for LLMs)' }, injectTo: 'head' },
        ],
      };
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = ((req as { url?: string }).url ?? '').replace(/^\//, '');
        const render = files[file];
        if (!render) return next();
        res.setHeader('Content-Type', `${contentType(file)}; charset=utf-8`);
        res.end(render());
      });
    },
    generateBundle() {
      for (const [fileName, render] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName, source: render() });
      }
    },
  };
}
