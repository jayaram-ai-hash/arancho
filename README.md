# 🕷 ARACHNO — Into The Web
### A Cinematic Scroll-Driven Superhero Website

---

## 🎬 Overview

A full-screen immersive landing page where each scroll acts like a new film scene.
Built with pure **HTML + CSS + JavaScript** using GSAP for scroll animations.

---

## 🗂 File Structure

```
arachno-site/
├── index.html     — Page structure & 6 cinematic scenes
├── style.css      — All visual styles, animations, glassmorphism
├── script.js      — Scroll animations, particles, audio, city builder
└── README.md      — This file
```

---

## 🎥 Scene Structure

| # | Scene | Highlights |
|---|-------|-----------|
| 1 | **Hero** | Spider silhouette, glitch title, fog, slow zoom |
| 2 | **Origin** | Word-by-word reveal, glowing spider bite |
| 3 | **Powers** | Web-shoot SVG animation, abilities grid |
| 4 | **City Swing** | 3-layer parallax skyline, swinging hero, speed lines |
| 5 | **Villain** | Lightning flashes, glowing eyes, screen shake |
| 6 | **Final** | Epic quote reveal, CTA buttons, web canvas |

---

## 🚀 Quick Start

### Option A — Local (no server needed)
```bash
# Just open index.html in any modern browser:
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Option B — GitHub Pages
```bash
git init
git add .
git commit -m "🕷 ARACHNO — Into The Web"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/arachno-site.git
git push -u origin main
# Then: Settings → Pages → Source: main branch → Save
```

Your site will be live at:
`https://YOUR_USERNAME.github.io/arachno-site/`

### Option C — Local server
```bash
# Python 3
python -m http.server 3000
# Node.js
npx serve .
```

---

## 🎛 Features

- **Custom cursor** — Red glowing dot with spider-web trails on mouse movement
- **Particle system** — Dust, sparks, and light streaks floating upward
- **Film grain** — Subtle animated grain overlay for cinematic feel
- **Glitch text** — CSS keyframe glitch on hero and villain titles
- **Glassmorphism** — Ability cards with blurred glass panels
- **Parallax city** — 3-layer SVG skyline with procedurally generated buildings
- **Speed lines** — Canvas-drawn lines during city swing scene
- **Web Audio** — Synthetic sounds (no files): web shoot, lightning, ambient rumble
- **Screen shake** — CSS animation triggered on villain reveal
- **Progress bar** — Red→blue gradient showing scroll position
- **Scroll progress** — GSAP ScrollTrigger for smooth scene transitions

---

## 🔧 Customization

### Change the hero name / title
In `index.html`, find:
```html
<h1 class="hero-title glitch" data-text="ARACHNO">ARACHNO</h1>
<div class="hero-sub">INTO&nbsp;&nbsp;THE&nbsp;&nbsp;WEB</div>
```

### Change the color theme
In `style.css`, update the `:root` variables:
```css
:root {
  --red:   #e61919;   /* primary accent */
  --blue:  #00d4ff;   /* secondary accent */
  --dark:  #050508;   /* background */
}
```

### Add real background music
In `script.js`, replace `playAmbient()` with:
```js
function playAmbient() {
  const audio = new Audio('music/theme.mp3');
  audio.loop = true;
  audio.volume = 0.3;
  audio.play();
}
```

### Reuse for other projects
This template works perfectly for:
- **Portfolio** — Replace scenes with work timeline, projects, contact
- **Game promo** — Replace spider theme with game lore/characters
- **Event site** — Replace scenes with schedule, speakers, venue
- **Business landing** — Replace scenes with problem, solution, CTA

---

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Chrome | ✅ Optimized |
| Mobile Safari | ✅ Optimized |

---

## 📦 Dependencies (CDN — no install needed)

- [GSAP 3.12.2](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js)
- [GSAP ScrollTrigger](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js)
- [Google Fonts](https://fonts.google.com) — Bebas Neue, Rajdhani, Share Tech Mono

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

*"With great power comes great responsibility."*
