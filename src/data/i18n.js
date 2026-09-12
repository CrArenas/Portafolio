// ── VERSIÓN ─────────────────────────────────────────────────────────────────
// Incrementa este número cada vez que agregues textos nuevos
export const I18N_VERSION = '3.0';

// Nota: los títulos (title) aceptan HTML — la palabra dentro de <span> se
// pinta en dorado y es la que se anima letra por letra.

// ── ESPAÑOL (fuente de verdad) ───────────────────────────────────────────────
export const es = {
  lang: 'es',
  docTitle: 'Cristian Arenas — Artista 3D & Desarrollador XR',
  langAria: 'Switch to English',
  nav: {
    home:    'Inicio',
    about:   'Sobre mí',
    models:  'Modelos 3D',
    games:   'Proyectos',
    contact: 'Contacto',
  },
  spine: {
    role:     'Artista 3D · Desarrollador XR',
    subtitle: 'Portafolio interactivo',
  },
  home: {
    eyebrow:      'Hola, soy Cristian Arenas',
    title:        'Arte 3D y experiencias <span>inmersivas</span>',
    body:         'Soy desarrollador de videojuegos y artista 3D. Creo modelos para impresión 3D, experiencias de realidad virtual y mixta, y aplicaciones web y móviles. Este portafolio reúne algunos de los proyectos que han definido mi trayectoria profesional y académica.',
    ctaProjects:  'Ver proyectos',
    ctaContact:   'Contactar',
    statProjects: 'Proyectos VR / MR',
    statModels:   'Modelos 3D interactivos',
    statLocation: 'Ubicación',
    location:     'Colombia',
    canvasHint:      'Mueve el cursor sobre la malla · haz clic para crear ondas',
    canvasHintTouch: 'Toca la malla para crear ondas',
  },
  about: {
    eyebrow: 'Perfil',
    title:   'Sobre <span>mí</span>',
    p1: 'Mi nombre es Cristian Andrés, soy estudiante de Administración de Sistemas Informáticos y técnico en Modelado 3D y Desarrollo de Videojuegos. Mi experiencia abarca tanto el desarrollo de software como la creación de contenido digital, participando en proyectos de modelado 3D, videojuegos, realidad virtual y aplicaciones web y móviles.',
    p2: 'He trabajado en la creación de assets 3D para impresión 3D utilizando herramientas como Blender, ZBrush y Photoshop, colaborando con empresas del sector para el desarrollo de modelos optimizados y listos para producción. También he participado en el desarrollo de videojuegos y experiencias de realidad virtual utilizando Unity, contribuyendo tanto en programación como en diseño de mecánicas y el desarrollo de escenarios.',
    p3: 'Además, he desarrollado proyectos académicos como aplicativos web y móviles utilizando tecnologías como Laravel, React y React Native, y cuento con experiencia en el uso de herramientas de inteligencia artificial aplicadas a procesos de desarrollo en distintas áreas.',
    p4: 'Me llama la atención especialmente el diseño de interfaces de usuario, ya sea para videojuegos o aplicaciones, buscando siempre crear experiencias intuitivas, atractivas y funcionales. Disfruto aprender constantemente, enfrentar nuevos desafíos y seguir fortaleciendo mis habilidades para aportar cada vez más valor a los proyectos en los que participo.',
    educationLabel: 'Formación',
    education: [
      { title: 'Administración de Sistemas Informáticos', note: 'En curso' },
      { title: 'Técnico en Modelado 3D y Desarrollo de Videojuegos' },
    ],
    skillsLabel: 'Herramientas & tecnologías',
  },
  models: {
    eyebrow:         'Arte 3D',
    title:           'Modelos <span>3D</span>',
    body:            'Colección de modelos creados en Blender y ZBrush, desde personajes hasta piezas para impresión 3D. Arrastra cualquier modelo para rotarlo.',
    dragHint:        'Arrastra para rotar',
    artStationLabel: 'Más de mis modelos 3D en',
  },
  games: {
    eyebrow: 'Videojuegos & XR',
    title:   'Proyectos <span>destacados</span>',
    body:    'Videojuegos y aplicaciones de realidad virtual y mixta desarrollados en Unity, combinando diseño, programación y arte 3D.',
    play:    'Reproducir video',
  },
  contact: {
    eyebrow:         'Hablemos',
    title:           'Trabajemos <span>juntos</span>',
    body:            '¿Tienes un proyecto en mente o una oportunidad laboral? Estoy disponible para colaboraciones y proyectos freelance en modelado 3D, videojuegos y realidad virtual o mixta.',
    linkedinValue:   'Cristian A. Arenas',
    artstationValue: 'Portafolio de modelos 3D',
    githubValue:     'CrArenas',
  },
};

// ── INGLÉS (pre-traducido) ───────────────────────────────────────────────────
export const en = {
  lang: 'en',
  docTitle: 'Cristian Arenas — 3D Artist & XR Developer',
  langAria: 'Cambiar a español',
  nav: {
    home:    'Home',
    about:   'About me',
    models:  '3D models',
    games:   'Projects',
    contact: 'Contact',
  },
  spine: {
    role:     '3D Artist · XR Developer',
    subtitle: 'Interactive portfolio',
  },
  home: {
    eyebrow:      'Hi, I\'m Cristian Arenas',
    title:        '3D art & immersive <span>experiences</span>',
    body:         'I am a game developer and 3D artist. I create models for 3D printing, virtual and mixed reality experiences, and web and mobile applications. This portfolio brings together some of the projects that have defined my professional and academic journey.',
    ctaProjects:  'View projects',
    ctaContact:   'Get in touch',
    statProjects: 'VR / MR projects',
    statModels:   'Interactive 3D models',
    statLocation: 'Location',
    location:     'Colombia',
    canvasHint:      'Move your cursor over the grid · click to make waves',
    canvasHintTouch: 'Tap the grid to make waves',
  },
  about: {
    eyebrow: 'Profile',
    title:   'About <span>me</span>',
    p1: 'My name is Cristian Andrés. I am a Computer Systems Administration student and a technician in 3D Modeling and Video Game Development. My experience spans both software development and digital content creation, having participated in 3D modeling, video game, virtual reality, and web and mobile application projects.',
    p2: 'I have worked on the creation of 3D assets for 3D printing using tools such as Blender, ZBrush, and Photoshop, collaborating with companies in the sector to develop optimized, production-ready models. I have also participated in the development of video games and virtual reality experiences using Unity, contributing to both programming and game mechanics design, as well as level design.',
    p3: 'Additionally, I have developed academic projects such as web and mobile applications using technologies like Laravel, React, and React Native, and I have experience using artificial intelligence tools applied to development processes across different areas.',
    p4: 'I am especially drawn to user interface design, whether for games or applications, always aiming to create intuitive, visually appealing, and functional experiences. I enjoy learning constantly, taking on new challenges, and continuing to strengthen my skills to bring more value to every project I am part of.',
    educationLabel: 'Education',
    education: [
      { title: 'Computer Systems Administration', note: 'In progress' },
      { title: '3D Modeling and Video Game Development Technician' },
    ],
    skillsLabel: 'Tools & technologies',
  },
  models: {
    eyebrow:         '3D art',
    title:           '3D <span>models</span>',
    body:            'A collection of models created in Blender and ZBrush, from characters to 3D printing pieces. Drag any model to rotate it.',
    dragHint:        'Drag to rotate',
    artStationLabel: 'More of my 3D models on',
  },
  games: {
    eyebrow: 'Games & XR',
    title:   'Featured <span>projects</span>',
    body:    'Virtual and mixed reality games and applications built in Unity, combining design, programming, and 3D art.',
    play:    'Play video',
  },
  contact: {
    eyebrow:         'Let\'s talk',
    title:           'Let\'s work <span>together</span>',
    body:            'Have a project in mind or a job opportunity? I am available for collaborations and freelance work in 3D modeling, video games, and virtual or mixed reality.',
    linkedinValue:   'Cristian A. Arenas',
    artstationValue: '3D models portfolio',
    githubValue:     'CrArenas',
  },
};
