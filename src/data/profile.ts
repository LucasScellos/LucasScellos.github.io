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
  /** Shows the first highlights right on the chapter card, not only in the dialog. */
  featured?: boolean;
}

export interface SkillGroup {
  name: string;
  items: string[];
  /** Where these skills were put into practice, in one sentence. */
  evidence: string;
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
  /** Concrete points: what it does, how it's built, what came out of it. */
  details?: string[];
  tags: string[];
  link?: Link;
  /** The card opens the site's own chat instead of following a link. */
  opensChat?: boolean;
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
      featured: true,
      summary:
        "Tech lead on the AI-enablement programme bringing AI agents into Carrefour's software teams, within a team of about ten.",
      highlights: [
        "Assessing the AI readiness of Carrefour's existing teams.",
        'Setting the security and governance framework for coding agents.',
        'Building the team runbook, metrics and training paths, then choosing the first pilot teams.',
      ],
      tags: ['AI enablement', 'Agentic SDLC', 'Coding agents', 'AI governance', 'Change management'],
    },
    {
      id: 'bnp-paribas',
      role: 'AI / Inference Engineer',
      company: 'BNP Paribas',
      via: 'Theodo',
      period: 'Sep 2025 – Sep 2026',
      location: 'Paris',
      featured: true,
      summary:
        "AI engineer in the ops team of one of Europe's largest LLM serving platforms, used by hundreds of thousands of people.",
      highlights: [
        "Helped double the platform's user capacity since I joined, while raising several serving limits.",
        "Served Mistral's models, working directly with their team, alongside open-weight models: Qwen, Kimi, GLM, Muse Glimmer and Gemma.",
        'vLLM tuning, plus security and performance benchmarking of new models.',
        'Production incident investigation and GitOps deployments with ArgoCD on Kubernetes.',
      ],
      tags: ['vLLM', 'Mistral', 'Open-weight models', 'Kubernetes', 'ArgoCD', 'GitOps', 'Benchmarking', 'LLM security'],
    },
    {
      id: 'axionable-mid',
      role: 'Mid-Level AI/ML Engineer',
      company: 'Axionable',
      period: '2023 – 2025',
      location: 'Paris',
      featured: true,
      summary:
        'Where I learned my trade, doing tech and consulting together: 10+ missions for large groups and small organisations alike, in climate risk, geospatial data science and Trustworthy AI.',
      missions: [
        {
          title: 'ChemAdapt: climate adaptation platform for France Chimie',
          details:
            "Tech lead. Rates each French chemical site's exposure to drought and flood from its location, with Météo-France and World Resources Institute data, and suggests measures among 650 adaptation actions. Built for the industry's 4,000 sites, tested on about fifty pilots, and a winner at the European Responsible Care Awards 2025.",
        },
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
        'Tech lead on ChemAdapt, France Chimie’s climate-adaptation platform for 4,000 French chemical sites, winner at the European Responsible Care Awards 2025.',
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
      evidence: 'At BNP Paribas: tuned vLLM serving and benchmarked models on a platform used by hundreds of thousands of people.',
    },
    {
      name: 'Agentic Engineering',
      items: ['AI coding agents', 'Workflow harnesses', 'Context engineering', 'Evals', 'Guardrails'],
      evidence: 'At Carrefour: tech lead on the AI-enablement programme bringing coding agents into the software teams.',
    },
    {
      name: 'Platform & Ops',
      items: ['Kubernetes', 'ArgoCD', 'GitOps', 'Docker', 'AWS', 'GCP', 'Azure'],
      evidence: 'GitOps with ArgoCD on Kubernetes at BNP Paribas; Docker and Kubernetes on a private cloud at Thales.',
    },
    {
      name: 'Data & ML',
      items: ['Python', 'Scikit-Learn', 'Pandas', 'GeoPandas', 'Xarray', 'Spark', 'SHAP'],
      evidence: 'At Axionable: climate-risk pipelines for insurance and an asset manager (Xarray, GeoPandas, Spark on GCP).',
    },
    {
      name: 'Trustworthy AI',
      items: ['EU AI Act', 'LNE certification', 'Audit'],
      evidence: 'At Axionable: EU AI Act alignment and LNE certification support for clients.',
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
      description: 'The chatbot on this site: ask it about my career, in English or French.',
      details: [
        'Answers only from my resume, built from the same data file as this page, so it never goes stale.',
        'A Cloudflare Worker keeps the API key out of the browser and streams replies from free OpenRouter models.',
      ],
      tags: ['LLM', 'Cloudflare Workers', 'OpenRouter'],
      opensChat: true,
    },
    {
      name: 'Pollen Forecast',
      description: '4-day, hourly pollen forecast for anywhere in Europe, built on Copernicus CAMS data.',
      details: [
        'Six allergens, each with its own risk thresholds, a 4-day outlook and an hourly chart.',
        'Rewritten from a Python / Streamlit app into a static Svelte PWA: all of Europe instead of France, no server, €0 hosting.',
        'Installable, works offline, in French and English.',
      ],
      tags: ['Svelte', 'TypeScript', 'Copernicus', 'PWA'],
      link: { label: 'Open the app', href: 'https://lucasscellos.github.io/pollen_allergy_forecast/?lat=48.8534&lon=2.3488&name=Paris&detail=%C3%8Ele-de-France%2C+France' },
    },
    {
      name: 'Home media server',
      description: 'My media server on a Raspberry Pi 4: it downloads movies and series and streams them to the TV.',
      details: [
        'Plex and Transmission in Docker, set up from scratch with a handful of make commands.',
        'Tuned to the Pi’s limits: direct play only, no transcoding, and the fan kicks in above 55 °C.',
      ],
      tags: ['Raspberry Pi', 'Docker', 'Plex', 'Self-hosting'],
      link: { label: 'View the code', href: 'https://github.com/LucasScellos/mediaserver' },
    },
    {
      name: 'Smart IoT weather station',
      year: '2022',
      description: 'Temperature and humidity station built for an IoT course at ÉTS Montréal, with its readings sent to AWS.',
      tags: ['IoT', 'Python', 'AWS'],
    },
    {
      name: 'Bike sharing visualization & prediction',
      year: '2022',
      description: 'Maps and forecasts of BIXI bike-share usage in Montréal, built for a data-mining course at ÉTS.',
      details: [
        'Cleaned the 2021 BIXI open data and caught stations with wrong coordinates.',
        'Predicted trips from weather and calendar, and read live station availability from the GBFS feed.',
      ],
      tags: ['Python', 'Open data', 'Prediction', 'Data viz'],
      link: { label: 'View the code', href: 'https://github.com/LucasScellos/bixi-visualization' },
    },
    {
      name: 'Personal chatbot',
      year: '2021',
      description: 'A text generator that writes like me, trained on my Messenger conversations (INSA machine-learning course, team of three).',
      details: [
        'Parsed the Facebook data export into short conversations for training.',
        'Fine-tuned a French GPT-2 with Hugging Face Transformers.',
      ],
      tags: ['NLP', 'GPT-2', 'Transformers'],
      link: { label: 'View the code', href: 'https://github.com/LucasScellos/transformersMessenger' },
    },
  ],
  agentBrief: {
    strongFit: [
      {
        title: 'Making AI agents reliable in a real engineering organization',
        details: 'Harness design (orchestration, tools, context, evals, guardrails) and agentic SDLC.',
        evidence: 'Tech lead on the AI-enablement programme at Carrefour (via Theodo, since Sep 2026).',
      },
      {
        title: 'Serving LLMs in production at scale',
        details: 'vLLM tuning, security and performance benchmarking, incident investigation, GitOps on Kubernetes.',
        evidence: "AI engineer on one of Europe's largest LLM serving platforms at BNP Paribas, used by hundreds of thousands of people; helped double its user capacity.",
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
      'Tech lead on ChemAdapt, France Chimie’s climate-adaptation platform for 4,000 chemical sites, a winner at the European Responsible Care Awards 2025.',
      "Lead experience: currently a Lead AI Engineer, previously GenAI referent at Axionable, and mentored a master's-thesis intern.",
      'Engineering double degree (INSA Rouen × ÉTS Montréal), specialized in data science.',
    ],
    lessOfAFit: [
      'Pure frontend or mobile development roles.',
      'Research-only positions with no path to production.',
    ],
  },
};
