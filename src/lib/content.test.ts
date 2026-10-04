import { describe, expect, it } from 'vitest';
import { chapterSlug, eventsByDay, lanesFor, sortChapters, sourceLink, validateStations, validateTimeline } from './content';

const ev = (at: string, who: string, extra: object = {}) => ({ at, who, title: 't', why: 'w', how: 'h', evidence: 'witnessed', source: { type: 'conversation' }, ...extra });

describe('lanesFor', () => {
  it('shows the Others line only for projects with other collaborators', () => {
    expect(lanesFor(['claude', 'you'])).toEqual(['claude', 'you']);
    expect(lanesFor(['claude', 'you', 'others'])).toEqual(['claude', 'you', 'others']);
  });
});

describe('validateTimeline', () => {
  const people = ['claude', 'you'];
  it('accepts a well-formed, ordered timeline', () => {
    expect(validateTimeline([ev('2026-10-04T19:33:00+08:00', 'you'), ev('2026-10-04T19:40:00+08:00', 'together', { with: ['claude', 'you'] })], people)).toEqual([]);
  });
  it('rejects an unknown contributor', () => {
    expect(validateTimeline([ev('2026-10-04T19:33:00+08:00', 'bob')], people).join()).toMatch(/unknown contributor "bob"/);
  });
  it('rejects a time without a timezone', () => {
    expect(validateTimeline([ev('2026-10-04T19:33:00', 'you')], people).join()).toMatch(/not an ISO time with offset/);
  });
  it('rejects events out of time order', () => {
    expect(validateTimeline([ev('2026-10-04T20:00:00+08:00', 'you'), ev('2026-10-04T19:00:00+08:00', 'claude')], people).join()).toMatch(/out of order/);
  });
  it('rejects Others events on a project without other collaborators', () => {
    expect(validateTimeline([ev('2026-10-04T19:33:00+08:00', 'others')], people).join()).toMatch(/others/);
  });
  it('requires a Together event to name at least two contributors', () => {
    expect(validateTimeline([ev('2026-10-04T19:33:00+08:00', 'together', { with: ['you'] })], people).join()).toMatch(/together/);
  });
});

describe('stations', () => {
  const ch = (id: string, station: number) => ({ id, data: { station } });
  it('sorts chapters by station number', () => {
    expect(sortChapters([ch('a/b', 2), ch('a/a', 1)]).map((c) => c.id)).toEqual(['a/a', 'a/b']);
  });
  it('rejects gaps and duplicates', () => {
    expect(validateStations([ch('a/a', 1), ch('a/b', 3)]).join()).toMatch(/gap/);
    expect(validateStations([ch('a/a', 1), ch('a/b', 1)]).join()).toMatch(/duplicate/);
    expect(validateStations([ch('a/a', 1), ch('a/b', 2)])).toEqual([]);
  });
  it('derives the URL slug from the chapter id without its number prefix', () => {
    expect(chapterSlug('loft-concept/10-the-publishing-robot')).toBe('the-publishing-robot');
  });
});

describe('eventsByDay', () => {
  it('groups events by their Singapore date', () => {
    const days = eventsByDay([ev('2026-10-04T23:57:00+08:00', 'you'), ev('2026-10-05T00:08:00+08:00', 'claude')]);
    expect(days.map((d) => d.day)).toEqual(['2026-10-04', '2026-10-05']);
  });
});

describe('sourceLink', () => {
  it('links a commit to the project repo', () => {
    expect(sourceLink({ type: 'commit', ref: 'fe5b25a' }, 'https://github.com/a/b')).toEqual({ href: 'https://github.com/a/b/commit/fe5b25a', label: 'Commit fe5b25a' });
  });
  it('links a spec or plan file to its path in the repo', () => {
    expect(sourceLink({ type: 'spec', ref: 'docs/x.md' }, 'https://github.com/a/b')).toEqual({ href: 'https://github.com/a/b/blob/main/docs/x.md', label: 'Spec: docs/x.md' });
  });
  it('has no link for the conversation', () => {
    expect(sourceLink({ type: 'conversation' }, 'https://github.com/a/b')).toEqual({ label: 'Our conversation' });
  });
  it('prefers an explicit url', () => {
    expect(sourceLink({ type: 'commit', ref: 'x', url: 'https://e.com' }, undefined).href).toBe('https://e.com');
  });
});
