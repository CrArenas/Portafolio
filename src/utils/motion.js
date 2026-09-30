// ── Utilidades compartidas de animación ────────────────────────────────────

// Respeta la preferencia del sistema/usuario de reducir movimiento.
// Se usa para poner duration:0 (o desactivar loops) en vez de animar.
export const prefersReducedMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
