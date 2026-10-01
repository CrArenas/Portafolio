// ── Capa de animación de la interfaz (Anime.js) ────────────────────────────
// Todo lo de una página vive en un Scope: se crea en 'astro:page-load' y se
// revierte en 'astro:before-swap', así ninguna animación ni listener
// sobrevive a la página que lo creó. Con prefers-reduced-motion no se anima
// nada y el contenido queda tal cual en su sitio.
import {
  animate,
  createAnimatable,
  createDrawable,
  createScope,
  createTimeline,
  onScroll,
  scrambleText,
  splitText,
  stagger,
  utils,
} from 'animejs';

export function startMotion() {
  return createScope({
    mediaQueries: {
      reduce: '(prefers-reduced-motion: reduce)',
      finePointer: '(hover: hover) and (pointer: fine)',
    },
  }).add(self => {
    const { reduce, finePointer } = self.matches;
    if (reduce) return;
    const page = document.querySelector('.page');

    drawHeaderLine();
    revealTitle();
    rotateRole();
    revealOnScroll(page);
    if (finePointer) magnetize();
  });
}

// La línea dorada bajo el número de página se dibuja de izquierda a derecha.
function drawHeaderLine() {
  const line = document.querySelector('.page-header-line line');
  if (!line) return;
  animate(createDrawable(line), { draw: ['0 0', '0 1'], duration: 1400, ease: 'inOutQuart', delay: 150 });
}

// La palabra dorada del título entra letra por letra: cada carácter queda
// envuelto en un span con overflow oculto (wrap: 'clip') y sube a su sitio.
function revealTitle() {
  const span = document.querySelector('.page .section-title span');
  if (!span) return;
  const { chars } = splitText(span, { chars: { wrap: 'clip' } });
  animate(chars, {
    y: ['100%', '0%'],
    duration: 650,
    ease: 'out(3)',
    delay: stagger(22, { start: 250 }),
  });
}

// Inicio: el rol alterna entre las facetas con un efecto de texto cifrado.
function rotateRole() {
  const el = document.querySelector('.home-role');
  if (!el) return;
  const roles = JSON.parse(el.dataset.roles);
  const tl = createTimeline({ loop: true });
  // Recorre los roles y vuelve al primero para cerrar el ciclo
  [...roles.slice(1), roles[0]].forEach(text => {
    tl.add(el, {
      innerHTML: scrambleText({ text, chars: 'A-Z0-9#%_' }),
      duration: 900,
    }, '+=2400');
  });
}

// Tarjetas y bloques aparecen al entrar en pantalla. Se anima `translate`
// (no `transform`) para no pisar el efecto hover de las tarjetas.
const REVEAL = [
  '.stats-row .stat', '.home-latest .post-card',
  '.game-card', '.project-card', '.artstation-card',
  '.posts-list .post-card', '.post-facts',
  '.education-list li', '.skill-group',
  '.contact-item',
].join(', ');

function revealOnScroll(container) {
  const els = [...document.querySelectorAll(REVEAL)];
  utils.set(els, { opacity: 0, translate: '0px 28px' });
  els.forEach(el => {
    // Hermanos que entran juntos (una fila de tarjetas) se escalonan
    const index = [...el.parentElement.children].indexOf(el) % 3;
    animate(el, {
      opacity: [0, 1],
      translate: ['0px 28px', '0px 0px'],
      duration: 750,
      delay: index * 90,
      ease: 'out(3)',
      autoplay: onScroll({ container, enter: 'bottom-=40 top', repeat: false }),
    });
  });
}

// Botones e iconos sociales siguen levemente al cursor (solo con ratón).
// Los listeners mueren con los elementos: el menú y la página se reemplazan
// en cada navegación.
function magnetize() {
  document.querySelectorAll('.btn, .social-link, .lang-btn').forEach(el => {
    const pull = el.classList.contains('btn') ? 0.18 : 0.3;
    const magnet = createAnimatable(el, { x: 350, y: 350, ease: 'out(3)' });
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      magnet.x((e.clientX - r.left - r.width / 2) * pull);
      magnet.y((e.clientY - r.top - r.height / 2) * pull);
    };
    const onLeave = () => { magnet.x(0); magnet.y(0); };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
  });
}
