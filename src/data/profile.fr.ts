// French version of the site content. Structure, links, ids and skill names come from profile.ts;
// only the prose is translated here.
import { profile as en, type Experience, type Education, type Profile } from './profile';

type ExperienceText = Pick<Experience, 'role' | 'period' | 'summary' | 'highlights' | 'missions'>;
type EducationText = Pick<Education, 'degree' | 'summary' | 'details' | 'exchange'>;

const experience: Record<string, ExperienceText> = {
  carrefour: {
    role: 'Lead Engineer — SDLC agentique',
    period: 'sept. 2026 – aujourd’hui',
    summary:
      'Je transforme le cycle de développement logiciel de Carrefour en SDLC agentique : concevoir le bon SDLC pour les équipes et placer le bon harness au bon endroit.',
  },
  'bnp-paribas': {
    role: 'Inference Engineer',
    period: 'sept. 2025 – sept. 2026',
    summary:
      'J’ai travaillé sur l’une des plus grandes plateformes de serving de LLM en Europe, qui sert des LLM à des milliers d’utilisateurs.',
    highlights: [
      'Serving de modèles avec vLLM et optimisation des performances.',
      'Benchmarks de sécurité et de performance des modèles.',
      'Investigation d’incidents en production.',
      'Déploiements GitOps avec ArgoCD sur Kubernetes.',
    ],
  },
  'axionable-mid': {
    role: 'Ingénieur IA/ML confirmé',
    period: '2023 – 2025',
    summary:
      'Plus de 10 missions de conseil, entre tech et conseil : risque climatique, data science géospatiale et IA de confiance.',
    missions: [
      {
        title: 'Mesure de l’exposition aux aléas sécheresse et inondation pour l’assurance',
        period: '2023 – 2024',
        details:
          'Recherche sur l’attribution CatNat et pipelines de données climatiques (NetCDF, Xarray, GeoPandas) sur les données Copernicus, Drias et Hydroportail, avec Spark sur GCP.',
      },
      {
        title: 'Calcul du risque climatique pour un gestionnaire d’actifs',
        period: '2024 · France / Afrique du Sud',
        details: 'Scores de vulnérabilité selon plusieurs scénarios climatiques, à partir de données NetCDF / GRIB.',
      },
      {
        title: 'Méthodologie IA de confiance et accompagnement à la certification LNE',
        period: '2024',
        details: 'Mise en conformité avec l’AI Act européen ; audit de la documentation et de la méthodologie.',
      },
    ],
    highlights: ['Référent GenAI chez Axionable.', 'Encadrement d’un stagiaire de fin d’études.'],
  },
  'axionable-junior': {
    role: 'Data Scientist junior',
    period: '2023',
    summary: 'Conseil en certification IA de confiance et modélisation climatique.',
    highlights: [
      'Conseil en certification IA de confiance (LNE, LabelIA).',
      'Modèle de sécheresse sur Vertex AI (GCP) avec les données Drias.',
    ],
  },
  thales: {
    role: 'Stagiaire Data Engineer',
    period: '2022',
    summary: 'Plateforme de recherche et de stockage sous fortes contraintes de cybersécurité.',
    highlights: [
      'Moteur de recherche OpenSearch / ELK et stockage objet MinIO.',
      'Automatisation avec Scrapy / Selenium.',
      'Docker et Kubernetes sur un cloud privé.',
    ],
  },
  akeneo: {
    role: 'Stagiaire Data Engineer',
    period: '2021',
    summary: 'Conception de pipelines ML et analyse de l’usage client.',
  },
};

const education: Record<string, EducationText> = {
  'ets-montreal': {
    degree: 'M.Sc. Technologies de l’information',
    summary: 'Maîtrise en technologies de l’information — le volet montréalais du double diplôme INSA Rouen × ÉTS.',
    exchange: { degree: 'Mathématiques avancées et finance', school: 'Université McGill', period: '2022' },
  },
  'insa-rouen': {
    degree: 'Diplôme d’ingénieur, Architecture des systèmes d’information',
    summary: 'Diplôme d’ingénieur en architecture des systèmes d’information — le volet rouennais du double diplôme avec l’ÉTS Montréal.',
    details: 'Spécialisation data science.',
  },
};

const skillGroups = ['Inférence & serving LLM', 'Ingénierie agentique', 'Plateforme & Ops', 'Data & ML', 'IA de confiance'];

const projects: Record<string, { name?: string; description: string; linkLabel?: string }> = {
  'Talk with me': {
    description: 'Un chatbot personnel avec qui discuter, hébergé sur un Space Hugging Face.',
    linkLabel: 'Ouvrir le Space',
  },
  'Pollen Forecast': {
    description: 'Application web de prévision des allergies au pollen, déployée sur GitHub Pages.',
    linkLabel: 'Ouvrir l’application',
  },
  'Smart IoT weather station': {
    name: 'Station météo IoT connectée',
    description: 'Station météo IoT connectée, construite sur AWS.',
  },
  'Bike sharing visualization & prediction': {
    name: 'Vélos en libre-service : visualisation et prédiction',
    description: 'Visualisation et prédiction pour un système de vélos en libre-service.',
  },
  'Personal chatbot': {
    name: 'Chatbot personnel',
    description: 'Chatbot entraîné sur mes conversations WhatsApp avec BERT.',
  },
};

export const profileFr: Profile = {
  ...en,
  tagline:
    'Je construis les harness qui rendent les agents IA fiables, et l’infrastructure qui sert les LLM à grande échelle.',
  location: 'Paris, France',
  about: [
    'Je suis Lead AI Engineer chez Theodo. Je me concentre sur le harness engineering et l’inference engineering : concevoir le harness qui permet aux agents IA de livrer de façon fiable — orchestration, outils, contexte, evals et garde-fous — et servir des LLM à grande échelle en production. Je suis aussi coach chez Theodo : j’aide mes collègues à progresser et à développer leurs compétences et leur carrière.',
    'Avant Theodo, j’ai travaillé chez Axionable, entre tech et conseil, où j’ai mené plus de 10 missions en modélisation du risque climatique, data science géospatiale et IA de confiance / certification AI Act.',
  ],
  experience: en.experience.map((e) => ({ ...e, ...experience[e.id] })),
  education: en.education.map((e) => ({ ...e, ...education[e.id] })),
  skills: en.skills.map((g, i) => ({ ...g, name: skillGroups[i] ?? g.name })),
  projects: en.projects.map((p) => {
    const fr = projects[p.name];
    if (!fr) return p;
    return {
      ...p,
      name: fr.name ?? p.name,
      description: fr.description,
      link: p.link && { ...p.link, label: fr.linkLabel ?? p.link.label },
    };
  }),
};
