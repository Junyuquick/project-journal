// Where each star of a journal sits in its constellation: a gentle snake across the sky, so any number
// of chapters makes a path that wanders instead of running in a straight line.
export interface StarPoint { x: number; y: number }

const MARGIN = 70;
const TOP = 70;

export function constellation(count: number, width = 1000, perRow = 5, rowGap = 150): { points: StarPoint[]; height: number } {
  const span = width - 2 * MARGIN;
  const points = Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const along = row % 2 === 0 ? col : perRow - 1 - col; // odd rows run back the other way
    // fixed wobble, so the same journal always draws the same sky
    const x = MARGIN + (along / (perRow - 1)) * span + Math.sin(i * 1.7 + 1) * 24;
    const y = TOP + row * rowGap + Math.sin(i * 2.3) * 30;
    return { x: Math.round(x), y: Math.round(y) };
  });
  const rows = Math.ceil(count / perRow);
  return { points, height: count === 0 ? 0 : TOP * 2 + (rows - 1) * rowGap };
}
