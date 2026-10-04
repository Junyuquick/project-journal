// MRT-map geometry: every segment is horizontal, vertical or exactly 45 degrees.
export interface Pt { x: number; y: number }
export interface Station extends Pt { id: string; label: string; note?: string; labelAt?: 'n' | 's' | 'e' | 'w' }

/** Diagonal first, then straight: the classic schematic-map bend. */
export function octilinear(a: Pt, b: Pt): Pt[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.min(Math.abs(dx), Math.abs(dy));
  if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) return [a, b];
  const bend = { x: a.x + Math.sign(dx) * d, y: a.y + Math.sign(dy) * d };
  return [a, bend, b];
}

export function isOctilinear(points: Pt[]): boolean {
  return points.slice(1).every((p, i) => {
    const dx = Math.abs(p.x - points[i].x);
    const dy = Math.abs(p.y - points[i].y);
    return dx === 0 || dy === 0 || dx === dy;
  });
}

export function linePoints(ids: string[], stations: Station[]): Pt[] {
  const at = (id: string) => {
    const s = stations.find((st) => st.id === id);
    if (!s) throw new Error(`Unknown station: ${id}`);
    return { x: s.x, y: s.y };
  };
  const pts: Pt[] = [at(ids[0])];
  for (let i = 1; i < ids.length; i++) pts.push(...octilinear(pts.at(-1)!, at(ids[i])).slice(1));
  return pts;
}

export function interchanges(lines: { stations: string[] }[]): Set<string> {
  const seen = new Map<string, number>();
  for (const l of lines) for (const s of new Set(l.stations)) seen.set(s, (seen.get(s) ?? 0) + 1);
  return new Set([...seen].filter(([, n]) => n > 1).map(([id]) => id));
}

export const toPath = (pts: Pt[], unit: number, pad: number) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${p.x * unit + pad} ${p.y * unit + pad}`).join(' ');
