// Nota: los títulos (title) aceptan HTML — la palabra dentro de <span> se
// pinta en dorado y es la que se anima letra por letra.

// ── ESPAÑOL (fuente de verdad) ───────────────────────────────────────────────
export const es = {
  lang: 'es',
  docTitle: 'Cristian Arenas — Desarrollador de software · 3D & XR',
  metaDescription: 'Portafolio de Cristian A. Arenas: desarrollador de software web, móvil y fullstack (Laravel, React, React Native) con experiencia en 3D, videojuegos y realidad virtual y mixta.',
  langAria: 'Switch to English',
  nav: {
    home:    'Inicio',
    dev:     'Desarrollo',
    xr:      '3D & XR',
    about:   'Sobre mí',
    contact: 'Contacto',
  },
  spine: {
    role:     'Software · 3D & XR',
    subtitle: 'Portafolio interactivo',
  },
  home: {
    eyebrow:      'Hola, soy Cristian Arenas',
    roles:        ['Desarrollador fullstack', 'Artista 3D', 'Desarrollador XR'],
    title:        'Desarrollo software web, móvil <span>e inmersivo</span>',
    body:         'Soy desarrollador de software y técnico en modelado 3D y videojuegos. Construyo aplicaciones web y móviles con Laravel, React y React Native, y experiencias de realidad virtual y mixta con Unity. Aquí encontrarás mis proyectos de desarrollo contados desde adentro y mi trabajo en 3D y XR.',
    canvasHint:      'Mueve el cursor sobre la malla · haz clic para crear ondas',
    canvasHintTouch: 'Toca la malla para crear ondas',
  },
  about: {
    eyebrow: 'Perfil',
    title:   'Sobre <span>mí</span>',
    body: [
      'Soy desarrollador de software y estudiante de Administración de Sistemas Informáticos. He construido aplicaciones web y móviles con Laravel, React y React Native, y experiencias de realidad virtual y mixta con Unity y C#, como una guía de mantenimiento para HoloLens 2 que reconoce la máquina real con Vuforia.',
      'Vengo del modelado 3D: como técnico en Modelado 3D y Desarrollo de Videojuegos he creado modelos listos para producción para empresas de impresión 3D, con Blender y ZBrush. Esa mezcla es mi diferencial: me importa que lo que construyo se vea y se sienta bien, no solo que funcione.',
      'Busco roles de desarrollo fullstack, frontend o móvil, y proyectos de realidad virtual y mixta con Unity, donde pueda aportar desde el código y el diseño de interfaces.',
    ],
    educationLabel: 'Formación',
    education: [
      { title: 'Administración de Sistemas Informáticos', note: 'En curso' },
      { title: 'Técnico en Modelado 3D y Desarrollo de Videojuegos' },
    ],
    skillsLabel: 'Herramientas & tecnologías',
  },
  dev: {
    eyebrow:     'Software',
    title:       'Desarrollo <span>de software</span>',
    body:        'Proyectos web, móviles y fullstack contados desde adentro: el problema, las decisiones técnicas, el código que importa y lo que aprendí en el camino.',
    techLabel:   'Tecnologías usadas en estos proyectos',
    empty:       'Pronto habrá artículos aquí.',
    back:        'Volver a Desarrollo',
    role:        'Rol',
    stack:       'Stack',
    links:       'Enlaces',
    repo:        'Repositorio',
    demo:        'Demo',
    draft:       'Borrador',
  },
  xr: {
    eyebrow:         'Arte 3D & XR',
    title:           'Mundos <span>inmersivos</span>',
    body:            'Videojuegos y aplicaciones de realidad virtual y mixta desarrollados en Unity, y modelos 3D creados en Blender y ZBrush, desde personajes hasta piezas para impresión 3D.',
    projectsLabel:   'Videojuegos & XR',
    play:            'Reproducir video',
    modelsLabel:     'Modelos 3D',
    modelsHint:      'Arrastra cualquier modelo para rotarlo.',
    dragHint:        'Arrastra para rotar',
    loading:         'Cargando modelo',
    artStationLabel: 'Más de mis modelos 3D en',
  },
  contact: {
    eyebrow:         'Hablemos',
    title:           'Trabajemos <span>juntos</span>',
    body:            '¿Tienes un proyecto en mente o una oportunidad laboral? Estoy disponible para roles y proyectos de desarrollo web, móvil y fullstack, y para colaboraciones en 3D, videojuegos y realidad virtual o mixta. La forma más rápida de hablar conmigo es LinkedIn.',
    linkedinValue:   'Cristian A. Arenas',
    artstationValue: 'Portafolio de modelos 3D',
    githubValue:     'CrArenas',
  },
};

// ── INGLÉS (pre-traducido) ───────────────────────────────────────────────────
export const en = {
  lang: 'en',
  docTitle: 'Cristian Arenas — Software Developer · 3D & XR',
  metaDescription: 'Portfolio of Cristian A. Arenas: web, mobile and fullstack software developer (Laravel, React, React Native) with experience in 3D, video games and virtual and mixed reality.',
  langAria: 'Cambiar a español',
  nav: {
    home:    'Home',
    dev:     'Development',
    xr:      '3D & XR',
    about:   'About me',
    contact: 'Contact',
  },
  spine: {
    role:     'Software · 3D & XR',
    subtitle: 'Interactive portfolio',
  },
  home: {
    eyebrow:      'Hi, I\'m Cristian Arenas',
    roles:        ['Fullstack developer', '3D artist', 'XR developer'],
    title:        'I build web, mobile <span>and immersive</span> software',
    body:         'I am a software developer and a 3D modeling and video game technician. I build web and mobile applications with Laravel, React and React Native, and virtual and mixed reality experiences with Unity. Here you will find my development projects told from the inside and my work in 3D and XR.',
    canvasHint:      'Move your cursor over the grid · click to make waves',
    canvasHintTouch: 'Tap the grid to make waves',
  },
  about: {
    eyebrow: 'Profile',
    title:   'About <span>me</span>',
    body: [
      'I am a software developer and a Computer Systems Administration student. I have built web and mobile applications with Laravel, React and React Native, and virtual and mixed reality experiences with Unity and C#, such as a maintenance guide for HoloLens 2 that recognizes the real machine with Vuforia.',
      'I come from 3D modeling: as a 3D Modeling and Video Game Development technician I have created production-ready models for 3D printing companies with Blender and ZBrush. That mix is what sets me apart: I care that what I build looks and feels right, not just that it works.',
      'I am looking for fullstack, frontend or mobile development roles, and virtual and mixed reality projects with Unity, where I can contribute through both code and interface design.',
    ],
    educationLabel: 'Education',
    education: [
      { title: 'Computer Systems Administration', note: 'In progress' },
      { title: '3D Modeling and Video Game Development Technician' },
    ],
    skillsLabel: 'Tools & technologies',
  },
  dev: {
    eyebrow:     'Software',
    title:       'Software <span>development</span>',
    body:        'Web, mobile and fullstack projects told from the inside: the problem, the technical decisions, the code that matters and what I learned along the way.',
    techLabel:   'Technologies used in these projects',
    empty:       'Articles coming soon.',
    back:        'Back to Development',
    role:        'Role',
    stack:       'Stack',
    links:       'Links',
    repo:        'Repository',
    demo:        'Demo',
    draft:       'Draft',
  },
  xr: {
    eyebrow:         '3D art & XR',
    title:           'Immersive <span>worlds</span>',
    body:            'Virtual and mixed reality games and applications built in Unity, and 3D models created in Blender and ZBrush, from characters to 3D printing pieces.',
    projectsLabel:   'Games & XR',
    play:            'Play video',
    modelsLabel:     '3D models',
    modelsHint:      'Drag any model to rotate it.',
    dragHint:        'Drag to rotate',
    loading:         'Loading model',
    artStationLabel: 'More of my 3D models on',
  },
  contact: {
    eyebrow:         'Let\'s talk',
    title:           'Let\'s work <span>together</span>',
    body:            'Have a project in mind or a job opportunity? I am available for web, mobile and fullstack development roles and projects, and for collaborations in 3D, video games and virtual or mixed reality. The fastest way to reach me is LinkedIn.',
    linkedinValue:   'Cristian A. Arenas',
    artstationValue: '3D models portfolio',
    githubValue:     'CrArenas',
  },
};

// ── Textos bilingües en los datos ────────────────────────────────────────────
// Cualquier texto puede ser un string simple (igual en ambos idiomas) o un
// objeto { es, en }. Usa loc(valor, idioma) para obtener el texto correcto.
export function loc(value, lang = 'es') {
  if (value == null || typeof value === 'string') return value;
  return value[lang] ?? value.es;
}

// ── Idiomas del sitio ────────────────────────────────────────────────────────
// Cada ruta existe en /es/... y /en/... (ver i18n en astro.config.mjs).
export const ui = { es, en };
export const locales = Object.keys(ui);

// Fechas de los artículos, ej. "30 de septiembre de 2026"
export const formatDate = (date, lang) =>
  new Intl.DateTimeFormat(lang === 'es' ? 'es-CO' : 'en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(date);

// getStaticPaths compartido por todas las páginas de src/pages/[lang]/
export const langPaths = () => locales.map(lang => ({ params: { lang } }));
