// ── Textos bilingües ────────────────────────────────────────────────────────
// Cualquier texto puede ser un string simple (igual en ambos idiomas) o un
// objeto { es, en }. Usa loc(valor, idioma) para obtener el texto correcto.
export function loc(value, lang = 'es') {
  if (value == null || typeof value === 'string') return value;
  return value[lang] ?? value.es;
}

// ── HABILIDADES ─────────────────────────────────────────────────────────────
// Agrupadas por área. Se muestran como etiquetas (sin porcentajes).
export const skillGroups = [
  {
    title: { es: 'Arte 3D & diseño', en: '3D art & design' },
    items: ['Blender', 'ZBrush', 'Hard-Surface', { es: 'Impresión 3D', en: '3D printing' }, 'Photoshop', 'Illustrator'],
  },
  {
    title: { es: 'Videojuegos & XR', en: 'Games & XR' },
    items: ['Unity', 'C#', { es: 'Realidad virtual', en: 'Virtual reality' }, { es: 'Realidad mixta', en: 'Mixed reality' }, 'HoloLens 2', 'Vuforia'],
  },
  {
    title: { es: 'Desarrollo de software', en: 'Software development' },
    items: ['Laravel', 'PHP', 'React', 'React Native', 'Python', 'Java'],
  },
  {
    title: { es: 'Otros', en: 'Other' },
    items: [{ es: 'Diseño UI / web', en: 'UI / web design' }, { es: 'Herramientas de IA', en: 'AI tools' }],
  },
];

// ── MODELOS 3D ──────────────────────────────────────────────────────────────
// Para agregar un modelo nuevo:
// 1. Pon el archivo .glb en: public/models/
// 2. Agrega un bloque nuevo aquí con los datos del modelo
// Parámetro scale: >1 más grande, <1 más pequeño (por defecto 1.0)
// ────────────────────────────────────────────────────────────────────────────
export const models3d = [
  {
    id: 'Razor',
    name: 'Razor Crest',
    desc: {
      es: 'Fan art de la nave Razor Crest de Star Wars, modelada en hard-surface y preparada para impresión 3D.',
      en: 'Fan art of the Razor Crest ship from Star Wars, hard-surface modeled and prepared for 3D printing.',
    },
    image: '/images/razor-crest.png',  // ← screenshot del modelo
    tags: ['Blender', 'Cel Shading', 'Hard-Surface', { es: 'Impresión 3D', en: '3D printing' }],
    file: 'Razor_Crest_opt.glb',
    basePath: '/models/',
    color: '#5DDDD8',
    geometry: 'sphere',
    scale: 0.85,
    baseSize: 6.0,
    scaleAxis: 'y',
    cameraY: 0.5,
    platformScale: 0.8,  // ← tamaño de la plataforma (default 1.0)
    colorMap: {
      'Azul claro':  { color: 0x8f8b8b, roughness: 0.75, emissive: null },
      'Gris oscuro': { color: 0x292d33, roughness: 0.80, emissive: null },
      'Emision':     { color: 0x111111, roughness: 0.40, emissive: 0x111111 },
    },
  },

  {
    id: 'Droid_B1',
    name: { es: 'Droide de batalla B1', en: 'B1 Battle Droid' },
    desc: {
      es: 'Droide de batalla B1 de Star Wars con su arma, modelado como personaje listo para impresión 3D.',
      en: 'B1 battle droid from Star Wars with its blaster, modeled as a character ready for 3D printing.',
    },
    image: '/images/droide-b1.png',  // ← screenshot del modelo
    tags: ['Blender', 'Cel Shading', 'Hard-Surface', { es: 'Impresión 3D', en: '3D printing' }, { es: 'Personaje', en: 'Character' }],
    file: 'Droide_B1_opt.glb',
    basePath: '/models/',
    color: '#5DDDD8',
    geometry: 'sphere',
    scale: 1.3,
    baseSize: 6.0,
    scaleAxis: 'y',
    cameraY: 0.5,
    platformScale: 0.9,  // ← tamaño de la plataforma (default 1.0)
    colorMap: {
      'Azul claro':  { color: 0xa9a862, roughness: 0.75, emissive: null },
      'Azul claro.001':  { color: 0xa9a862, roughness: 0.75, emissive: null },
      'Azul oscuroo': { color: 0x434a52, roughness: 0.80, emissive: null },
      'Emision':     { color: 0x111111, roughness: 0.40, emissive: 0x111111 },
    },
  },
  {
    id: 'Robot_AT-TE',
    name: 'AT-TE',
    desc: {
      es: 'Caminante AT-TE de Star Wars, con piezas mecánicas detalladas en hard-surface para impresión 3D.',
      en: 'AT-TE walker from Star Wars, with detailed hard-surface mechanical parts for 3D printing.',
    },
    image: '/images/robot-atte.png',  // ← screenshot del modelo
    tags: ['Blender', 'Cel Shading', 'Hard-Surface', { es: 'Impresión 3D', en: '3D printing' }, { es: 'Vehículo', en: 'Vehicle' }],
    file: 'Robot_ATTE_opt.glb',
    basePath: '/models/',
    color: '#5DDDD8',
    geometry: 'sphere',
    scale: 0.6,
    baseSize: 6.0,
    scaleAxis: 'y',
    cameraY: 0.5,
    platformScale: 0.8,  // ← tamaño de la plataforma (default 1.0)
    colorMap: {
      'Azul claro':  { color: 0x908d8c, roughness: 0.75, emissive: null },
      'Azul oscuroo': { color: 0x464544, roughness: 0.80, emissive: null },
      'Emision':     { color: 0x111111, roughness: 0.40, emissive: 0x111111 },
    },
  },

  // ── Agrega tus modelos aquí abajo ──
  // {
  //   id: 'nombre-unico',
  //   name: 'Nombre del modelo',
  //   desc: { es: 'Descripción corta.', en: 'Short description.' },
  //   tags: ['Blender', { es: 'Impresión 3D', en: '3D printing' }],
  //   file: 'mi-modelo.glb',
  //   basePath: '/models/',
  //   color: '#C9A96E',
  //   geometry: 'sphere',
  //   scale: 1.0,   // >1 más grande, <1 más pequeño
  // },
];

// ── PROYECTOS (VIDEOJUEGOS / XR) ────────────────────────────────────────────
// Para agregar un proyecto nuevo:
// 1. Sube el gameplay a YouTube como "No listado"
// 2. Copia el ID del video (lo que va después de ?v= en la URL)
// 3. Agrega un bloque nuevo aquí
// ────────────────────────────────────────────────────────────────────────────
export const games = [
  {
    id: 'maintenance-cnc3018-mr',
    name: 'Maintenance — CNC 3018 MR',
    type: { es: 'Realidad mixta', en: 'Mixed reality' },
    desc: {
      es: 'Aplicación de realidad mixta para Microsoft HoloLens 2 que guía a un técnico paso a paso durante el mantenimiento preventivo de una máquina CNC 3018. Reconoce la máquina real con Vuforia Model Target, proyecta un holograma guía para alinear el visor, resalta en azul las piezas a intervenir en cada paso (varillas roscadas, rodamientos lineales, motor NEMA 17) y muestra paneles informativos al tocar cada componente.',
      en: 'Mixed reality application for Microsoft HoloLens 2 that guides a technician step by step through the preventive maintenance of a CNC 3018 machine. It recognizes the real machine with Vuforia Model Target, projects a guide hologram to align the headset, highlights in blue the parts to service at each step (threaded rods, linear bearings, NEMA 17 motor) and shows information panels when each component is tapped.',
    },
    tags: ['Unity', 'C#', 'HoloLens 2', 'Vuforia'],
    youtubeId: 'z_svGxR57iQ',
  },
  {
    id: 'quiz-interactivo-vr',
    name: { es: 'Quiz Interactivo — VR', en: 'Interactive Quiz — VR' },
    type: { es: 'Realidad virtual', en: 'Virtual reality' },
    desc: {
      es: 'Videojuego de realidad virtual con formato de cuestionario, en el que los jugadores responden preguntas a través de distintos minijuegos. Combina mecánicas educativas con una experiencia inmersiva para aprender de forma dinámica y entretenida. Desarrollado en Unity con contenido propio y recursos de la Unity Asset Store.',
      en: 'Virtual reality quiz game in which players answer questions through a variety of minigames. It combines educational mechanics with an immersive experience to make learning dynamic and fun. Built in Unity with original content and assets from the Unity Asset Store.',
    },
    tags: ['Unity', 'C#', 'VR'],
    youtubeId: '1-JZBwsOv3s',
  },
  {
    id: 'slenderman-vr',
    name: 'Slenderman — VR',
    type: { es: 'Realidad virtual', en: 'Virtual reality' },
    desc: {
      es: 'Videojuego de terror en realidad virtual inspirado en el creepypasta de Slenderman y en el juego original Slender: The Eight Pages. Desarrollado en Unity, combinando contenido propio con recursos de la Unity Asset Store.',
      en: 'Virtual reality horror game inspired by the Slenderman creepypasta and the original game Slender: The Eight Pages. Built in Unity, combining original content with assets from the Unity Asset Store.',
    },
    tags: ['Unity', 'C#', 'VR'],
    youtubeId: 'MYUGQbxZZvo',
  },

  // ── Agrega tus proyectos aquí abajo ──
  // {
  //   id: 'nombre-unico',
  //   name: 'Nombre del proyecto',
  //   type: { es: 'Realidad virtual', en: 'Virtual reality' },
  //   desc: { es: 'Descripción corta.', en: 'Short description.' },
  //   tags: ['Unity', 'C#'],
  //   youtubeId: 'ID_DEL_VIDEO',
  // },
];
