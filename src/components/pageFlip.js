import { gsap } from 'gsap';
import { animate, stagger, utils } from 'animejs';
import { prefersReducedMotion } from '../utils/motion.js';

let isFlipping = false;

// Devuelve false si ya había un flip en curso (y no se hizo nada).
export function flipPage(outEl, inEl, direction = 1, onMid) {
  if (isFlipping) return false;

  if (prefersReducedMotion) {
    outEl.classList.remove('active');
    if (onMid) onMid();
    inEl.classList.add('active');
    return true;
  }

  isFlipping = true;

  const tl = gsap.timeline({
    onComplete: () => { isFlipping = false; }
  });

  // Animate out: rotate like a page flip
  tl.to(outEl, {
    rotateY: direction * -90,
    opacity: 0,
    duration: 0.35,
    ease: 'power2.in',
    transformOrigin: 'left center',
    onComplete: () => {
      outEl.classList.remove('active');
      outEl.style.transform = '';
      outEl.style.opacity = '';
      if (onMid) onMid();
      // Prep in-page
      gsap.set(inEl, { rotateY: direction * 90, opacity: 0, transformOrigin: 'left center' });
      inEl.classList.add('active');
    }
  })
  .to(inEl, {
    rotateY: 0,
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
  });

  return true;
}

export function fadeIn(el) {
  if (prefersReducedMotion) return;
  gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
}

// Entrada en cascada para grillas de tarjetas (modelos, proyectos, etc).
// Se le pasa un selector o NodeList de los elementos ya presentes en el DOM.
export function staggerReveal(target, { delay = 0 } = {}) {
  const els = typeof target === 'string' ? document.querySelectorAll(target) : target;
  if (!els || !els.length) return;
  utils.remove(els);
  if (prefersReducedMotion) {
    utils.set(els, { opacity: 1, translateY: 0 });
    return;
  }
  animate(els, {
    opacity: [0, 1],
    translateY: [18, 0],
    duration: 600,
    ease: 'outQuad',
    delay: stagger(60, { start: delay }),
  });
}
