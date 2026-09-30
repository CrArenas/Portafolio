import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // URL pública: la usan el sitemap, el RSS y las etiquetas og:image/og:url
  site: 'https://portfolio-3d-ca.vercel.app',
  prefetch: true,
  devToolbar: { enabled: false },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-CO', en: 'en-US' } },
      // La raíz solo redirige a /es/
      filter: (page) => new URL(page).pathname !== '/',
    }),
  ],
  markdown: {
    // Resaltado de código de los artículos (se genera al compilar)
    shikiConfig: { theme: 'tokyo-night' },
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: true,
    },
  },
});