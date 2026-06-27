import './styles/global.css';
import { initBgScene } from './scenes/bgScene.js';
import { initHeroScene } from './scenes/heroScene.js';
import { initCardScene } from './scenes/cardScene.js';
import { flipPage, animateSkillBars, fadeIn } from './components/pageFlip.js';
import {
  buildSpine,
  buildHomePage,
  buildProjectsPage,
  buildSkillsPage,
  buildContactPage,
} from './components/pages.js';
import { projects } from './data/projects.js';

// ── Build DOM ──────────────────────────────────────────
const app = document.getElementById('app');
app.innerHTML = `
  <div class="book">
    ${buildSpine()}
    <main class="pages-area">
      <canvas id="bg-canvas"></canvas>
      ${buildHomePage()}
      ${buildProjectsPage()}
      ${buildSkillsPage()}
      ${buildContactPage()}
    </main>
  </div>
`;

// ── Init background scene ──────────────────────────────
const bgCanvas = document.getElementById('bg-canvas');
bgCanvas.width  = bgCanvas.clientWidth;
bgCanvas.height = bgCanvas.clientHeight;
initBgScene(bgCanvas);

// ── Init hero scene ────────────────────────────────────
const heroCanvas = document.getElementById('hero-canvas');
initHeroScene(heroCanvas);

// ── Init project card scenes ───────────────────────────
function initCardScenes() {
  document.querySelectorAll('.card-canvas').forEach(canvas => {
    const id = canvas.dataset.projectId;
    const project = projects.find(p => p.id === id);
    if (project) initCardScene(canvas, project);
  });
}
initCardScenes();

// ── Navigation ─────────────────────────────────────────
let currentPage = 'home';
const pageOrder = ['home', 'projects', 'skills', 'contact'];

function getPage(id) {
  return document.getElementById(`page-${id}`);
}

function navigateTo(id) {
  if (id === currentPage) return;

  const outEl = getPage(currentPage);
  const inEl  = getPage(id);

  const fromIdx = pageOrder.indexOf(currentPage);
  const toIdx   = pageOrder.indexOf(id);
  const dir     = toIdx > fromIdx ? 1 : -1;

  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === id);
  });

  flipPage(outEl, inEl, dir, () => {
    // on mid-flip: trigger page-specific effects
    if (id === 'skills') {
      setTimeout(animateSkillBars, 100);
    }
    if (id === 'projects') {
      setTimeout(initCardScenes, 100);
    }
    fadeIn(inEl);
  });

  currentPage = id;
}

// Nav clicks
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(item.dataset.page);
  });
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  const idx = pageOrder.indexOf(currentPage);
  if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && idx < pageOrder.length - 1) {
    navigateTo(pageOrder[idx + 1]);
  }
  if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && idx > 0) {
    navigateTo(pageOrder[idx - 1]);
  }
});

// ── Initial entrance animation ─────────────────────────
import { gsap } from 'gsap';

gsap.fromTo('.spine', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
gsap.fromTo('#page-home', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'power3.out' });
