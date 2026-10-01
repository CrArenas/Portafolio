import { getRelativeLocaleUrl } from 'astro:i18n';

// Páginas del menú, en orden. `id` es la clave de textos en i18n (nav.*).
export const pages = [
  { id: 'home',    slug: '' },
  { id: 'dev',     slug: 'dev' },
  { id: 'xr',      slug: '3d-xr' },
  { id: 'about',   slug: 'about' },
  { id: 'contact', slug: 'contact' },
].map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }));

export const pageUrl = (lang, id) =>
  getRelativeLocaleUrl(lang, pages.find(p => p.id === id).slug);

