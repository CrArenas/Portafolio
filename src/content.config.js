import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';

// Texto igual en ambos idiomas ("Blender") o traducido ({ es, en }).
// Se resuelve con loc() de src/data/i18n.js.
const localized = z.union([z.string(), z.object({ es: z.string(), en: z.string() })]);

// Modelos 3D interactivos (src/data/models.yaml)
const models = defineCollection({
  loader: file('src/data/models.yaml'),
  schema: z.object({
    order: z.number(),                // posición en la página
    name: localized,
    desc: localized,
    tags: z.array(localized),
    file: z.string(),                 // ruta pública del .glb, ej. /models/x.glb
    image: z.string().optional(),     // captura para Safari móvil (sin WebGL)
    color: z.string().default('#5DDDD8'),
    scale: z.number().default(1),     // >1 más grande, <1 más pequeño
    baseSize: z.number().default(1.8),
    scaleAxis: z.enum(['y', 'max']).default('max'),
    cameraY: z.number().default(0),
    platformScale: z.number().default(1),
    // Colores por nombre de material del .glb
    colorMap: z.record(z.string(), z.object({
      color: z.string(),
      roughness: z.number().default(0.8),
      emissive: z.string().optional(),
    })).default({}),
  }),
});

// Proyectos de videojuegos y XR (src/data/xr.yaml)
const xr = defineCollection({
  loader: file('src/data/xr.yaml'),
  schema: z.object({
    order: z.number(),                // posición en la página
    name: localized,
    type: localized,
    desc: localized,
    tags: z.array(localized),
    youtubeId: z.string(),
  }),
});

// Artículos de desarrollo de software (src/content/dev/<idioma>/<slug>.mdx)
// Cada artículo existe en ambos idiomas con el mismo nombre de archivo.
// Los archivos que empiezan por "_" (como la plantilla) se ignoran.
const dev = defineCollection({
  loader: glob({ pattern: '*/[^_]*.{md,mdx}', base: './src/content/dev' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    stack: z.array(z.string()),
    role: z.string(),
    cover: image().optional(),        // imagen de la tarjeta (ruta relativa al .mdx)
    repo: z.url().optional(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { models, xr, dev };
