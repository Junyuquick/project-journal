import { describe, expect, it } from 'vitest';
import { constellation } from './constellation';

describe('constellation', () => {
  it('places one star per chapter, inside the sky', () => {
    for (const n of [1, 5, 8, 14, 23]) {
      const { points, height } = constellation(n);
      expect(points).toHaveLength(n);
      for (const p of points) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(1000);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(height);
      }
    }
  });

  it('snakes: the second row runs back the other way', () => {
    const { points } = constellation(10);
    expect(points[4].x).toBeGreaterThan(points[0].x);
    expect(points[5].x).toBeGreaterThan(points[9].x);
  });

  it('draws the same sky every time and keeps stars apart', () => {
    expect(constellation(14)).toEqual(constellation(14));
    const { points } = constellation(14);
    for (let i = 1; i < points.length; i++) expect(Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)).toBeGreaterThan(40);
  });

  it('has no height for an empty journal', () => {
    expect(constellation(0)).toEqual({ points: [], height: 0 });
  });
});
