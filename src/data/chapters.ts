// Experience and education, flattened into one newest → oldest list of "chapters".
import { profile as profileEn, type Profile } from './profile';
import type { Strings } from '../i18n';

export type ChapterKind = 'work' | 'education';

export interface ChapterItem {
  title: string;
  period?: string;
  details?: string;
}

export interface Chapter {
  id: string;
  kind: ChapterKind;
  period: string;
  /** Role or degree. */
  title: string;
  /** Company or school. */
  org: string;
  via?: string;
  location?: string;
  summary: string;
  /** Short extra line shown on the card, e.g. an exchange semester. */
  note?: string;
  current?: boolean;
  featured?: boolean;
  highlights?: string[];
  items?: { label: string; list: ChapterItem[] };
  tags?: string[];
}

export const buildChapters = (profile: Profile, t: Strings): Chapter[] => [
  ...profile.experience.map<Chapter>((e) => ({
    id: e.id,
    kind: 'work',
    period: e.period,
    title: e.role,
    org: e.company,
    via: e.via,
    location: e.location,
    summary: e.summary,
    current: e.current,
    featured: e.featured,
    highlights: e.highlights,
    items: e.missions?.length ? { label: t.selectedMissions, list: e.missions } : undefined,
    tags: e.tags,
  })),
  ...profile.education.map<Chapter>((e) => ({
    id: e.id,
    kind: 'education',
    period: e.period,
    title: e.degree,
    org: e.school,
    summary: e.summary,
    note: e.exchange ? t.exchangeNote(e.exchange.school, e.exchange.period) : undefined,
    highlights: e.details ? [e.details] : undefined,
    items: e.exchange
      ? {
          label: t.exchange,
          list: [{ title: `${e.exchange.degree} — ${e.exchange.school}`, period: e.exchange.period }],
        }
      : undefined,
  })),
];

/** Chapter ids, newest → oldest; the same in every language. */
export const chapterIds = [...profileEn.experience, ...profileEn.education].map((e) => e.id);
