// Loads projects with their ordered chapters and timeline, for the pages.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { chapterSlug, sortChapters } from './content';

export type Chapter = CollectionEntry<'chapters'> & { slug: string };
export interface Project {
  slug: string;
  data: CollectionEntry<'projects'>['data'];
  chapters: Chapter[];
  events: CollectionEntry<'timelines'>['data']['events'];
}

export async function loadProjects(): Promise<Project[]> {
  const [projects, chapters] = await Promise.all([getCollection('projects'), getCollection('chapters')]);
  const result: Project[] = [];
  for (const p of projects) {
    const own = sortChapters(chapters.filter((c) => c.id.startsWith(`${p.id}/`))).map((c) => ({ ...c, slug: chapterSlug(c.id) }));
    const timeline = await getEntry('timelines', p.id);
    result.push({ slug: p.id, data: p.data, chapters: own, events: timeline?.data.events ?? [] });
  }
  return result.sort((a, b) => a.data.startedAt.localeCompare(b.data.startedAt));
}

export const inkOn = (ink: 'dark' | 'light') => (ink === 'dark' ? '#16181b' : '#ffffff');

const dateFmt = new Intl.DateTimeFormat('en-SG', { timeZone: 'Asia/Singapore', day: 'numeric', month: 'short', year: 'numeric' });
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));
