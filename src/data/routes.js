import { getRelativeLocaleUrl } from 'astro:i18n';

// Páginas del menú, en orden. `id` es la clave de textos en i18n (nav.*).
export const pages = [
  { id: 'home',    slug: '' },
  { id: 'dev',     slug: 'dev' },
  { id: 'xr',      slug: '3d-xr' },
  { id: 'about',   slug: 'about' },
  { id: 'contact', slug: 'contact' },
];

export const pageUrl = (lang, id) =>
  getRelativeLocaleUrl(lang, pages.find(p => p.id === id).slug);

