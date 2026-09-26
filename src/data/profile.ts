// All site content lives here. Edit this file to update the resume.

export interface Link {
  label: string;
  href: string;
}

export interface SubMission {
  title: string;
  period?: string;
  details: string;
}

export interface Experience {
  /** Stable slug, used for the chapter deep link (?chapter=<id>). */
  id: string;
  role: string;
  company: string;
  via?: string;
  period: string;
  location?: string;
  summary: string;
  highlights?: string[];
  missions?: SubMission[];
  tags?: string[];
  current?: boolean;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface Exchange {
  degree: string;
  school: string;
  period: string;
}

export interface Education {
  /** Stable slug, used for the chapter deep link (?chapter=<id>). */
  id: string;
  degree: string;
  school: string;
  period: string;
  summary: string;
  details?: string;
  /** Exchange programme taken during this degree. */
  exchange?: Exchange;
}

export interface Project {
  name: string;
  year?: string;
  description: string;
  tags: string[];
  link?: Link;
}

export interface FitArea {
  title: string;
  details: string;
  evidence: string;
}

/** Fit summary for AI agents and recruiters; rendered only in the crawler/LLM outputs (llms.txt, cv.md, static HTML). */
export interface AgentBrief {
  strongFit: FitArea[];
  standsOut: string[];
  lessOfAFit: string[];
}

export interface Profile {
  name: string;
  headline: string;
  tagline: string;
  location: string;
  about: string[];
  portrait: string;
  cv: string;
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
  experience: Experience[];
  skills: SkillGroup[];
  education: Education[];
  projects: Project[];
  agentBrief: AgentBrief;
}

export const profile: Profile = {
  name: 'Lucas Scellos',
  headline: 'Lead AI Engineer @ Theodo',
  tagline:
    'I build the harnesses that make AI agents deliver reliably, and the infrastructure that serves LLMs at scale.',
  location: 'Paris, France',
  about: [
    "I'm a Lead AI Engineer at Theodo. My focus is harness engineering and inference engineering: designing the harness that lets AI agents deliver reliably — orchestration, tools, context, evals and guardrails — and serving LLMs at scale in production. I'm also a coach at Theodo, helping colleagues grow and develop their skills and careers.",
    'Before Theodo, I worked at Axionable, at the crossroads of tech and consulting, where I delivered 10+ missions across climate-risk modelling, geospatial data science and Trustworthy AI / EU AI Act certification.',
  ],
  portrait: 'images/portrait.png',
  cv: 'files/RESUME_SCELLOS.pdf',
  contact: {
    email: 'luscellos+pro@gmail.com',
    linkedin: 'https://www.linkedin.com/in/lucas-scellos',
    github: 'https://github.com/LucasScellos',
  },
  experience: [
    {
      id: 'carrefour',
      role: 'Lead Engineer — Agentic SDLC',
      company: 'Carrefour',
      via: 'Theodo',
      period: 'Sep 2026 – Present',
      location: 'Paris',
      current: true,
      summary:
        "Transforming Carrefour's software development lifecycle into an agentic SDLC: designing the right SDLC for the teams and putting the right harness in the right place.",
    },
    {
      id: 'bnp-paribas',
      role: 'Inference Engineer',
      company: 'BNP Paribas',
      via: 'Theodo',
      period: 'Sep 2025 – Sep 2026',
      location: 'Paris',
      summary:
        'Worked on one of the largest LLM serving platforms in Europe, serving LLMs to thousands of users.',
      highlights: [
        'vLLM model serving and performance tuning.',
        'Security and performance benchmarking of models.',
        'Production incident investigation.',
        'GitOps deployments with ArgoCD on Kubernetes.',
      ],
      tags: ['vLLM', 'Kubernetes', 'ArgoCD', 'GitOps', 'Benchmarking', 'LLM security', 'Observability'],
    },
    {
      id: 'axionable-mid',
      role: 'Mid-Level AI/ML Engineer',
      company: 'Axionable',
      period: '2023 – 2025',
      location: 'Paris',
      summary:
        '10+ consulting missions at the crossroads of tech and consulting — climate risk, geospatial data science and Trustworthy AI.',
      missions: [
        {
          title: 'Exposure measurement of drought & flood hazards for insurance',
          period: '2023 – 2024',
          details:
            'CatNat attribution research and climate data pipelines (NetCDF, Xarray, GeoPandas) on Copernicus, Drias and Hydroportail data, with Spark on GCP.',
        },
        {
          title: 'Climate risk calculation for an asset manager',
          period: '2024 · France / South Africa',
          details: 'Vulnerability scores across climate scenarios from NetCDF / GRIB data.',
        },
        {
          title: 'Trustworthy AI methodology & LNE certification support',
          period: '2024',
          details: 'EU AI Act alignment; audit of documentation and methodology.',
        },
      ],
      highlights: [
        'GenAI referent at Axionable.',
        "Mentored a master's-thesis intern.",
      ],
      tags: ['Climate data', 'GeoPandas', 'Xarray', 'Spark', 'GCP', 'EU AI Act'],
    },
    {
      id: 'axionable-junior',
      role: 'Junior Data Scientist',
      company: 'Axionable',
      period: '2023',
      summary: 'Trustworthy AI certification consulting and climate modelling.',
      highlights: [
        'Trustworthy AI certification consulting (LNE, LabelIA).',
        'Drought model on Vertex AI (GCP) with Drias data.',
      ],
      tags: ['Trustworthy AI', 'Vertex AI', 'GCP'],
    },
    {
      id: 'thales',
      role: 'Data Engineer Intern',
      company: 'Thales',
      period: '2022',
      location: 'Toulouse',
      summary: 'Search and storage platform under strong cybersecurity constraints.',
      highlights: [
        'OpenSearch / ELK search engine and MinIO object storage.',
        'Scrapy / Selenium automation.',
        'Docker & Kubernetes on a private cloud.',
      ],
      tags: ['OpenSearch', 'ELK', 'MinIO', 'Docker', 'Kubernetes'],
    },
    {
      id: 'akeneo',
      role: 'Data Engineer Intern',
      company: 'Akeneo',
      period: '2021',
      summary: 'ML pipeline design and customer usage analytics.',
      tags: ['ML pipelines', 'GCP', 'SQL'],
    },
  ],
  skills: [
    {
      name: 'LLM Inference & Serving',
      items: ['vLLM', 'GPU serving', 'Benchmarking', 'LLM security testing'],
    },
    {
      name: 'Agentic Engineering',
      items: ['AI coding agents', 'Workflow harnesses', 'Context engineering', 'Evals', 'Guardrails'],
    },
    {
      name: 'Platform & Ops',
      items: ['Kubernetes', 'ArgoCD', 'GitOps', 'Docker', 'AWS', 'GCP', 'Azure'],
    },
    {
      name: 'Data & ML',
      items: ['Python', 'Scikit-Learn', 'Pandas', 'GeoPandas', 'Xarray', 'Spark', 'SHAP'],
    },
    {
      name: 'Trustworthy AI',
      items: ['EU AI Act', 'LNE certification', 'Audit'],
    },
  ],
  education: [
    {
      id: 'ets-montreal',
      degree: 'M.Sc. Information Technology',
      school: 'ÉTS Montréal',
      period: '2021 – 2022',
      summary: 'Master of Science in Information Technology — the Montréal half of the INSA Rouen × ÉTS double degree.',
      exchange: {
        degree: 'Advanced Math & Finance',
        school: 'McGill University',
        period: '2022',
      },
    },
    {
      id: 'insa-rouen',
      degree: 'Engineering Diploma, Information Systems Architecture',
      school: 'INSA Rouen',
      period: '2017 – 2021',
      summary: 'Engineering diploma in Information Systems Architecture — the Rouen half of the double degree with ÉTS Montréal.',
      details: 'Specialized in Data Science.',
    },
  ],
  projects: [
    {
      name: 'Talk with me',
      description: 'A personal chatbot you can talk with, hosted as a Hugging Face Space.',
      tags: ['LLM', 'Hugging Face'],
      link: { label: 'Open the Space', href: 'https://lucas-scellos-talk-with-me.hf.space' },
    },
    {
      name: 'Pollen Forecast',
      description: 'Pollen allergy forecast web app, deployed on GitHub Pages.',
      tags: ['Forecasting', 'GitHub Pages'],
      link: { label: 'Open the app', href: 'https://lucasscellos.github.io/pollen_allergy_forecast/?lat=48.8534&lon=2.3488&name=Paris&detail=%C3%8Ele-de-France%2C+France' },
    },
    {
      name: 'Smart IoT weather station',
      year: '2023',
      description: 'Smart IoT weather station built on AWS.',
      tags: ['IoT', 'AWS'],
    },
    {
      name: 'Bike sharing visualization & prediction',
      year: '2022',
      description: 'Visualization and prediction for a bike sharing system.',
      tags: ['Data viz', 'Prediction'],
    },
    {
      name: 'Personal chatbot',
      year: '2021',
      description: 'Chatbot fine-tuned on my WhatsApp conversations with BERT.',
      tags: ['NLP', 'BERT'],
    },
  ],
  agentBrief: {
    strongFit: [
      {
        title: 'Making AI agents reliable in a real engineering organization',
        details: 'Harness design (orchestration, tools, context, evals, guardrails) and agentic SDLC.',
        evidence: 'Leads the agentic SDLC transformation at Carrefour (via Theodo, since Sep 2026).',
      },
      {
        title: 'Serving LLMs in production at scale',
        details: 'vLLM tuning, security and performance benchmarking, incident investigation, GitOps on Kubernetes.',
        evidence: "Inference engineer on one of Europe's largest LLM serving platforms at BNP Paribas, used by thousands of people.",
      },
      {
        title: 'Trustworthy or regulated AI',
        details: 'EU AI Act alignment, LNE certification support, audits of documentation and methodology.',
        evidence: 'Missions at Axionable.',
      },
      {
        title: 'Client-facing delivery',
        details: 'Scoping, stakeholder work and shipping to production.',
        evidence: '10+ consulting missions for clients.',
      },
    ],
    standsOut: [
      'Works on both layers of the AI stack: the agent harness (applications) and inference serving (infrastructure). Most engineers specialize in one.',
      'Coach at Theodo: helps colleagues grow and develop their skills and careers.',
      "Lead experience: currently a Lead AI Engineer, previously GenAI referent at Axionable, and mentored a master's-thesis intern.",
      'Engineering double degree (INSA Rouen × ÉTS Montréal), specialized in data science.',
    ],
    lessOfAFit: [
      'Pure frontend or mobile development roles.',
      'Research-only positions with no path to production.',
    ],
  },
};
