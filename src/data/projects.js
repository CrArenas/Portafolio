export const projects = [
  {
    id: 'nexus-vr',
    name: 'Nexus VR',
    desc: 'Entorno de colaboración en realidad virtual para equipos distribuidos globalmente.',
    tags: ['WebXR', 'Three.js', 'WebSockets'],
    type: 'VR',
    color: '#4A90D9',
    geometry: 'torus',
  },
  {
    id: 'void-arch',
    name: 'Void Architecture',
    desc: 'Visualizador arquitectónico 3D con recorridos inmersivos en tiempo real.',
    tags: ['Three.js', 'GLSL', 'Blender'],
    type: '3D',
    color: '#C9A96E',
    geometry: 'box',
  },
  {
    id: 'echo-space',
    name: 'Echo Space',
    desc: 'Instalación de arte generativo que reacciona al sonido ambiente en VR.',
    tags: ['WebAudio', 'WebXR', 'GSAP'],
    type: 'VR',
    color: '#9B59B6',
    geometry: 'sphere',
  },
  {
    id: 'terra-map',
    name: 'Terra Map',
    desc: 'Globo terráqueo interactivo con datos geoespaciales en tiempo real.',
    tags: ['Three.js', 'D3.js', 'WebGL'],
    type: '3D',
    color: '#2ECC71',
    geometry: 'sphere',
  },
];

export const skills = [
  { name: 'Modelado 3D — Blender & ZBrush', pct: 85 },
  { name: 'Desarrollo de videojuegos — Unity', pct: 70 },
  { name: 'Diseño gráfico — Photoshop & Illustrator', pct: 80 },
  { name: 'Desarrollo web — Laravel & PHP', pct: 75 },
  { name: 'Programación — Python & Java', pct: 72 },
  { name: 'Diseño de páginas web', pct: 78 },
  { name: 'Manejo de herramientas de inteligencia artificial', pct: 75 },
];

// ── MODELOS 3D ──────────────────────────────────────────────────────────────
// Para agregar un modelo nuevo:
// 1. Pon el archivo .glb en: public/models/modelos-3d/
// 2. Copia y pega un bloque nuevo aquí con los datos del modelo
// ────────────────────────────────────────────────────────────────────────────
export const models3d = [
  {
    id: 'jerry',
    name: 'Jerry',
    desc: 'Personaje robot estilo cartoon. Mascota del portafolio.',
    tags: ['Blender', 'Cell Shading', 'Personaje', 'Impresión 3D'],
    file: 'Perro_Cartoon_texturizado.glb',
    basePath: '/models/',
    color: '#5DDDD8',
    geometry: 'sphere',
    colorMap: {
      'Azul claro':   { color: 0xa6afb8, roughness: 0.75, emissive: null },
      'Azul claroo':  { color: 0x68abbe, roughness: 0.75, emissive: null },
      'Azul oscuroo': { color: 0x333940, roughness: 0.80, emissive: null },
      'Negro':        { color: 0x111111, roughness: 0.90, emissive: null },
      'Emision':      { color: 0x111111, roughness: 0.40, emissive: 0x111111 },
    },
  },

  // ── Agrega tus modelos aquí abajo ──
  // {
  //   id: 'nombre-unico',
  //   name: 'Nombre del modelo',
  //   desc: 'Descripción corta del modelo.',
  //   tags: ['Blender', 'Impresión 3D'],
  //   file: 'mi-modelo.glb',
  //   basePath: '/models/modelos-3d/',
  //   color: '#C9A96E',
  //   geometry: 'sphere',   // fallback si no carga: 'sphere', 'box' o 'torus'
  // },
];

// ── VIDEOJUEGOS ─────────────────────────────────────────────────────────────
// Para agregar un juego nuevo:
// 1. Sube el gameplay a YouTube como "No listado"
// 2. Copia el ID del video (lo que va después de ?v= en la URL)
// 3. Agrega un bloque nuevo aquí
// ────────────────────────────────────────────────────────────────────────────
export const games = [
  {
    id: 'slenderman-vr',
    name: 'Slenderman - VR',
    desc: 'Un videojuego de realidad virtual inspirado en el clásico creepypasta de Slenderman y basado en el videojuego original Slender: The Eight Pages. El proyecto fue desarrollado en Unity, combinando contenido propio con diversos recursos y assets provenientes de la Unity Asset Store.',
    tags: ['Unity', 'C#', 'VR'],
    youtubeId: 'MYUGQbxZZvo',
  },

  // ── Agrega tus juegos aquí abajo ──
  // {
  //   id: 'nombre-unico',
  //   name: 'Nombre del juego',
  //   desc: 'Descripción corta.',
  //   tags: ['Unity', 'C#'],
  //   youtubeId: 'ID_DEL_VIDEO',
  // },
];