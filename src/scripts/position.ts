// Remembers the last station read on each line, per browser.
const key = (slug: string) => `pj-pos-${slug}`;

export function savePosition(slug: string, station: number) {
  try { localStorage.setItem(key(slug), String(station)); } catch {}
}

export function readPosition(slug: string): number | null {
  try {
    const v = Number(localStorage.getItem(key(slug)));
    return Number.isInteger(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}
