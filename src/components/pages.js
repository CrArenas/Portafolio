import { projects, skills, models3d, games } from '../data/projects.js';

export function buildSpine() {
  const pages = [
    { id: 'home',    label: 'Inicio',                   num: '01' },
    { id: 'about',   label: 'Acerca de mí',             num: '02' },
    { id: 'models',  label: 'Mis modelos 3D',           num: '03' },
    { id: 'games',   label: 'Videojuegos desarrollados', num: '04' },
    { id: 'contact', label: 'Contacto',                 num: '05' },
  ];

  return `
    <!-- Navbar móvil -->
    <nav class="mobile-nav" id="mobile-nav">
      <div class="mobile-nav-top">
        <div>
          <div class="mobile-nav-logo">Portfolio 3D & VR</div>
          <div class="mobile-nav-subtitle">Cristian A. Arenas</div>
        </div>
        <button class="hamburger" id="hamburger" aria-label="Menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="mobile-nav-menu" id="mobile-nav-menu">
        <div class="mobile-nav-links">
          ${pages.map((p, i) => `
            <a class="mobile-nav-item${i === 0 ? ' active' : ''}" data-page="${p.id}" href="#">
              <span class="nav-num">${p.num}</span>
              <span class="nav-label">${p.label}</span>
            </a>
          `).join('')}
        </div>
        <div class="mobile-nav-footer">
          <div>
            <div class="name">Cristian A. Arenas.</div>
            <div class="role">3D / VR Developer</div>
          </div>
          <a class="social-link" href="https://www.linkedin.com/in/candresav123/">LinkedIn</a>
        </div>
      </div>
    </nav>

    <!-- Spine desktop -->
    <aside class="spine">
      <div class="spine-logo">
        <div class="title">Portfolio 3D & VR</div>
        <div class="subtitle">Portfolio 3D & VR</div>
        <span class="ornament"></span>
      </div>
      <nav class="nav">
        ${pages.map((p, i) => `
          <a class="nav-item${i === 0 ? ' active' : ''}" data-page="${p.id}" href="#">
            <span class="nav-num">${p.num}</span>
            <span class="nav-label">${p.label}</span>
            <span class="nav-dot"></span>
          </a>
        `).join('')}
      </nav>
      <div class="spine-footer">
        <div class="name">Cristian A. Arenas.</div>
        <div class="role">3D / VR Developer</div>
        <div class="socials">
          <a class="social-link" href="https://www.linkedin.com/in/candresav123/">LinkedIn</a>
        </div>
      </div>
    </aside>
  `;
}

export function buildHomePage() {
  return `
    <section class="page active" id="page-home">
      <div class="page-number">— 01 —</div>
      <div class="page-header-line"></div>
      <div class="home-hero">
        <div>
          <div class="section-eyebrow">Portafolio</div>
          <h1 class="section-title">Mi portafolio de <span>proyectos</span></h1>
          <p class="section-body">Soy un desarrollador de videojuegos y artista 3D apasionado por crear experiencias digitales. Desde modelos para impresión 3D y videojuegos en realidad virtual hasta aplicaciones web y móviles, este portafolio reúne algunos de los proyectos que han definido mi trayectoria profesional y académica.</p>
        </div>
        <div class="home-canvas-wrap">
          <canvas id="hero-canvas"></canvas>
          <span class="hero-canvas-label">Modelo 3D de Jerry, el perro mascota.</span>
        </div>
      </div>
    </section>
  `;
}

export function buildAboutPage() {
  return `
    <section class="page" id="page-about">
      <div class="page-number">— 02 —</div>
      <div class="page-header-line"></div>
      <div class="section-eyebrow">Portafolio</div>
      <h2 class="section-title">Acerca <span>de mí</span></h2>
      <p class="section-body">Mi nombre es Cristian Andrés, soy un estudiante de Administración de Sistemas Informáticos y técnico en Modelado 3D y Desarrollo de videojuegos. Mi experiencia abarca tanto el desarrollo de software como la creación de contenido digital, participando en proyectos de modelado 3D, videojuegos, realidad virtual y aplicaciones web y móviles.</p>
      <p class="section-body">He trabajado en la creación de assets 3D para impresión 3D utilizando herramientas como Blender, ZBrush y Photoshop, colaborando con empresas del sector para el desarrollo de modelos optimizados y listos para producción. También he participado en el desarrollo de videojuegos y experiencias de realidad virtual utilizando Unity, contribuyendo tanto en programación como en diseño de mecánicas y el desarrollo de escenarios en videojuegos.</p>
      <p class="section-body">Además, he desarrollado proyectos académicos como aplicativos web y móviles utilizando tecnologías como Laravel, React y React Native, y cuento con experiencia en el uso de herramientas de inteligencia artificial aplicadas a procesos de desarrollo en distintas áreas.</p>
      <p class="section-body">Me llama la atención especialmente el diseño de interfaces de usuario, ya sea para videojuegos o aplicaciones, buscando siempre crear experiencias intuitivas, atractivas y funcionales. Disfruto aprender constantemente, enfrentar nuevos desafíos y seguir fortaleciendo mis habilidades para aportar cada vez más valor a los proyectos en los que participo.</p>
      <div class="skills-list" style="margin-top: 48px;">
        <p class="section-eyebrow" style="margin-bottom: 20px;">Herramientas & tecnologías</p>
        ${skills.map(s => `
          <div class="skill-row">
            <div class="skill-header">
              <span class="skill-name">${s.name}</span>
              <span class="skill-pct">${s.pct}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" data-pct="${s.pct}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

export function buildModelsPage() {
  return `
    <section class="page" id="page-models">
      <div class="page-number">— 03 —</div>
      <div class="page-header-line"></div>
      <div class="section-eyebrow">Arte digital</div>
      <h2 class="section-title">Mis modelos <span>3D</span></h2>
      <p class="section-body">Colección de modelos creados en Blender y ZBrush, desde personajes para videojuegos hasta piezas para impresión 3D.</p>
      <div class="projects-grid">
        ${models3d.map(m => `
          <div class="project-card" data-model-id="${m.id}">
            <div class="project-thumb">
              <canvas class="card-canvas" data-model-id="${m.id}"></canvas>
            </div>
            <div class="project-info">
              <div class="project-name">${m.name}</div>
              <div class="project-desc">${m.desc}</div>
              <div class="project-tags">
                ${m.tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
        <div class="project-card" style="border-style: dashed; display:flex; align-items:center; justify-content:center; min-height: 200px;">
          <div style="text-align:center; padding: 24px;">
            <div style="font-size: 28px; margin-bottom: 12px; color: var(--gold-dim);">＋</div>
            <div class="project-name" style="color: var(--gold-dim);">Más modelos próximamente</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function buildGamesPage() {
  return `
    <section class="page" id="page-games">
      <div class="page-number">— 04 —</div>
      <div class="page-header-line"></div>
      <div class="section-eyebrow">Game Development</div>
      <h2 class="section-title">Videojuegos <span>desarrollados</span></h2>
      <p class="section-body">Proyectos de videojuegos que combinan diseño, programación y arte 3D para crear experiencias jugables únicas.</p>
      <div class="games-grid">
        ${games.map(g => `
          <div class="game-card">
            <div class="game-video-wrap">
              <iframe
                src="https://www.youtube.com/embed/${g.youtubeId}?rel=0&modestbranding=1"
                title="${g.name}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div class="project-info">
              <div class="project-name">${g.name}</div>
              <div class="project-desc">${g.desc}</div>
              <div class="project-tags">
                ${g.tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
        <div class="game-card" style="border-style: dashed; display:flex; align-items:center; justify-content:center; min-height: 200px;">
          <div style="text-align:center; padding: 24px;">
            <div style="font-size: 28px; margin-bottom: 12px; color: var(--gold-dim);">＋</div>
            <div class="project-name" style="color: var(--gold-dim);">Más juegos próximamente</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function buildContactPage() {
  return `
    <section class="page" id="page-contact">
      <div class="page-number">— 05 —</div>
      <div class="page-header-line"></div>
      <div class="section-eyebrow">Hablemos</div>
      <h2 class="section-title">Con<span>tacto</span></h2>
      <p class="section-body">¿Tienes un proyecto que quieres llevar a otra dimensión? Estoy disponible para colaboraciones, freelance y consultoría en 3D y VR.</p>
      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-icon">✉</div>
          <div class="contact-label">Email</div>
          <div class="contact-value">hola@alejandromora.dev</div>
        </div>
        <div class="contact-item">
          <div class="contact-icon">◈</div>
          <div class="contact-label">Ubicación</div>
          <div class="contact-value">Medellín, Colombia</div>
        </div>
        <div class="contact-item">
          <div class="contact-icon">◉</div>
          <div class="contact-label">Disponibilidad</div>
          <div class="contact-value">Proyectos desde Ene 2025</div>
        </div>
        <div class="contact-item">
          <div class="contact-icon">⬡</div>
          <div class="contact-label">Respuesta</div>
          <div class="contact-value">En menos de 24 horas</div>
        </div>
      </div>
    </section>
  `;
}