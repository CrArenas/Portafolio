// ── Comportamiento del lado del cliente ────────────────────────────────────
// Este módulo se ejecuta una sola vez: con <ClientRouter /> la navegación no
// recarga la página, así que el trabajo por página se hace en 'astro:page-load'
// (dispara también en la carga inicial) y se limpia en 'astro:before-swap'.
import { initBgScene } from '../scenes/bgScene.js';
import { initHeroScene } from '../scenes/heroScene.js';
import { initCardScene } from '../scenes/cardScene.js';
import { startMotion, filterPosts } from './motion.js';

// ── Detectar Safari móvil ──────────────────────────────────────────────────
const isMobileSafari =
  /iP(hone|od|ad)/.test(navigator.userAgent) ||
  (navigator.userAgent.includes('Safari') &&
   !navigator.userAgent.includes('Chrome') &&
   window.innerWidth < 768);

// ── Ciclo de vida de las escenas Three.js ─────────────────────────────────
// Cada escena usa su propio contexto WebGL y los navegadores limitan cuántos
// pueden estar activos a la vez (en móviles o GPUs modestas son pocos). Al
// pasarse del límite el navegador "mata" el contexto más antiguo y ese
// canvas queda en blanco para siempre. Por eso:
//  · la malla de Inicio y los modelos 3D solo existen mientras su página
//    está visible (se liberan en 'astro:before-swap'),
//  · cada escena se monta en un canvas nuevo y, si aun así pierde el
//    contexto, se vuelve a crear automáticamente.
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

// Las partículas de fondo viven en un canvas con transition:persist: se
// montan una vez y sobreviven a la navegación.
let bgMounted = false;
function startBackground() {
  if (bgMounted || isMobileSafari) return;
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  mountScene(canvas, initBgScene);
  bgMounted = true;
}

// Escenas de la página actual (hero, tarjetas): se liberan al salir.
const pageCleanups = [];

function startPageScenes() {
  const hero = document.getElementById('hero-canvas');
  if (hero) pageCleanups.push(mountScene(hero, initHeroScene));

  const cards = document.querySelectorAll('.card-canvas');
  if (!cards.length) return;

  // Cada modelo se crea cuando su tarjeta se acerca a la pantalla, así no
  // se descargan ni se abren contextos WebGL de tarjetas que nadie ve.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      startCard(target);
    });
  }, { rootMargin: '200px' });
  cards.forEach(canvas => observer.observe(canvas));
  pageCleanups.push(() => observer.disconnect());
}

function startCard(canvas) {
  const model = JSON.parse(canvas.dataset.model);
  const thumb = canvas.closest('.project-thumb');
  const onLoad = () => thumb.classList.add('is-loaded');
  if (isMobileSafari) {
    drawStaticPlaceholder(canvas, model);
    onLoad();
    return;
  }
  const onProgress = (ratio) => thumb.style.setProperty('--progress', ratio);
  pageCleanups.push(mountScene(canvas, c => initCardScene(c, model, { onProgress, onLoad })));
}

function stopPageScenes() {
  pageCleanups.splice(0).forEach(cleanup => cleanup());
}

// ── Placeholder 2D para Safari móvil ──────────────────────────────────────
function drawStaticPlaceholder(canvas, item) {
  const w = canvas.clientWidth  || 300;
  const h = canvas.clientHeight || 300;
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  // Si tiene imagen estática, usarla
  if (item.image) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, w, h);
    img.onerror = () => drawCirclePlaceholder(ctx, w, h, item);
    img.src = item.image;
    return;
  }
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
  ctx.fillText(name, w / 2, h / 2 + radius * 0.52);

  // Label
  ctx.fillStyle = '#C9A96E';
  ctx.font = `${Math.floor(w * 0.038)}px monospace`;
  ctx.fillText('3D MODEL', w / 2, h / 2 + radius * 0.88);
}

// ── Menú móvil ─────────────────────────────────────────────────────────────
function setMobileMenu(open) {
  const hamburger = document.getElementById('hamburger');
  hamburger?.classList.toggle('open', open);
  hamburger?.setAttribute('aria-expanded', String(open));
  document.getElementById('mobile-nav-menu')?.classList.toggle('open', open);
}

// ── Videos (carga diferida de YouTube) ─────────────────────────────────────
function playVideo(poster) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${poster.dataset.yt}?autoplay=1&rel=0&modestbranding=1`;
  iframe.title = poster.dataset.title;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  poster.replaceWith(iframe);
}

// ── Filtro de artículos por tecnología (página Desarrollo) ────────────────
// El filtro activo queda en la URL (?tag=Astro) para poder compartirlo.
function applyPostFilter(tag, { animated = false } = {}) {
  const chips = document.querySelectorAll('.filter-chip');
  if (!chips.length) return;
  const known = [...chips].some(c => c.dataset.filter === tag);
  const active = known ? tag : '';
  chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filter === active)));
  const apply = () => document.querySelectorAll('.posts-list .post-card').forEach(card => {
    card.hidden = active !== '' && !JSON.parse(card.dataset.stack).includes(active);
  });
  if (animated) filterPosts(apply);
  else apply();
  const url = new URL(location.href);
  if (active) url.searchParams.set('tag', active);
  else url.searchParams.delete('tag');
  history.replaceState(history.state, '', url);
}

// ── Eventos (delegación: sobrevive a los cambios de página) ───────────────
document.addEventListener('click', e => {
  if (e.target.closest('#hamburger')) {
    setMobileMenu(!document.getElementById('mobile-nav-menu')?.classList.contains('open'));
    return;
  }
  const poster = e.target.closest('.video-poster');
  if (poster) {
    playVideo(poster);
    return;
  }
  const chip = e.target.closest('.filter-chip');
  if (chip) applyPostFilter(chip.dataset.filter, { animated: true });
});

let motionScope = null;

document.addEventListener('astro:page-load', () => {
  startBackground();
  startPageScenes();
  // El filtro inicial (?tag=) se aplica antes de animar nada
  applyPostFilter(new URLSearchParams(location.search).get('tag') ?? '');
  motionScope = startMotion();
});

document.addEventListener('astro:before-swap', () => {
  stopPageScenes();
  motionScope?.revert();
  motionScope = null;
});
