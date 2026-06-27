import { gsap } from 'gsap';

let isFlipping = false;

export function flipPage(outEl, inEl, direction = 1, onMid) {
  if (isFlipping) return;
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
}

export function fadeIn(el) {
  gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
}

export function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const target = bar.dataset.pct;
    gsap.to(bar, { width: target + '%', duration: 1.2, ease: 'power2.out', delay: 0.1 });
  });
}
