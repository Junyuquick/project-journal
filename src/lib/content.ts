// Pure helpers over project content, shared by pages and tests.
export const CONTRIBUTORS = ['claude', 'you', 'together', 'others'] as const;
export type Contributor = (typeof CONTRIBUTORS)[number];
export type Lane = Exclude<Contributor, 'together'>;

export interface TimelineEvent {
  at: string;
  who: string;
  with?: string[];
  title: string;
  why: string;
  how: string;
  evidence: string;
  source: { type: string; ref?: string; url?: string };
  chapter?: string;
}

const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/;

/** The lines drawn on a project's timeline: Others only when the project has other collaborators. */
export function lanesFor(contributors: readonly string[]): Lane[] {
  return (['claude', 'you', 'others'] as const).filter((l) => contributors.includes(l));
}

export function validateTimeline(events: TimelineEvent[], contributors: readonly string[]): string[] {
  const errors: string[] = [];
  let previous = -Infinity;
  events.forEach((e, i) => {
    const at = `event ${i + 1} (${e.title})`;
    if (!(CONTRIBUTORS as readonly string[]).includes(e.who)) errors.push(`${at}: unknown contributor "${e.who}"`);
    if (e.who === 'others' && !contributors.includes('others')) errors.push(`${at}: others event on a project without others`);
    if (e.who === 'together') {
      const people = e.with ?? [];
      if (people.length < 2 || people.some((p) => !contributors.includes(p))) errors.push(`${at}: together needs two or more of ${contributors.join(', ')}`);
    }
    if (!ISO_WITH_OFFSET.test(e.at)) errors.push(`${at}: "${e.at}" is not an ISO time with offset`);
    const t = Date.parse(e.at);
    if (t < previous) errors.push(`${at}: out of order`);
    previous = Math.max(previous, t);
  });
  return errors;
}

interface Station { id: string; data: { station: number } }

export function sortChapters<T extends Station>(chapters: T[]): T[] {
  return [...chapters].sort((a, b) => a.data.station - b.data.station);
}

export function validateStations(chapters: Station[]): string[] {
  const numbers = sortChapters(chapters).map((c) => c.data.station);
  const errors: string[] = [];
  numbers.forEach((n, i) => {
    if (i > 0 && n === numbers[i - 1]) errors.push(`duplicate station ${n}`);
    else if (n !== i + 1 && !errors.length) errors.push(`gap: expected station ${i + 1}, found ${n}`);
  });
  return errors;
}

/** `loft-concept/10-the-publishing-robot` → `the-publishing-robot` */
export function chapterSlug(id: string): string {
  return id.split('/').pop()!.replace(/^\d+-/, '');
}

/** Station code shown on signs, e.g. LC10. */
export function stationCode(code: string, station: number): string {
  return `${code}${String(station).padStart(2, '0')}`;
}

const sgDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit' });

export function eventsByDay<T extends { at: string }>(events: T[]): { day: string; events: T[] }[] {
  const days: { day: string; events: T[] }[] = [];
  for (const e of events) {
    const day = sgDay.format(new Date(e.at));
    if (days.at(-1)?.day !== day) days.push({ day, events: [] });
    days.at(-1)!.events.push(e);
  }
  return days;
}

/** Where a timeline event came from, as a link into the project's repository when there is one. */
export function sourceLink(source: TimelineEvent['source'], repo: string | undefined): { href?: string; label: string } {
  const label = { commit: `Commit ${source.ref}`, spec: `Spec: ${source.ref}`, plan: `Plan: ${source.ref}`, conversation: 'Our conversation' }[source.type] ?? source.type;
  if (source.url) return { href: source.url, label };
  if (!repo || !source.ref) return { label };
  if (source.type === 'commit') return { href: `${repo}/commit/${source.ref}`, label };
  return { href: `${repo}/blob/main/${source.ref}`, label };
}

/** Index letter for a glossary term: ".htaccess" files under H, "301 redirect" under #. */
export function indexLetter(term: string): string {
  const first = term.replace(/^[^A-Za-z0-9]+/, '')[0] ?? '#';
  return /[A-Za-z]/.test(first) ? first.toUpperCase() : '#';
}

/** "A notice..." reads naturally after "Think of it as:" as "a notice...". */
export function asContinuation(sentence: string): string {
  return sentence.replace(/^(A|An|The) /, (w) => w.toLowerCase());
}
