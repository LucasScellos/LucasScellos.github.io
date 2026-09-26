// English / French. The inline script in index.html picks the language before first paint
// (saved choice, else the browser's preferred language) and writes it to <html lang>.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { profile as profileEn, type Profile } from './data/profile';
import { profileFr } from './data/profile.fr';
import { buildChapters, type Chapter } from './data/chapters';

export type Lang = 'en' | 'fr';

const first = profileEn.name.split(' ')[0];

const en = {
  skipToContent: 'Skip to content',
  nav: { work: 'Chapters', skills: 'Skills', projects: 'Projects', contact: 'Contact' },
  navLabel: 'Sections',
  backToTop: `${profileEn.name}, back to top`,
  toLight: 'Switch to light theme',
  toDark: 'Switch to dark theme',
  switchLang: 'Passer en français',
  talkWithMe: 'Talk with me',
  downloadCv: 'Download CV',
  scrollCueLabel: 'Scroll to about',
  scrollCue: 'Scroll to travel',
  about: 'About',
  kind: { work: 'Work', education: 'Education' },
  now: 'Now',
  via: 'via',
  openChapter: 'Open chapter',
  chapters: 'Chapters',
  chaptersSub: 'Where I work now, back to where it all started.',
  tunnelHint: 'Scroll to fly through my career · open any chapter',
  jumpToChapter: 'Jump to a chapter',
  closeChapter: 'Close chapter',
  highlights: 'Highlights',
  tags: 'Tags',
  otherChapters: 'Other chapters',
  newer: 'Newer',
  older: 'Older',
  selectedMissions: 'Selected missions',
  exchange: 'Exchange',
  exchangeNote: (school: string, period: string) => `+ ${school} exchange, ${period}`,
  skills: 'Skills',
  skillsTitle: ['What I work with, ', 'and where I’ve used it.'],
  inPractice: 'In practice',
  ongoing: 'Ongoing',
  sideProjects: 'Side projects',
  projectsTitle: ['Things I build ', 'for the fun of it.'],
  letsTalk: 'Let’s talk.',
  cvPdf: 'CV (PDF)',
  chat: {
    greeting: `Hi! I'm ${first}'s assistant. Ask me anything about his experience, skills or projects — in English or French.`,
    suggestions: [
      'What is he working on now?',
      'Tell me about his LLM inference work',
      'Why hire him for an AI platform?',
      'Quelles sont ses compétences ?',
    ],
    unavailable: 'The assistant is unavailable right now.',
    upstreamError: 'The assistant hit an error. Please try again.',
    tooLong: 'The assistant is taking too long — please try again.',
    genericError: 'Something went wrong.',
    title: `Talk with ${first}`,
    subtitle: 'AI assistant · answers from his profile',
    newChat: 'New chat',
    close: 'Close chat',
    typing: 'Assistant is typing',
    emailInstead: `Email ${first} instead`,
    inputLabel: 'Your question',
    placeholder: `Ask about ${first}…`,
    send: 'Send',
    disclaimer: 'AI-generated answers can be wrong — check the CV for details.',
  },
};

export type Strings = typeof en;

const fr: Strings = {
  skipToContent: 'Aller au contenu',
  nav: { work: 'Parcours', skills: 'Compétences', projects: 'Projets', contact: 'Contact' },
  navLabel: 'Sections',
  backToTop: `${profileEn.name}, retour en haut`,
  toLight: 'Passer au thème clair',
  toDark: 'Passer au thème sombre',
  switchLang: 'Switch to English',
  talkWithMe: 'Discuter avec moi',
  downloadCv: 'Télécharger le CV',
  scrollCueLabel: 'Défiler vers la présentation',
  scrollCue: 'Défilez pour voyager',
  about: 'À propos',
  kind: { work: 'Expérience', education: 'Formation' },
  now: 'Actuel',
  via: 'via',
  openChapter: 'Ouvrir le chapitre',
  chapters: 'Parcours',
  chaptersSub: 'De mon poste actuel jusqu’à mes débuts.',
  tunnelHint: 'Défilez pour traverser mon parcours · ouvrez un chapitre',
  jumpToChapter: 'Aller à un chapitre',
  closeChapter: 'Fermer le chapitre',
  highlights: 'Points clés',
  tags: 'Tags',
  otherChapters: 'Autres chapitres',
  newer: 'Plus récent',
  older: 'Plus ancien',
  selectedMissions: 'Missions choisies',
  exchange: 'Échange',
  exchangeNote: (school, period) => `+ échange à ${school}, ${period}`,
  skills: 'Compétences',
  skillsTitle: ['Mes outils, ', 'et où je m’en suis servi.'],
  inPractice: 'En pratique',
  ongoing: 'En cours',
  sideProjects: 'Projets perso',
  projectsTitle: ['Ce que je construis ', 'pour le plaisir.'],
  letsTalk: 'Parlons-en.',
  cvPdf: 'CV (PDF, en anglais)',
  chat: {
    greeting: `Bonjour ! Je suis l’assistant de ${first}. Posez-moi vos questions sur son expérience, ses compétences ou ses projets — en français ou en anglais.`,
    suggestions: [
      'Sur quoi travaille-t-il en ce moment ?',
      'Parle-moi de son travail sur l’inférence LLM',
      'Pourquoi le recruter pour une plateforme IA ?',
      'What are his skills?',
    ],
    unavailable: 'L’assistant est indisponible pour le moment.',
    upstreamError: 'L’assistant a rencontré une erreur. Réessayez.',
    tooLong: 'L’assistant met trop de temps à répondre — réessayez.',
    genericError: 'Une erreur est survenue.',
    title: `Discuter avec ${first}`,
    subtitle: 'Assistant IA · répond à partir de son profil',
    newChat: 'Nouvelle discussion',
    close: 'Fermer la discussion',
    typing: 'L’assistant écrit',
    emailInstead: `Écrire à ${first} par e-mail`,
    inputLabel: 'Votre question',
    placeholder: `Une question sur ${first} ?`,
    send: 'Envoyer',
    disclaimer: 'Les réponses générées par IA peuvent être fausses — consultez le CV pour les détails.',
  },
};

export const STRINGS: Record<Lang, Strings> = { en, fr };
const PROFILES: Record<Lang, Profile> = { en: profileEn, fr: profileFr };

interface I18n {
  lang: Lang;
  toggleLang: () => void;
  t: Strings;
  profile: Profile;
  chapters: Chapter[];
}

const readLang = (): Lang => (document.documentElement.lang === 'fr' ? 'fr' : 'en');

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18n>(() => {
    const t = STRINGS[lang];
    const profile = PROFILES[lang];
    return {
      lang,
      t,
      profile,
      chapters: buildChapters(profile, t),
      toggleLang: () =>
        setLang((l) => {
          const next = l === 'fr' ? 'en' : 'fr';
          try {
            localStorage.setItem('lang', next);
          } catch {
            /* storage unavailable */
          }
          return next;
        }),
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
