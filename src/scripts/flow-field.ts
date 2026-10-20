// The drifting ink lines behind every page: particles follow a slowly changing field and a fading
// fill leaves their trails. Colours come from the page's CSS variables so light and dark both work.
const canvas = document.querySelector<HTMLCanvasElement>('#flow-field');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const style = getComputedStyle(document.documentElement);
  let ground = '0 0 0', ink = '0 0 0', accent = '0 0 0';
  let width = 0;
  let height = 0;
  let t = 0;
  let mx = -1e4;
  let my = -1e4;
  let particles: { x: number; y: number; life: number }[] = [];

  const rgb = (name: string) => {
    const hex = style.getPropertyValue(name).trim().replace('#', '');
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');
  };
  const readColours = () => { ground = rgb('--ground'); ink = rgb('--ink'); accent = rgb('--flow-accent'); };
  const field = (x: number, y: number) =>
    (Math.sin(x * 0.0032 + t * 0.25) + Math.cos(y * 0.0041 - t * 0.2) + Math.sin((x + y) * 0.0021 + t * 0.15)) * 1.15;
  const clear = () => { ctx.fillStyle = `rgb(${ground})`; ctx.fillRect(0, 0, width, height); };

  const layout = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    readColours();
    clear();
    const count = Math.round(Math.min(220, (width * height) / 7000));
    particles = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, life: Math.random() * 300 }));
  };

  const step = () => {
    ctx.fillStyle = `rgb(${ground} / 0.09)`; // old strokes dissolve, new ones draw on top
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    for (const p of particles) {
      const angle = field(p.x, p.y);
      const px = p.x;
      const py = p.y;
      let vx = Math.cos(angle) * 1.5;
      let vy = Math.sin(angle) * 1.5;
      const dx = p.x - mx;
      const dy = p.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < 22000) { // lines bend away from the pointer
        const push = (1 - d2 / 22000) * 3;
        vx += (dx / Math.sqrt(d2 + 1)) * push;
        vy += (dy / Math.sqrt(d2 + 1)) * push;
      }
      p.x += vx;
      p.y += vy;
      p.life--;
      ctx.strokeStyle = p.life % 23 < 1 ? `rgb(${accent} / 0.5)` : `rgb(${ink} / 0.3)`;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      if (p.life < 0 || p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
        p.life = 200 + Math.random() * 300;
      }
    }
    t += 0.01;
  };

  const loop = () => { if (!document.hidden) step(); requestAnimationFrame(loop); };

  layout();
  addEventListener('resize', layout);
  // A theme switch changes the ground colour, so restart the drawing on it.
  new MutationObserver(layout).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', layout);

  if (reduce) {
    for (let i = 0; i < 260; i++) step(); // one still frame instead of motion
  } else {
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => { mx = my = -1e4; });
    loop();
  }
}
