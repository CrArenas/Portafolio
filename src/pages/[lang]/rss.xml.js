import rss from '@astrojs/rss';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { ui, langPaths } from '../../data/i18n.js';
import { getPosts, postSlug } from '../../utils/content.js';

// Feed RSS de los artículos de Desarrollo: /es/rss.xml y /en/rss.xml
export const getStaticPaths = langPaths;

export async function GET({ params, site }) {
  const { lang } = params;
  const t = ui[lang];
  const posts = await getPosts(lang);
  return rss({
    title: `Cristian Arenas — ${t.nav.dev}`,
    description: t.dev.body,
    site,
    customData: `<language>${lang === 'es' ? 'es-co' : 'en-us'}</language>`,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      categories: post.data.stack,
      link: getRelativeLocaleUrl(lang, `dev/${postSlug(post)}`),
    })),
  });
}
