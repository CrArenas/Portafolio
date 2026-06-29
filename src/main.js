import './styles/global.css';
import { initBgScene } from './scenes/bgScene.js';
import { initHeroScene } from './scenes/heroScene.js';
import { initCardScene } from './scenes/cardScene.js';
import { flipPage, animateSkillBars, fadeIn } from './components/pageFlip.js';
import {
  buildSpine,
  buildHomePage,
  buildAboutPage,
  buildModelsPage,
  buildGamesPage,
  buildContactPage,
  setTexts,
} from './components/pages.js';
import { projects, models3d, games } from './data/projects.js';
import { es } from './data/i18n.js';
import { getTranslations } from './data/translator.js';
import { gsap } from 'gsap';

// ── Estado de idioma ───────────────────────────────────────────────────────
let currentLang = 'es';
let enTexts = null;

// ── Build DOM inicial en español ───────────────────────────────────────────
function buildApp(texts) {
  setTexts(texts);
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="book">
      ${buildSpine()}
      <main class="pages-area">
        <canvas id="bg-canvas"></canvas>
        ${buildHomePage()}
        ${buildAboutPage()}
        ${buildModelsPage()}
        ${buildGamesPage()}
        ${buildContactPage()}
      </main>
    </div>
  `;
}

buildApp(es);

// ── Init Three.js scenes ───────────────────────────────────────────────────
const bgCanvas = document.getElementById('bg-canvas');
bgCanvas.width  = bgCanvas.clientWidth;
bgCanvas.height = bgCanvas.clientHeight;
initBgScene(bgCanvas);
initHeroScene(document.getElementById('hero-canvas'));

function initCardScenes() {
  document.querySelectorAll('.card-canvas').forEach(canvas => {
    if (canvas.dataset.initialized) return;
    canvas.dataset.initialized = 'true';
    const projectId = canvas.dataset.projectId;
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) initCardScene(canvas, project);
    }
    const modelId = canvas.dataset.modelId;
    if (modelId) {
      const model = models3d.find(m => m.id === modelId);
      if (model) initCardScene(canvas, model);
    }
  });
}
initCardScenes();

// ── Navegación ─────────────────────────────────────────────────────────────
let currentPage = 'home';
const pageOrder = ['home', 'about', 'models', 'games', 'contact'];

function getPage(id) {
  return document.getElementById(`page-${id}`);
}

function navigateTo(id) {
  if (id === currentPage) return;
  const outEl = getPage(currentPage);
  const inEl  = getPage(id);
  const dir   = pageOrder.indexOf(id) > pageOrder.indexOf(currentPage) ? 1 : -1;

  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === id);
  });

  flipPage(outEl, inEl, dir, () => {
    if (id === 'about') setTimeout(animateSkillBars, 100);
    if (id === 'models' || id === 'games') setTimeout(initCardScenes, 100);
    fadeIn(inEl);
  });

  currentPage = id;
}

// Nav clicks — desktop y móvil
document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(item.dataset.page);
    closeMobileMenu();
  });
});

// Teclado
document.addEventListener('keydown', e => {
  const idx = pageOrder.indexOf(currentPage);
  if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && idx < pageOrder.length - 1)
    navigateTo(pageOrder[idx + 1]);
  if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && idx > 0)
    navigateTo(pageOrder[idx - 1]);
});

// ── Hamburguesa ────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-nav-menu');

function closeMobileMenu() {
  hamburger?.classList.remove('open');
  mobileMenu?.classList.remove('open');
}

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// ── Cambio de idioma ───────────────────────────────────────────────────────
async function switchLanguage() {
  // Deshabilitar botones mientras carga
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.textContent = '...';
    btn.disabled = true;
  });

  if (currentLang === 'es') {
    // Cambiar a inglés
    if (!enTexts) enTexts = await getTranslations();
    currentLang = 'en';
    rebuildPages(enTexts);
  } else {
    // Volver a español
    currentLang = 'es';
    rebuildPages(es);
  }
}

function rebuildPages(texts) {
  const savedPage = currentPage;

  // Guardar canvases activos para no re-inicializarlos
  document.querySelectorAll('.card-canvas').forEach(c => {
    c.dataset.initialized = '';
  });

  buildApp(texts);

  // Re-conectar eventos
  attachEvents();

  // Re-init scenes
  initBgScene(document.getElementById('bg-canvas'));
  initHeroScene(document.getElementById('hero-canvas'));

  // Ir a la página que estaba activa
  currentPage = 'home';
  if (savedPage !== 'home') {
    const inEl = getPage(savedPage);
    if (inEl) {
      document.getElementById('page-home')?.classList.remove('active');
      inEl.classList.add('active');
      document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === savedPage);
      });
      currentPage = savedPage;
      if (savedPage === 'about') setTimeout(animateSkillBars, 100);
      if (savedPage === 'models' || savedPage === 'games') setTimeout(initCardScenes, 100);
    }
  }
}

function attachEvents() {
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(item.dataset.page);
      closeMobileMenu();
    });
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', switchLanguage);
  });

  const hbg = document.getElementById('hamburger');
  const mmenu = document.getElementById('mobile-nav-menu');
  hbg?.addEventListener('click', () => {
    hbg.classList.toggle('open');
    mmenu.classList.toggle('open');
  });
}

// Conectar botones de idioma iniciales
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', switchLanguage);
});

// ── Animación de entrada ───────────────────────────────────────────────────
gsap.fromTo('.spine', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
gsap.fromTo('#page-home', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'power3.out' });

// ── Pre-cargar traducciones en segundo plano ───────────────────────────────
setTimeout(() => {
  getTranslations().then(en => { enTexts = en; });
}, 2000);