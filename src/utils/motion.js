// ── Utilidades compartidas de animación (Anime.js) ─────────────────────────
import { createSpring } from 'animejs';

// Respeta la preferencia del sistema/usuario de reducir movimiento.
// Se usa para poner duration:0 (o desactivar loops) en vez de animar.
export const prefersReducedMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Envuelve una duración: si el usuario pidió reducir movimiento, la anulamos.
export function dur(ms) {
  return prefersReducedMotion ? 0 : ms;
}

// Ease "spring" reutilizable para micro-interacciones (hover, entradas).
export const softSpring = createSpring({ mass: 1, stiffness: 120, damping: 14 });
