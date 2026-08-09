import './styles/global.css';
import { initBgScene } from './scenes/bgScene.js';
import { initHeroScene } from './scenes/heroScene.js';
import { initCardScene } from './scenes/cardScene.js';
import { flipPage, animateSkillBars, fadeIn, staggerReveal } from './components/pageFlip.js';
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
import { animate, stagger, splitText } from 'animejs';
import { prefersReducedMotion } from './utils/motion.js';

// ── Detectar Safari móvil — DEBE IR ANTES DE USARSE ───────────────────────
const isMobileSafari =
  /iP(hone|od|ad)/.test(navigator.userAgent) ||
  (navigator.userAgent.includes('Safari') &&
   !navigator.userAgent.includes('Chrome') &&
   window.innerWidth < 768);

// ── Estado de idioma ───────────────────────────────────────────────────────
let currentLang = 'es';
let enTexts = null;

// ── Tracking de escenas Three.js vivas ─────────────────────────────────────
// bgScene/heroScene/cardScene devuelven una función de cleanup (para el
// paren renderer/RAF loop/listeners). Antes nunca se guardaba, así que cada
// cambio de idioma (rebuildPages -> buildApp -> innerHTML nuevo) dejaba el
// renderer y el requestAnimationFrame viejos corriendo para siempre en
// segundo plano. Ahora se guardan y se llaman antes de reconstruir.
let bgSceneCleanup = null;
let heroSceneCleanup = null;
const cardSceneCleanups = new Map(); // canvas -> cleanup fn

function disposeAllScenes() {
  bgSceneCleanup?.();
  heroSceneCleanup?.();
  bgSceneCleanup = null;
  heroSceneCleanup = null;
  cardSceneCleanups.forEach(cleanup => cleanup());
  cardSceneCleanups.clear();
}

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
if (!isMobileSafari) bgSceneCleanup = initBgScene(bgCanvas);
heroSceneCleanup = initHeroScene(document.getElementById('hero-canvas'));

// ── Placeholder 2D para Safari móvil ──────────────────────────────────────
function drawStaticPlaceholder(canvas, item) {
  // Si tiene imagen estática, usarla
  if (item.image) {
    const w = canvas.clientWidth  || 300;
    const h = canvas.clientHeight || 300;
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, w, h);
    img.onerror = () => drawCirclePlaceholder(ctx, w, h, item);
    img.src = item.image;
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.clientWidth  || 300;
  const h = canvas.clientHeight || 300;
  canvas.width  = w;
  canvas.height = h;
  drawCirclePlaceholder(ctx, w, h, item);
}

function drawCirclePlaceholder(ctx, w, h, item) {
  // Fondo degradado
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#1a1a35');
  grad.addColorStop(1, '#0d1a2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Círculo central
  const radius = Math.min(w, h) * 0.32;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
  ctx.fillStyle = item.color + '22';
  ctx.fill();
  ctx.strokeStyle = item.color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Icono hexágono
  ctx.fillStyle = item.color + '88';
  ctx.font = `${Math.floor(radius * 0.65)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⬡', w / 2, h / 2 - radius * 0.12);

  // Nombre — reducir fuente si es muy largo
  const name = item.name;
  let fontSize = Math.floor(w * 0.072);
  ctx.font = `bold ${fontSize}px serif`;
  while (ctx.measureText(name).width > radius * 1.7 && fontSize > 9) {
    fontSize -= 1;
    ctx.font = `bold ${fontSize}px serif`;
  }
  ctx.fillStyle = '#E8E0D0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, w / 2, h / 2 + radius * 0.52);

  // Label
  ctx.fillStyle = '#C9A96E';
  ctx.font = `${Math.floor(w * 0.038)}px monospace`;
  ctx.fillText('3D MODEL', w / 2, h / 2 + radius * 0.88);
}

// ── Init card scenes ───────────────────────────────────────────────────────
function initCardScenes() {
  let anyNew = false;
  document.querySelectorAll('.card-canvas').forEach(canvas => {
    if (canvas.dataset.initialized) return;
    canvas.dataset.initialized = 'true';
    anyNew = true;

    const projectId = canvas.dataset.projectId;
    const modelId   = canvas.dataset.modelId;
    const item = projectId
      ? projects.find(p => p.id === projectId)
      : models3d.find(m => m.id === modelId);

    if (!item) return;

    if (isMobileSafari) {
      drawStaticPlaceholder(canvas, item);
    } else {
      // Guardamos el cleanup devuelto (dispose del renderer, RAF loop,
      // ResizeObserver y animaciones de anime.js de esta tarjeta) para
      // poder liberarlo en disposeAllScenes() cuando se reconstruya el DOM.
      const cleanup = initCardScene(canvas, item);
      cardSceneCleanups.set(canvas, cleanup);
    }
  });

  // Entrada en cascada de las tarjetas recién creadas (proyectos/juegos)
  if (anyNew) {
    staggerReveal('#page-models .project-card');
    staggerReveal('#page-games .game-card');
  }
}
initCardScenes();

// ── Entradas de texto con Anime.js (splitText chars + wrap: 'clip') ────────
// Cada carácter queda envuelto en un span con overflow oculto (wrap: 'clip')
// y se desliza desde abajo (100% -> 0%) hacia su posición final, tipo
// marcador/scoreboard. Se usa tanto para el título del hero como para los
// textos que cambian al alternar idioma.
// Docs: https://animejs.com/documentation/text/splittext/textsplitter-settings/chars
function revealText(el, { start = 0, by = 'chars', duration = 650 } = {}) {
  if (prefersReducedMotion || !el) return null;
  const splitSettings = by === 'chars' ? { chars: { wrap: 'clip' } } : { words: { wrap: 'clip' } };
  const { chars, words } = splitText(el, splitSettings);
  const targets = by === 'chars' ? chars : words;
  return animate(targets, {
    y: ['100%', '0%'],
    duration,
    ease: 'out(3)',
    delay: stagger(by === 'chars' ? 22 : 45, { start }),
  });
}

// Palabra dorada del título de la página activa.
function animateHeroTitle(pageId) {
  const span = document.querySelector(`#page-${pageId} .section-title span`);
  revealText(span, { by: 'chars', start: 350 });
}

// Nav labels, botón de idioma y texto de la página activa (eyebrow + body).
// Se usa al cambiar de idioma en vez del salto instantáneo de texto.
function revealPageText(pageId) {
  document.querySelectorAll('.nav-label, .lang-btn').forEach((el, i) =>
    revealText(el, { by: 'chars', start: i * 20 })
  );
  document.querySelectorAll(`#page-${pageId} .section-eyebrow`).forEach((el, i) =>
    revealText(el, { by: 'chars', start: 80 + i * 40 })
  );
  // El cuerpo puede tener varios párrafos (ej. "Acerca de mí" tiene 4).
  // Se dividen por palabras (no por carácter) para que el stagger no se
  // vuelva eterno, y cada párrafo arranca un poco después del anterior.
  document.querySelectorAll(`#page-${pageId} .section-body`).forEach((el, i) =>
    revealText(el, { by: 'words', start: 150 + i * 120 })
  );
}

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
    animateHeroTitle(id);
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
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.textContent = '...';
    btn.disabled = true;
  });

  if (currentLang === 'es') {
    if (!enTexts) enTexts = await getTranslations();
    currentLang = 'en';
    rebuildPages(enTexts);
  } else {
    currentLang = 'es';
    rebuildPages(es);
  }
}

function rebuildPages(texts) {
  const savedPage = currentPage;

  // Libera renderers, RAF loops, listeners y animaciones de anime.js de
  // TODAS las escenas vivas (bg, hero, tarjetas) antes de tirar el DOM viejo.
  // Esto es lo que arregla el memory leak: antes el innerHTML se
  // reemplazaba sin detener nada de lo anterior.
  disposeAllScenes();

  buildApp(texts);
  attachEvents();

  if (!isMobileSafari) bgSceneCleanup = initBgScene(document.getElementById('bg-canvas'));
  heroSceneCleanup = initHeroScene(document.getElementById('hero-canvas'));

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

  // Revela el texto del idioma nuevo con el slide de caracteres (nav +
  // labels + cuerpo) y el título de la página activa igual.
  revealPageText(currentPage);
  animateHeroTitle(currentPage);
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
// La palabra dorada del título entra letra por letra (Anime.js) mientras
// el resto del bloque hace fade/slide con GSAP.
animateHeroTitle('home');

// Pre-cargar traducciones
getTranslations().then(texts => { enTexts = texts; });