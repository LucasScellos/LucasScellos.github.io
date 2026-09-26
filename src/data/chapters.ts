// Experience and education, flattened into one newest → oldest list of "chapters".
import { profile } from './profile';

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
  highlights?: string[];
  items?: { label: string; list: ChapterItem[] };
  tags?: string[];
}

export const chapters: Chapter[] = [
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
    highlights: e.highlights,
    items: e.missions?.length ? { label: 'Selected missions', list: e.missions } : undefined,
    tags: e.tags,
  })),
  ...profile.education.map<Chapter>((e) => ({
    id: e.id,
    kind: 'education',
    period: e.period,
    title: e.degree,
    org: e.school,
    summary: e.summary,
    note: e.exchange ? `+ ${e.exchange.school} exchange, ${e.exchange.period}` : undefined,
    highlights: e.details ? [e.details] : undefined,
    items: e.exchange
      ? {
          label: 'Exchange',
          list: [{ title: `${e.exchange.degree} — ${e.exchange.school}`, period: e.exchange.period }],
        }
      : undefined,
  })),
];

export const kindLabel: Record<ChapterKind, string> = {
  work: 'Work',
  education: 'Education',
};
