import './styles/global.css';
import { initBgScene } from './scenes/bgScene.js';
import { initHeroScene } from './scenes/heroScene.js';
import { initCardScene } from './scenes/cardScene.js';
import { flipPage, fadeIn, staggerReveal } from './components/pageFlip.js';
import {
  buildSpine,
  buildHomePage,
  buildAboutPage,
  buildModelsPage,
  buildGamesPage,
  buildContactPage,
  buildVideoPoster,
  setTexts,
} from './components/pages.js';
import { models3d, loc } from './data/projects.js';
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

// ── Estado de navegación ───────────────────────────────────────────────────
// La página activa se refleja en la URL (#about, #games...) para poder
// compartir enlaces directos y usar el botón "atrás" del navegador.
const pageOrder = ['home', 'about', 'models', 'games', 'contact'];
const pageFromHash = () => {
  const id = location.hash.slice(1);
  return pageOrder.includes(id) ? id : 'home';
};
let currentPage = pageFromHash();

// ── Ciclo de vida de las escenas Three.js ─────────────────────────────────
// Cada escena usa su propio contexto WebGL y los navegadores limitan cuántos
// pueden estar activos a la vez (en móviles o GPUs modestas son pocos). Al
// pasarse del límite el navegador "mata" el contexto más antiguo y ese
// canvas queda en blanco para siempre — eso hacía desaparecer la malla de
// Inicio. Por eso:
//  · la malla de Inicio solo existe mientras Inicio está visible,
//  · los modelos 3D solo existen mientras su página está visible,
//  · cada escena se monta en un canvas nuevo y, si aun así pierde el
//    contexto, se vuelve a crear automáticamente.
let bgSceneCleanup = null;
let heroSceneCleanup = null;
const cardSceneCleanups = new Map(); // modelId -> cleanup fn

function mountScene(initialCanvas, init, { retries = 3 } = {}) {
  let canvas = initialCanvas;
  let cleanup = null;
  let attempts = 0;
  let timer = null;

  const onLost = (e) => {
    e.preventDefault();
    if (attempts++ >= retries) return;
    clearTimeout(timer);
    timer = setTimeout(start, 500);
  };

  function stop() {
    canvas.removeEventListener('webglcontextlost', onLost);
    cleanup?.();
    cleanup = null;
  }

  function start() {
    stop();
    // Un canvas cuyo contexto se perdió no se puede reutilizar: se
    // reemplaza por uno nuevo con los mismos atributos.
    const fresh = canvas.cloneNode(false);
    canvas.replaceWith(fresh);
    canvas = fresh;
    canvas.addEventListener('webglcontextlost', onLost);
    cleanup = init(canvas);
  }

  start();
  return () => {
    clearTimeout(timer);
    stop();
  };
}

function startHero() {
  stopHero();
  const canvas = document.getElementById('hero-canvas');
  if (canvas) heroSceneCleanup = mountScene(canvas, initHeroScene);
}

function stopHero() {
  heroSceneCleanup?.();
  heroSceneCleanup = null;
}

function stopCardScenes() {
  cardSceneCleanups.forEach(cleanup => cleanup());
  cardSceneCleanups.clear();
}

function disposeAllScenes() {
  bgSceneCleanup?.();
  bgSceneCleanup = null;
  stopHero();
  stopCardScenes();
}

function initScenes() {
  if (!isMobileSafari) bgSceneCleanup = mountScene(document.getElementById('bg-canvas'), initBgScene);
}

// ── Build DOM ──────────────────────────────────────────────────────────────
function buildApp(texts) {
  setTexts(texts);
  document.documentElement.lang = texts.lang;
  document.title = texts.docTitle;
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
  const name = loc(item.name, currentLang);
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
  // Se llama con un pequeño retraso: si el usuario ya salió, no crear nada.
  if (currentPage !== 'models') return;
  let anyNew = false;
  document.querySelectorAll('.card-canvas').forEach(canvas => {
    const id = canvas.dataset.modelId;
    const item = models3d.find(m => m.id === id);
    if (!item) return;

    if (isMobileSafari) {
      if (canvas.dataset.initialized) return;
      canvas.dataset.initialized = 'true';
      anyNew = true;
      drawStaticPlaceholder(canvas, item);
    } else {
      if (cardSceneCleanups.has(id)) return;
      anyNew = true;
      // Se guarda el cleanup (renderer, RAF loop, ResizeObserver, anime.js)
      // para liberarlo al salir de la página o al reconstruir el DOM.
      cardSceneCleanups.set(id, mountScene(canvas, c => initCardScene(c, item)));
    }
  });

  // Entrada en cascada de las tarjetas recién creadas
  if (anyNew) staggerReveal('#page-models .project-card');
}

// ── Entradas de texto con Anime.js (splitText chars + wrap: 'clip') ────────
// Cada carácter queda envuelto en un span con overflow oculto (wrap: 'clip')
// y se desliza desde abajo (100% -> 0%) hacia su posición final.
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

// Nav labels y texto de la página activa (eyebrow + body).
// Se usa al cambiar de idioma en vez del salto instantáneo de texto.
function revealPageText(pageId) {
  document.querySelectorAll('.nav-label').forEach((el, i) =>
    revealText(el, { by: 'chars', start: i * 20 })
  );
  document.querySelectorAll(`#page-${pageId} .section-eyebrow`).forEach((el, i) =>
    revealText(el, { by: 'chars', start: 80 + i * 40 })
  );
  // El cuerpo puede tener varios párrafos (ej. "Sobre mí" tiene 4).
  // Se dividen por palabras para que el stagger no se vuelva eterno.
  document.querySelectorAll(`#page-${pageId} .section-body`).forEach((el, i) =>
    revealText(el, { by: 'words', start: 150 + i * 120 })
  );
}

// ── Navegación ─────────────────────────────────────────────────────────────
function getPage(id) {
  return document.getElementById(`page-${id}`);
}

function setActiveNav(id) {
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
    const active = item.dataset.page === id;
    item.classList.toggle('active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

function onPageShown(id) {
  if (id === 'home') startHero();
  if (id === 'models') setTimeout(initCardScenes, 100);
}

function onPageHidden(id) {
  if (id === 'home') stopHero();
  if (id === 'models') stopCardScenes();
  if (id === 'games') resetVideos();
}

// Muestra una página sin animación (carga inicial y cambio de idioma).
function showPageInstant(id) {
  pageOrder.forEach(p => getPage(p)?.classList.toggle('active', p === id));
  setActiveNav(id);
  currentPage = id;
  onPageShown(id);
}

function navigateTo(id, { push = true } = {}) {
  if (id === currentPage || !pageOrder.includes(id)) return;
  const leaving = currentPage;
  const outEl = getPage(leaving);
  const inEl  = getPage(id);
  const dir   = pageOrder.indexOf(id) > pageOrder.indexOf(leaving) ? 1 : -1;

  const started = flipPage(outEl, inEl, dir, () => {
    onPageHidden(leaving);
    inEl.scrollTop = 0;
    onPageShown(id);
    fadeIn(inEl);
    animateHeroTitle(id);
  });
  // Si ya hay un flip en curso se ignora el clic (antes el menú y el estado
  // quedaban apuntando a una página que nunca se mostraba).
  if (!started) return;

  setActiveNav(id);
  currentPage = id;
  if (push) history.pushState(null, '', `#${id}`);
}

window.addEventListener('popstate', () => navigateTo(pageFromHash(), { push: false }));

// Teclado: solo izquierda/derecha. Arriba/abajo quedan libres para hacer
// scroll dentro de páginas largas (antes cambiaban de página).
document.addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
  const idx = pageOrder.indexOf(currentPage);
  if (e.key === 'ArrowRight' && idx < pageOrder.length - 1) navigateTo(pageOrder[idx + 1]);
  if (e.key === 'ArrowLeft' && idx > 0) navigateTo(pageOrder[idx - 1]);
});

// ── Menú móvil ─────────────────────────────────────────────────────────────
// Los elementos se buscan cada vez: el DOM se reconstruye al cambiar de
// idioma y guardar referencias viejas rompía el cierre del menú.
function setMobileMenu(open) {
  const hamburger = document.getElementById('hamburger');
  hamburger?.classList.toggle('open', open);
  hamburger?.setAttribute('aria-expanded', String(open));
  document.getElementById('mobile-nav-menu')?.classList.toggle('open', open);
}

// ── Videos (carga diferida de YouTube) ─────────────────────────────────────
function playVideo(poster) {
  const wrap = poster.closest('.game-video-wrap');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${poster.dataset.yt}?autoplay=1&rel=0&modestbranding=1`;
  iframe.title = wrap.dataset.name;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  wrap.replaceChildren(iframe);
}

// Al salir de la página de proyectos se detienen los videos.
function resetVideos() {
  document.querySelectorAll('.game-video-wrap').forEach(wrap => {
    if (wrap.querySelector('iframe')) wrap.innerHTML = buildVideoPoster(wrap.dataset.yt, wrap.dataset.name);
  });
}

// ── Clics (delegación: sobrevive a las reconstrucciones del DOM) ──────────
document.addEventListener('click', e => {
  const pageLink = e.target.closest('[data-page]');
  if (pageLink) {
    e.preventDefault();
    navigateTo(pageLink.dataset.page);
    setMobileMenu(false);
    return;
  }
  if (e.target.closest('.lang-btn')) {
    switchLanguage();
    return;
  }
  if (e.target.closest('#hamburger')) {
    setMobileMenu(!document.getElementById('mobile-nav-menu')?.classList.contains('open'));
    return;
  }
  const poster = e.target.closest('.video-poster');
  if (poster) playVideo(poster);
});

// ── Cambio de idioma ───────────────────────────────────────────────────────
let switching = false;

async function switchLanguage() {
  if (switching) return;
  switching = true;
  try {
    if (currentLang === 'es') {
      if (!enTexts) enTexts = await getTranslations();
      currentLang = 'en';
      rebuildPages(enTexts);
    } else {
      currentLang = 'es';
      rebuildPages(es);
    }
  } finally {
    switching = false;
  }
}

function rebuildPages(texts) {
  const focusedId = document.activeElement?.id;

  // Libera renderers, RAF loops, listeners y animaciones de TODAS las
  // escenas vivas (bg, hero, tarjetas) antes de tirar el DOM viejo.
  disposeAllScenes();
  buildApp(texts);
  initScenes();
  showPageInstant(currentPage);

  // Devuelve el foco al botón de idioma (el anterior ya no existe).
  if (focusedId) document.getElementById(focusedId)?.focus();

  // Revela el texto del idioma nuevo con el slide de caracteres.
  revealPageText(currentPage);
  animateHeroTitle(currentPage);
}

// ── Arranque ───────────────────────────────────────────────────────────────
buildApp(es);
initScenes();
showPageInstant(currentPage);

gsap.fromTo('.spine', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
gsap.fromTo(getPage(currentPage), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'power3.out' });
// La palabra dorada del título entra letra por letra (Anime.js) mientras
// el resto del bloque hace fade/slide con GSAP.
animateHeroTitle(currentPage);

// Pre-cargar traducciones
getTranslations().then(texts => { enTexts = texts; });
