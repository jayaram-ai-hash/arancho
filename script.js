/**
 * ARACHNO — Into The Web
 * script.js — Cinematic scroll-driven animations
 *
 * Sections:
 *  1. Init & Globals
 *  2. Custom Cursor + Web Trails
 *  3. Particle System
 *  4. Preloader
 *  5. Progress Bar
 *  6. Nav
 *  7. Web Audio — Synthetic Sounds
 *  8. Hero Web Canvas Decoration
 *  9. GSAP Scene Animations
 * 10. City SVG Generation + Parallax
 * 11. Speed Lines
 * 12. Origin — Word Reveal
 * 13. Powers — Web Shoot + Cards
 * 14. Villain — Eyes + Lightning + Shake
 * 15. Final — Quote + CTA Reveal
 * 16. Final Web Canvas
 * 17. Hamburger Menu
 * 18. Run
 */

/* ═══════════════════════════════════════════════════
   1. INIT & GLOBALS
═══════════════════════════════════════════════════ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cursor = { x: mouse.x, y: mouse.y };
let scrollY = 0;
let soundEnabled = false;
let audioCtx = null;

/* ═══════════════════════════════════════════════════
   2. CUSTOM CURSOR + WEB TRAILS
═══════════════════════════════════════════════════ */

function initCursor() {
  const dot = $('#cursor');
  const webCanvas = $('#web-canvas');
  const ctx = webCanvas.getContext('2d');

  webCanvas.width  = window.innerWidth;
  webCanvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    webCanvas.width  = window.innerWidth;
    webCanvas.height = window.innerHeight;
  });

  // Trail points for web lines
  const trail = [];
  const MAX_TRAIL = 24;
  const WEB_INTERVAL = 80; // px between web anchor points
  let lastWebX = mouse.x, lastWebY = mouse.y;
  const anchors = []; // sticky anchor points for web

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // drop a web anchor every WEB_INTERVAL px
    const dx = mouse.x - lastWebX, dy = mouse.y - lastWebY;
    if (Math.sqrt(dx*dx + dy*dy) > WEB_INTERVAL) {
      anchors.push({ x: lastWebX, y: lastWebY, life: 1 });
      lastWebX = mouse.x; lastWebY = mouse.y;
      if (anchors.length > 8) anchors.shift();
    }
  });

  // Hover effect on interactive elements
  $$('a, button, .ab-card').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hovered'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hovered'));
  });

  function animateCursor() {
    // Smooth follow
    cursor.x += (mouse.x - cursor.x) * 0.15;
    cursor.y += (mouse.y - cursor.y) * 0.15;
    dot.style.left = cursor.x + 'px';
    dot.style.top  = cursor.y + 'px';

    // Draw web trails on canvas
    ctx.clearRect(0, 0, webCanvas.width, webCanvas.height);

    // Add to trail
    trail.push({ x: cursor.x, y: cursor.y });
    if (trail.length > MAX_TRAIL) trail.shift();

    // Draw connecting web lines between anchors
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i], b = anchors[i + 1];
      a.life = Math.max(0, a.life - 0.003);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(230,25,25,${a.life * 0.4})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Draw lines from each anchor to cursor
    anchors.forEach(anchor => {
      ctx.beginPath();
      ctx.moveTo(anchor.x, anchor.y);
      ctx.lineTo(cursor.x, cursor.y);
      ctx.strokeStyle = `rgba(230,25,25,${anchor.life * 0.15})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // anchor dot
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,25,25,${anchor.life * 0.5})`;
      ctx.fill();
    });

    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* ═══════════════════════════════════════════════════
   3. PARTICLE SYSTEM
═══════════════════════════════════════════════════ */

function initParticles() {
  const canvas = $('#particle-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 90;
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -Math.random() * 0.6 - 0.1;
      this.size = Math.random() * 2 + 0.3;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
      this.type = Math.random() < 0.6 ? 'dust' : Math.random() < 0.5 ? 'spark' : 'streak';
      // colour mix: red / blue / white
      const palette = [
        `230,25,25`, `0,212,255`, `255,255,255`, `255,106,0`
      ];
      this.col = palette[Math.floor(Math.random() * palette.length)];
    }
    update() {
      this.life++;
      this.x += this.vx + Math.sin(this.life * 0.02) * 0.3;
      this.y += this.vy;
      this.vx *= 0.999;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const alpha = Math.min(this.life / 40, 1) * (1 - this.life / this.maxLife) * 0.6;
      if (alpha <= 0) return;
      ctx.save();
      if (this.type === 'streak') {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 12, this.y - this.vy * 12);
        ctx.strokeStyle = `rgba(${this.col},${alpha})`;
        ctx.lineWidth = this.size * 0.6;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.col},${alpha})`;
        ctx.fill();
        if (this.type === 'spark') {
          ctx.shadowColor = `rgba(${this.col},0.8)`;
          ctx.shadowBlur = 8;
        }
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    p.life = Math.random() * p.maxLife; // stagger
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ═══════════════════════════════════════════════════
   4. PRELOADER
═══════════════════════════════════════════════════ */

function runPreloader() {
  return new Promise(resolve => {
    const fill = $('#pl-fill');
    const loader = $('#preloader');
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 8 + 2;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        fill.style.width = '100%';
        setTimeout(() => {
          loader.classList.add('hidden');
          setTimeout(resolve, 800);
        }, 500);
      } else {
        fill.style.width = pct + '%';
      }
    }, 60);
  });
}

/* ═══════════════════════════════════════════════════
   5. PROGRESS BAR
═══════════════════════════════════════════════════ */

function initProgressBar() {
  const bar = $('#progress-bar');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = window.scrollY / max;
    bar.style.transform = `scaleX(${pct})`;
  });
}

/* ═══════════════════════════════════════════════════
   6. NAV
═══════════════════════════════════════════════════ */

function initNav() {
  const nav = $('#nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ═══════════════════════════════════════════════════
   7. WEB AUDIO — SYNTHETIC SOUNDS
═══════════════════════════════════════════════════ */

function initAudio() {
  const btn = $('#sound-btn');
  btn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btn.classList.toggle('muted', !soundEnabled);
    if (soundEnabled && !audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (soundEnabled) playAmbient();
  });
}

function playAmbient() {
  if (!audioCtx || !soundEnabled) return;
  // Low rumble
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(40, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(55, audioCtx.currentTime + 8);
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 2);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 8);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 8);
}

function playWebShoot() {
  if (!audioCtx || !soundEnabled) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.35);
}

function playLightning() {
  if (!audioCtx || !soundEnabled) return;
  const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.4, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  src.buffer = buf;
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  src.connect(gain); gain.connect(audioCtx.destination);
  src.start();
}

/* ═══════════════════════════════════════════════════
   8. HERO WEB CANVAS DECORATION
═══════════════════════════════════════════════════ */

function drawHeroWebDecoration() {
  const canvas = $('#hero-web-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawWebs();
  }

  function drawWeb(ctx, cx, cy, spokes, rings, maxR, alpha) {
    const angleStep = (Math.PI * 2) / spokes;
    ctx.strokeStyle = `rgba(230,25,25,${alpha})`;
    ctx.lineWidth = 0.5;

    // Draw spokes
    for (let i = 0; i < spokes; i++) {
      const angle = i * angleStep;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.stroke();
    }

    // Draw rings
    for (let r = 1; r <= rings; r++) {
      const radius = (r / rings) * maxR;
      ctx.beginPath();
      for (let i = 0; i <= spokes; i++) {
        const angle = i * angleStep;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(230,25,25,${alpha * (1 - r / rings) * 0.8 + 0.05})`;
      ctx.stroke();
    }
  }

  function drawWebs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Top-left corner web
    drawWeb(ctx, 0, 0, 8, 7, 240, 0.18);
    // Top-right corner web
    drawWeb(ctx, canvas.width, 0, 8, 7, 240, 0.18);
    // Faint center web
    drawWeb(ctx, canvas.width / 2, canvas.height / 2, 12, 5, 180, 0.05);
  }

  resize();
  window.addEventListener('resize', resize);
}

/* ═══════════════════════════════════════════════════
   9. GSAP SCENE ANIMATIONS
═══════════════════════════════════════════════════ */

function initGSAP() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded — falling back to CSS');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // ── HERO — slow zoom on title ──────────────────
  gsap.to('#hero-title-block', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    scale: 1.08,
    opacity: 0,
    y: -60,
  });

  gsap.to('.spider-wrap', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    y: -120,
    opacity: 0,
  });

  // ── ORIGIN — slide in content ──────────────────
  gsap.fromTo('.origin-content', { opacity: 0, x: -60 }, {
    scrollTrigger: {
      trigger: '#origin',
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
    },
    opacity: 1, x: 0,
  });

  // ── POWERS — web shoot SVG on scroll ──────────
  ScrollTrigger.create({
    trigger: '#powers',
    start: 'top 60%',
    onEnter: () => {
      $$('.wp').forEach((p, i) => {
        setTimeout(() => {
          p.classList.add('shot');
          playWebShoot();
        }, i * 200);
      });
    },
    once: true,
  });

  // ── CITY — parallax scroll ─────────────────────
  ScrollTrigger.create({
    trigger: '#city',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: self => {
      const p = self.progress;
      const far  = $('#city-far');
      const mid  = $('#city-mid');
      const near = $('#city-near');
      if (far)  far.style.transform  = `translateX(${p * -60}px)`;
      if (mid)  mid.style.transform  = `translateX(${p * -140}px)`;
      if (near) near.style.transform = `translateX(${p * -260}px)`;

      // swinger horizontal movement
      const swinger = $('#swinger');
      if (swinger) {
        swinger.style.left = `${10 + p * 70}%`;
        swinger.style.transform = `rotate(${Math.sin(p * Math.PI * 4) * 15}deg)`;
      }

      // Speed lines intensity
      updateSpeedLines(p);
    },
  });

  // ── VILLAIN — eyes appear + shake ─────────────
  ScrollTrigger.create({
    trigger: '#villain',
    start: 'top 60%',
    onEnter: () => {
      triggerVillainReveal();
    },
    once: true,
  });

  // ── FINAL — quote words ────────────────────────
  ScrollTrigger.create({
    trigger: '#final',
    start: 'top 70%',
    onEnter: () => revealFinalScene(),
    once: true,
  });
}

/* ═══════════════════════════════════════════════════
   10. CITY SVG GENERATION
═══════════════════════════════════════════════════ */

function buildCity() {
  // Building configs for each layer
  const layers = [
    {
      id: 'city-far',
      count: 28,
      minH: 80, maxH: 250,
      minW: 30, maxW: 70,
      baseY: 600,
      fill: ['#06060e','#08081a','#050514'],
      windowFill: 'rgba(0,180,255,0.12)',
      windowGlow: false,
    },
    {
      id: 'city-mid',
      count: 20,
      minH: 150, maxH: 380,
      minW: 45, maxW: 90,
      baseY: 600,
      fill: ['#080810','#0a0a18','#07070f'],
      windowFill: 'rgba(230,25,25,0.15)',
      windowGlow: true,
    },
    {
      id: 'city-near',
      count: 12,
      minH: 250, maxH: 500,
      minW: 60, maxW: 120,
      baseY: 600,
      fill: ['#030306','#050508','#040406'],
      windowFill: 'rgba(255,255,255,0.08)',
      windowGlow: true,
    },
  ];

  layers.forEach(cfg => {
    const svg = $(`#${cfg.id}`);
    if (!svg) return;
    let html = '';
    let x = 0;
    const totalW = 1400;

    while (x < totalW + 60) {
      const w  = rand(cfg.minW, cfg.maxW);
      const h  = rand(cfg.minH, cfg.maxH);
      const y  = cfg.baseY - h;
      const fill = cfg.fill[Math.floor(Math.random() * cfg.fill.length)];

      html += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;

      // Windows
      const wRows = Math.floor(h / 22);
      const wCols = Math.floor(w / 14);
      for (let row = 0; row < wRows; row++) {
        for (let col = 0; col < wCols; col++) {
          if (Math.random() > 0.45) {
            const wx = x + 4 + col * 14;
            const wy = y + 6 + row * 22;
            const lit = Math.random() > 0.4;
            if (lit) {
              html += `<rect x="${wx}" y="${wy}" width="8" height="10" fill="${cfg.windowFill}" rx="1"/>`;
              if (cfg.windowGlow && Math.random() > 0.7) {
                html += `<rect x="${wx-1}" y="${wy-1}" width="10" height="12" fill="none"
                  stroke="${cfg.windowFill}" stroke-width="1" rx="1" opacity="0.5"/>`;
              }
            }
          }
        }
      }

      // Antenna on some buildings
      if (Math.random() > 0.6) {
        const ax = x + w / 2;
        html += `<line x1="${ax}" y1="${y}" x2="${ax}" y2="${y - rand(15,45)}"
          stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
        if (Math.random() > 0.5) {
          html += `<circle cx="${ax}" cy="${y - rand(15,45)}" r="2" fill="#e61919" opacity="0.8"/>`;
        }
      }

      x += w + rand(0, 12);
    }

    svg.innerHTML = html;
  });
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ═══════════════════════════════════════════════════
   11. SPEED LINES
═══════════════════════════════════════════════════ */

let speedIntensity = 0;

function initSpeedLines() {
  const canvas = $('#speed-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (speedIntensity > 0.01) {
      const cx = canvas.width  * 0.3;
      const cy = canvas.height * 0.35;
      const lineCount = Math.floor(speedIntensity * 40);
      for (let i = 0; i < lineCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const len   = 50 + Math.random() * 200 * speedIntensity;
        const dist  = 20 + Math.random() * 80;
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy + Math.sin(angle) * dist;
        const ex = sx + Math.cos(angle) * len;
        const ey = sy + Math.sin(angle) * len;
        const alpha = Math.random() * speedIntensity * 0.4;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = Math.random() * 1.5;
        ctx.stroke();
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

function updateSpeedLines(progress) {
  // Intensity spikes mid-scroll through city
  const mid = 1 - Math.abs(progress - 0.5) * 2;
  speedIntensity = Math.max(0, mid);
}

/* ═══════════════════════════════════════════════════
   12. ORIGIN — WORD REVEAL
═══════════════════════════════════════════════════ */

function initWordReveal() {
  const words = $$('.w');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        words.forEach((w, i) => {
          setTimeout(() => {
            w.classList.add('visible');
          }, i * 120);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const block = $('#story-block');
  if (block) observer.observe(block);
}

/* ═══════════════════════════════════════════════════
   13. POWERS — ABILITY CARDS
═══════════════════════════════════════════════════ */

function initAbilityCards() {
  const cards = $$('.ab-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, i * 140);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const abilities = $('#abilities');
  if (abilities) observer.observe(abilities);
}

/* ═══════════════════════════════════════════════════
   14. VILLAIN — EYES + LIGHTNING + SHAKE
═══════════════════════════════════════════════════ */

function triggerVillainReveal() {
  const eyes   = $('#eyes-wrap');
  const distort = $('#distort');
  const wrap   = $('#lightning-wrap');

  if (!eyes) return;

  // Lightning flash sequence
  function flash(times) {
    if (times <= 0) return;
    const div = document.createElement('div');
    div.style.cssText = `
      position:absolute; inset:0;
      background:rgba(255,255,255,${0.05 + Math.random()*0.12});
      pointer-events:none; z-index:5;
    `;
    wrap.appendChild(div);
    setTimeout(() => {
      div.remove();
      setTimeout(() => flash(times - 1), 60 + Math.random() * 120);
    }, 40 + Math.random() * 80);
    playLightning();
  }

  flash(4);

  // Eyes appear
  setTimeout(() => {
    eyes.classList.add('revealed');

    // Screen shake
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);

    // Brief distortion overlay
    distort.style.opacity = '1';
    setTimeout(() => { distort.style.transition='opacity 1s'; distort.style.opacity='0'; }, 300);
  }, 800);

  // More lightning flashes periodically
  setInterval(() => {
    if (document.documentElement.scrollTop >= ($('#villain').offsetTop - 200)) {
      if (Math.random() > 0.7) flash(2);
    }
  }, 3500);
}

/* ═══════════════════════════════════════════════════
   15. FINAL — QUOTE + CTA REVEAL
═══════════════════════════════════════════════════ */

function revealFinalScene() {
  const words = $$('.eq-w');
  const cta   = $('#cta-wrap');
  const cred  = $('#credits');

  // Staggered word reveal
  words.forEach((w, i) => {
    setTimeout(() => {
      w.style.transition = `opacity .7s, transform .7s`;
      w.classList.add('revealed');
    }, i * 180);
  });

  // CTA + credits
  setTimeout(() => cta  && cta.classList.add('revealed'), words.length * 180 + 200);
  setTimeout(() => cred && cred.classList.add('revealed'), words.length * 180 + 600);

  // Add ambient light rays
  buildRays();
}

function buildRays() {
  const wrap = $('#rays-wrap');
  if (!wrap) return;
  for (let i = 0; i < 10; i++) {
    const ray = document.createElement('div');
    ray.className = 'ray';
    ray.style.transform = `rotate(${i * 36}deg)`;
    ray.style.animationDuration = `${18 + i * 2}s`;
    ray.style.animationDelay = `${-i * 2}s`;
    wrap.appendChild(ray);
  }
}

/* ═══════════════════════════════════════════════════
   16. FINAL WEB CANVAS
═══════════════════════════════════════════════════ */

function drawFinalWeb() {
  const canvas = $('#final-web-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
    draw();
  }

  function drawWeb(cx, cy, spokes, rings, maxR) {
    const step = (Math.PI * 2) / spokes;
    ctx.lineWidth = 1;

    for (let i = 0; i < spokes; i++) {
      const angle = i * step;
      const gradient = ctx.createLinearGradient(
        cx, cy,
        cx + Math.cos(angle)*maxR, cy + Math.sin(angle)*maxR
      );
      gradient.addColorStop(0, 'rgba(230,25,25,0.6)');
      gradient.addColorStop(1, 'rgba(0,212,255,0.1)');
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle)*maxR, cy + Math.sin(angle)*maxR);
      ctx.strokeStyle = gradient;
      ctx.stroke();
    }

    for (let r = 1; r <= rings; r++) {
      const radius = (r / rings) * maxR;
      ctx.beginPath();
      for (let i = 0; i <= spokes; i++) {
        const angle = i * step;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      const a = 0.4 * (1 - r / rings) + 0.05;
      ctx.strokeStyle = `rgba(230,25,25,${a})`;
      ctx.stroke();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWeb(canvas.width/2, canvas.height/2, 12, 10, Math.min(canvas.width, canvas.height) * 0.6);
  }

  resize();
  window.addEventListener('resize', resize);
}

/* ═══════════════════════════════════════════════════
   17. HAMBURGER MENU (MOBILE)
═══════════════════════════════════════════════════ */

function initHamburger() {
  const btn   = $('#hamburger');
  const links = $('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '64px';
    links.style.right = '0';
    links.style.left = '0';
    links.style.background = 'rgba(5,5,8,0.97)';
    links.style.padding = '1.5rem 2.5rem';
    links.style.gap = '1.2rem';
    links.style.backdropFilter = 'blur(20px)';
    links.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
  });
}

/* ═══════════════════════════════════════════════════
   18. CTA BUTTON INTERACTIONS
═══════════════════════════════════════════════════ */

function initButtons() {
  const watchBtn   = $('#btn-watch');
  const exploreBtn = $('#btn-explore');

  if (watchBtn) {
    watchBtn.addEventListener('click', () => {
      // Smooth scroll to hero with cinematic flash
      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;inset:0;background:#fff;opacity:0.15;z-index:9999;pointer-events:none;transition:opacity .6s;';
      document.body.appendChild(flash);
      setTimeout(() => { flash.style.opacity = '0'; }, 100);
      setTimeout(() => { flash.remove(); window.scrollTo({top: 0, behavior: 'smooth'}); }, 700);
    });
  }

  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
    });
  }
}

/* ═══════════════════════════════════════════════════
   18. FALLBACK SCROLL ANIMATIONS (no GSAP)
═══════════════════════════════════════════════════ */

function initFallbackScroll() {
  // Intersection observer for sections that need scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
      }
    });
  }, { threshold: 0.15 });

  $$('.sec-title, .scene-chip').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .8s, transform .8s';
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════════
   RUN EVERYTHING
═══════════════════════════════════════════════════ */

async function main() {
  // Wait for preloader
  await runPreloader();

  // UI & core
  initCursor();
  initParticles();
  initProgressBar();
  initNav();
  initAudio();
  initHamburger();
  initButtons();

  // Scene setups
  drawHeroWebDecoration();
  buildCity();
  initSpeedLines();
  initWordReveal();
  initAbilityCards();
  drawFinalWeb();
  initFallbackScroll();

  // GSAP scroll animations (loaded via CDN)
  if (typeof gsap !== 'undefined') {
    initGSAP();
  }

  // Pulse ambient sound on first scroll
  let firstScroll = false;
  window.addEventListener('scroll', () => {
    if (!firstScroll) {
      firstScroll = true;
      playAmbient();
    }
  });

  console.log(
    '%c🕷 ARACHNO — Into The Web 🕷',
    'color:#e61919; font-size:18px; font-weight:bold; font-family:monospace;'
  );
}

// Boot after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
