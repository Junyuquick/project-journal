import { describe, expect, it } from 'vitest';
import { interchanges, isOctilinear, linePoints, octilinear } from './route';

const stations = [
  { id: 'browser', label: 'Browser', x: 0, y: 0 },
  { id: 'github', label: 'GitHub', x: 3, y: 0 },
  { id: 'robot', label: 'Robot', x: 5, y: 2 },
  { id: 'vodien', label: 'Vodien', x: 9, y: 3 },
];

describe('octilinear', () => {
  it('joins two points with straight, 45 degree and straight-again legs only', () => {
    const pts = octilinear({ x: 0, y: 0 }, { x: 4, y: 1 });
    expect(pts[0]).toEqual({ x: 0, y: 0 });
    expect(pts.at(-1)).toEqual({ x: 4, y: 1 });
    expect(isOctilinear(pts)).toBe(true);
  });
  it('needs no bend when already aligned', () => {
    expect(octilinear({ x: 0, y: 0 }, { x: 3, y: 0 })).toEqual([{ x: 0, y: 0 }, { x: 3, y: 0 }]);
    expect(octilinear({ x: 0, y: 0 }, { x: 2, y: 2 })).toEqual([{ x: 0, y: 0 }, { x: 2, y: 2 }]);
  });
});

describe('linePoints', () => {
  it('routes a whole line through its stations octilinearly', () => {
    const pts = linePoints(['browser', 'github', 'robot', 'vodien'], stations);
    expect(isOctilinear(pts)).toBe(true);
    for (const s of stations) expect(pts).toContainEqual({ x: s.x, y: s.y });
  });
  it('fails loudly on an unknown station id', () => {
    expect(() => linePoints(['browser', 'nowhere'], stations)).toThrow('Unknown station: nowhere');
  });
});

describe('isOctilinear', () => {
  it('rejects a slanted segment that is not 45 degrees', () => {
    expect(isOctilinear([{ x: 0, y: 0 }, { x: 3, y: 1 }])).toBe(false);
  });
});

describe('interchanges', () => {
  it('marks stations served by two or more lines', () => {
    expect([...interchanges([{ stations: ['a', 'b'] }, { stations: ['b', 'c'] }])]).toEqual(['b']);
  });
});
