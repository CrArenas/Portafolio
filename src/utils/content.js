import { getCollection } from 'astro:content';
import { locales } from '../data/i18n.js';

// getCollection() no garantiza el orden del archivo: se ordena por `order`.
export async function getOrdered(name) {
  return (await getCollection(name)).sort((a, b) => a.data.order - b.data.order);
}

// ── Artículos de desarrollo ────────────────────────────────────────────────
// El id de cada entrada es "<idioma>/<slug>" (ver colección "dev").
export const postLang = (post) => post.id.split('/')[0];
export const postSlug = (post) => post.id.split('/').slice(1).join('/');

// Artículos publicados, del más reciente al más antiguo. Los borradores
// (draft: true) solo se ven con `npm run dev`.
export async function getPosts(lang) {
  const posts = await getCollection('dev', p =>
    postLang(p) === lang && (import.meta.env.DEV || !p.data.draft));
  return posts.sort((a, b) => b.data.date - a.data.date);
}

// Rutas de todos los artículos. Falla el build si a alguno le falta su
// traducción: el botón ES/EN de un artículo siempre debe tener destino.
export async function getPostPaths() {
  const posts = await getCollection('dev');
  const slugs = new Set(posts.map(postSlug));
  for (const slug of slugs) {
    const missing = locales.filter(l => !posts.some(p => p.id === `${l}/${slug}`));
    if (missing.length) {
      throw new Error(`El artículo "${slug}" no tiene versión en: ${missing.join(', ')} (src/content/dev/${missing[0]}/${slug}.mdx)`);
    }
  }
  return posts
    .filter(p => import.meta.env.DEV || !p.data.draft)
    .map(post => ({ params: { lang: postLang(post), slug: postSlug(post) }, props: { post } }));
}
