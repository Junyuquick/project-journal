// The living sky behind every page: stars that twinkle and drift, fireflies that wander, and a few
// moths that flutter after the cursor or a finger, leaving a little stardust. Colours come from the
// page's CSS variables, so night and dawn both work. With reduced motion it paints one still sky.
const canvas = document.querySelector<HTMLCanvasElement>('#sky');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const calm = document.body.dataset.calm !== undefined;
  const root = document.documentElement;
  const style = getComputedStyle(root);

  let width = 0;
  let height = 0;
  let night = true;
  let star = '255 255 255';
  let glow = '255 217 138';
  let mothColours: string[] = [];
  const sprites = new Map<string, HTMLCanvasElement>();

  interface Star { x: number; y: number; r: number; phase: number; rate: number; drift: number }
  interface Firefly { x: number; y: number; seed: number; size: number; speed: number }
  interface Moth { x: number; y: number; vx: number; vy: number; heading: number; phase: number; colour: string; size: number; orbit: number; orbitSpeed: number; orbitAt: number; seed: number }
  interface Dust { x: number; y: number; vx: number; vy: number; age: number; life: number }
  let stars: Star[] = [];
  let fireflies: Firefly[] = [];
  let moths: Moth[] = [];
  const dust: Dust[] = [];

  const pointer = { x: 0, y: 0, last: -1e9, lastDust: 0, dustX: 0, dustY: 0 };
  const rgba = (c: string, a: number) => `rgb(${c} / ${a})`;
  const read = (name: string) => style.getPropertyValue(name).trim();
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  /** A soft round glow, drawn once per colour and stamped wherever a light is needed. */
  const sprite = (colour: string) => {
    let s = sprites.get(colour);
    if (!s) {
      s = document.createElement('canvas');
      s.width = s.height = 64;
      const g = s.getContext('2d')!;
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, rgba(colour, 1));
      grad.addColorStop(0.25, rgba(colour, 0.45));
      grad.addColorStop(1, rgba(colour, 0));
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      sprites.set(colour, s);
    }
    return s;
  };
  const lamp = (colour: string, x: number, y: number, radius: number, alpha: number) => {
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite(colour), x - radius, y - radius, radius * 2, radius * 2);
    ctx.globalAlpha = 1;
  };

  const readColours = () => {
    night = root.dataset.theme !== 'light';
    star = read('--sky-star');
    glow = read('--sky-glow');
    mothColours = [read('--moth-a'), read('--moth-b'), read('--moth-c')];
    sprites.clear();
  };

  const populate = () => {
    const area = width * height;
    stars = Array.from({ length: Math.round(Math.min(170, Math.max(45, area / 9000))) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() < 0.18 ? rand(1.4, 2.1) : rand(0.5, 1.2),
      phase: Math.random() * 6.28,
      rate: rand(0.4, 1.4),
      drift: rand(1.5, 5), // px per second, so the whole sky is never quite still
    }));
    fireflies = Array.from({ length: Math.round(Math.min(22, Math.max(8, area / 60000))) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      seed: Math.random() * 100,
      size: rand(7, 14),
      speed: rand(6, 16),
    }));
    const count = calm ? 2 : width < 640 ? 3 : 5;
    moths = Array.from({ length: reduce ? 0 : count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      heading: -Math.PI / 2,
      phase: Math.random() * 6.28,
      colour: mothColours[i % mothColours.length],
      size: rand(0.8, 1.2),
      orbit: rand(55, 150),
      orbitSpeed: rand(0.5, 1.1) * (i % 2 ? 1 : -1),
      orbitAt: Math.random() * 6.28,
      seed: Math.random() * 100,
    }));
  };

  const fit = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const layout = () => {
    fit();
    readColours();
    populate();
    if (reduce) paint(0, 0);
  };

  const drawMoth = (m: Moth, flap: number) => {
    const alpha = calm ? 0.45 : 0.9;
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(m.heading + Math.PI / 2);
    ctx.scale(m.size, m.size);
    if (night) ctx.globalCompositeOperation = 'lighter';
    lamp(m.colour, 0, 0, 46, alpha * 0.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = alpha;
    const sx = 0.28 + 0.72 * Math.abs(Math.cos(flap));
    for (const side of [1, -1]) {
      ctx.save();
      ctx.scale(sx * side, 1);
      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.bezierCurveTo(10, -30, 34, -34, 36, -16);
      ctx.bezierCurveTo(37, -4, 18, 2, 0, 2);
      ctx.moveTo(0, 1);
      ctx.bezierCurveTo(16, 2, 28, 10, 22, 24);
      ctx.bezierCurveTo(16, 32, 4, 22, 0, 8);
      ctx.fillStyle = rgba(m.colour, 0.6);
      ctx.fill();
      ctx.strokeStyle = rgba(m.colour, 0.95);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(22, -17, 3.4, 0, 6.28);
      ctx.fillStyle = night ? 'rgb(255 255 255 / 0.85)' : rgba(m.colour, 1);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = night ? 'rgb(255 250 235)' : rgba(m.colour, 1);
    ctx.beginPath();
    ctx.ellipse(0, 0, 1.8, 10, 0, 0, 6.28);
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  };

  /** One frame. `t` is seconds since the page opened; `dt` is the seconds since the last frame. */
  function paint(t: number, dt: number) {
    ctx!.clearRect(0, 0, width, height);
    const starAlpha = night ? 0.9 : 0.5;
    for (const s of stars) {
      s.x -= s.drift * dt;
      s.y -= s.drift * 0.3 * dt;
      if (s.x < -4) s.x = width + 4;
      if (s.y < -4) s.y = height + 4;
      const twinkle = reduce ? 0.7 : 0.45 + 0.55 * Math.sin(t * s.rate + s.phase);
      ctx!.fillStyle = rgba(star, starAlpha * twinkle);
      ctx!.beginPath();
      ctx!.arc(s.x, s.y, s.r, 0, 6.28);
      ctx!.fill();
    }
    if (reduce) return;

    ctx!.globalCompositeOperation = night ? 'lighter' : 'source-over';
    for (const f of fireflies) {
      const angle = f.seed * 6.28 + Math.sin(t * 0.21 + f.seed * 9) * 2.2 + t * 0.04;
      f.x += Math.cos(angle) * f.speed * dt;
      f.y += Math.sin(angle) * f.speed * dt * 0.7;
      if (f.x < -20) f.x = width + 20; else if (f.x > width + 20) f.x = -20;
      if (f.y < -20) f.y = height + 20; else if (f.y > height + 20) f.y = -20;
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.1 + f.seed * 7);
      lamp(glow, f.x, f.y, f.size * (0.7 + 0.5 * pulse), (calm ? 0.3 : 0.5) * (night ? 0.4 + 0.6 * pulse : 0.7));
    }

    const awake = t * 1000 - pointer.last < 4500;
    for (const m of moths) {
      let tx: number;
      let ty: number;
      let top: number;
      if (awake) {
        m.orbitAt += m.orbitSpeed * dt;
        tx = pointer.x + Math.cos(m.orbitAt) * m.orbit;
        ty = pointer.y + Math.sin(m.orbitAt) * m.orbit * 0.7;
        top = 300;
      } else {
        tx = width * (0.5 + 0.42 * Math.sin(t * 0.07 + m.seed * 7));
        ty = height * (0.5 + 0.36 * Math.cos(t * 0.053 + m.seed * 5));
        top = 80;
      }
      const dx = tx - m.x;
      const dy = ty - m.y;
      const dist = Math.hypot(dx, dy) || 1;
      const want = Math.min(top, dist * 2.2);
      // a sideways wobble makes the flight loop and flutter rather than glide
      const wobble = Math.sin(t * 3.1 + m.seed * 10) * 26;
      const wx = (dx / dist) * want - (dy / dist) * wobble;
      const wy = (dy / dist) * want + (dx / dist) * wobble;
      const ease = Math.min(1, dt * 2.4);
      m.vx += (wx - m.vx) * ease;
      m.vy += (wy - m.vy) * ease;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      const speed = Math.hypot(m.vx, m.vy);
      if (speed > 12) {
        let turn = Math.atan2(m.vy, m.vx) - m.heading;
        turn = Math.atan2(Math.sin(turn), Math.cos(turn));
        m.heading += turn * Math.min(1, dt * 4);
      }
      m.phase += dt * (7 + speed * 0.03);
      drawMoth(m, m.phase);
    }

    ctx!.globalCompositeOperation = night ? 'lighter' : 'source-over';
    for (let i = dust.length - 1; i >= 0; i--) {
      const d = dust[i];
      d.age += dt;
      if (d.age >= d.life) { dust.splice(i, 1); continue; }
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vy += 14 * dt;
      lamp(glow, d.x, d.y, 9 * (1 - d.age / d.life) + 3, 0.7 * (1 - d.age / d.life) * (calm ? 0.6 : 1));
    }
    ctx!.globalCompositeOperation = 'source-over';
  }

  const burst = (x: number, y: number, n: number) => {
    for (let i = 0; i < n && dust.length < 90; i++) {
      const a = Math.random() * 6.28;
      const v = rand(10, 60);
      dust.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 10, age: 0, life: rand(0.7, 1.4) });
    }
  };

  const follow = (x: number, y: number, now: number, trail = true) => {
    pointer.x = x;
    pointer.y = y;
    pointer.last = now;
    if (trail && Math.hypot(x - pointer.dustX, y - pointer.dustY) > 26 && now - pointer.lastDust > 40) {
      pointer.dustX = x;
      pointer.dustY = y;
      pointer.lastDust = now;
      burst(x, y, 1);
    }
  };

  layout();
  // Scrolling on a phone shows and hides the address bar, which resizes the window by a few pixels.
  // Only a change of width is a new sky; a change of height just resizes the canvas, so nothing jumps.
  addEventListener('resize', () => {
    const wider = innerWidth !== width;
    fit();
    if (wider) populate();
    if (reduce) paint(0, 0);
  });
  // A theme switch changes every colour, so read them again.
  new MutationObserver(() => { readColours(); populate(); if (reduce) paint(0, 0); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  if (!reduce) {
    // Mouse and pen through pointer events; a finger through touch events, which keep coming while the page scrolls.
    addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') follow(e.clientX, e.clientY, e.timeStamp); }, { passive: true });
    const touch = (e: TouchEvent) => { const p = e.touches[0]; if (p) follow(p.clientX, p.clientY, e.timeStamp, false); };
    addEventListener('touchstart', touch, { passive: true });
    addEventListener('touchmove', touch, { passive: true });
    addEventListener('pointerdown', (e) => { burst(e.clientX, e.clientY, 9); }, { passive: true });
    root.addEventListener('mouseleave', () => { pointer.last = -1e9; });

    let before = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - before) / 1000, 0.05);
      before = now;
      if (!document.hidden) paint(now / 1000, dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
