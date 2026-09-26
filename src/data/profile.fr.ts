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
      'Tech lead du programme d’AI enablement qui fait entrer les agents IA dans les équipes de développement de Carrefour, au sein d’une équipe d’une dizaine de personnes.',
    highlights: [
      'Évaluation de la maturité IA des équipes existantes.',
      'Cadre de sécurité et de gouvernance pour les agents de code.',
      'Manuel opérationnel des équipes, indicateurs et parcours de formation, puis choix des premières équipes pilotes.',
    ],
  },
  'bnp-paribas': {
    role: 'AI / Inference Engineer',
    period: 'sept. 2025 – sept. 2026',
    summary:
      'AI engineer dans l’équipe ops de l’une des plus grandes plateformes de serving de LLM en Europe, utilisée par des centaines de milliers de personnes.',
    highlights: [
      'Contribué à doubler la capacité d’utilisateurs de la plateforme depuis mon arrivée, tout en relevant plusieurs limites de serving.',
      'Serving des modèles Mistral, en lien direct avec leur équipe, et de modèles open-weight : Qwen, Kimi, GLM, Muse Glimmer et Gemma.',
      'Optimisation de vLLM, benchmarks de sécurité et de performance des nouveaux modèles.',
      'Investigation d’incidents en production et déploiements GitOps avec ArgoCD sur Kubernetes.',
    ],
  },
  'axionable-mid': {
    role: 'Ingénieur IA/ML confirmé',
    period: '2023 – 2025',
    summary:
      'C’est là que j’ai fait mes classes, entre tech et conseil : plus de 10 missions, pour de grands groupes comme pour de petites structures, en risque climatique, data science géospatiale et IA de confiance.',
    missions: [
      {
        title: 'ChemAdapt : plateforme d’adaptation climatique pour France Chimie',
        details:
          'Lead tech. Évalue l’exposition de chaque site chimique français à la sécheresse et aux inondations selon sa localisation, avec les données Météo-France et du World Resources Institute, et propose des mesures parmi 650 actions d’adaptation. Conçue pour les 4 000 sites du secteur, testée sur une cinquantaine de sites pilotes, et lauréate des European Responsible Care Awards 2025.',
      },
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
    highlights: [
      'Lead tech sur ChemAdapt, la plateforme d’adaptation climatique de France Chimie pour 4 000 sites chimiques français, lauréate des European Responsible Care Awards 2025.',
      'Référent GenAI chez Axionable.',
      'Encadrement d’un stagiaire de fin d’études.',
    ],
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

const skillGroups = [
  {
    name: 'Inférence & serving LLM',
    evidence:
      'Chez BNP Paribas : optimisation du serving vLLM et benchmarks de modèles sur une plateforme utilisée par des centaines de milliers de personnes.',
  },
  {
    name: 'Ingénierie agentique',
    evidence: 'Chez Carrefour : tech lead du programme d’AI enablement qui fait entrer les agents de code dans les équipes de développement.',
  },
  {
    name: 'Plateforme & Ops',
    evidence: 'GitOps avec ArgoCD sur Kubernetes chez BNP Paribas ; Docker et Kubernetes sur cloud privé chez Thales.',
  },
  {
    name: 'Data & ML',
    evidence:
      'Chez Axionable : pipelines de risque climatique pour l’assurance et un gestionnaire d’actifs (Xarray, GeoPandas, Spark sur GCP).',
  },
  {
    name: 'IA de confiance',
    evidence: 'Chez Axionable : mise en conformité AI Act et accompagnement à la certification LNE pour des clients.',
  },
];

const projects: Record<string, { name?: string; description: string; details?: string[]; linkLabel?: string }> = {
  'Talk with me': {
    description: 'Le chatbot de ce site : posez-lui vos questions sur mon parcours, en français ou en anglais.',
    details: [
      'Il répond uniquement à partir de mon CV, généré depuis le même fichier de données que cette page : jamais obsolète.',
      'Un Cloudflare Worker garde la clé d’API hors du navigateur et diffuse les réponses de modèles gratuits OpenRouter.',
    ],
  },
  'Pollen Forecast': {
    description: 'Prévision du pollen heure par heure sur 4 jours, partout en Europe, à partir des données Copernicus CAMS.',
    details: [
      'Six allergènes, chacun avec ses propres seuils de risque, une vue sur 4 jours et un graphique horaire.',
      'Réécrite d’une app Python / Streamlit en PWA Svelte statique : toute l’Europe au lieu de la France, sans serveur, hébergement à 0 €.',
      'Installable, utilisable hors ligne, en français et en anglais.',
    ],
    linkLabel: 'Ouvrir l’application',
  },
  'Home media server': {
    name: 'Serveur multimédia maison',
    description: 'Mon serveur multimédia sur Raspberry Pi 4 : il télécharge films et séries et les diffuse sur la télé.',
    details: [
      'Plex et Transmission sous Docker, installés de zéro avec quelques commandes make.',
      'Réglé selon les limites du Pi : lecture directe uniquement, pas de transcodage, et le ventilateur démarre au-delà de 55 °C.',
    ],
    linkLabel: 'Voir le code',
  },
  'Smart IoT weather station': {
    name: 'Station météo IoT connectée',
    description: 'Station de température et d’humidité réalisée pour un cours d’IoT à l’ÉTS Montréal, avec des relevés envoyés sur AWS.',
  },
  'Bike sharing visualization & prediction': {
    name: 'Vélos en libre-service : visualisation et prédiction',
    description: 'Cartes et prévisions de l’usage des vélos BIXI à Montréal, réalisées pour un cours de data mining à l’ÉTS.',
    details: [
      'Nettoyage des données ouvertes BIXI 2021, avec détection de stations mal géolocalisées.',
      'Prédiction des trajets selon la météo et le calendrier, et disponibilité des stations en temps réel via le flux GBFS.',
    ],
    linkLabel: 'Voir le code',
  },
  'Personal chatbot': {
    name: 'Chatbot personnel',
    description: 'Un générateur de texte qui écrit comme moi, entraîné sur mes conversations Messenger (cours de machine learning à l’INSA, en équipe de trois).',
    details: [
      'Conversion de l’export de données Facebook en courtes conversations d’entraînement.',
      'Fine-tuning d’un GPT-2 français avec Hugging Face Transformers.',
    ],
    linkLabel: 'Voir le code',
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
  skills: en.skills.map((g, i) => ({ ...g, ...skillGroups[i] })),
  projects: en.projects.map((p) => {
    const fr = projects[p.name];
    if (!fr) return p;
    return {
      ...p,
      name: fr.name ?? p.name,
      description: fr.description,
      details: fr.details ?? p.details,
      link: p.link && { ...p.link, label: fr.linkLabel ?? p.link.label },
    };
  }),
};
