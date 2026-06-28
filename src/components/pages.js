import { projects, skills } from '../data/projects.js';

export function buildSpine() {
  const pages = [
    { id: 'home',    label: 'Inicio',                  num: '01' },
    { id: 'about',   label: 'Acerca de mí',            num: '02' },
    { id: 'models',  label: 'Mis modelos 3D',          num: '03' },
    { id: 'games',   label: 'Videojuegos desarrollados', num: '04' },
    { id: 'contact', label: 'Contacto',                num: '05' },
  ];

  return `
    <aside class="spine">
      <div class="spine-logo">
        <div class="title">Dimensiones</div>
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
      <div class="section-eyebrow">Mi historia</div>
      <h2 class="section-title">Acerca <span>de mí</span></h2>
      <p class="section-body">Soy Cristian Arenas, desarrollador de videojuegos y artista 3D con sede en Medellín, Colombia. Me apasiona construir mundos digitales que combinen tecnología y creatividad, desde experiencias en realidad virtual hasta modelos listos para impresión 3D.</p>
      <div class="stats-row" style="margin-top: 40px;">
        <div class="stat"><span class="stat-num">3+</span><span class="stat-label">Años exp.</span></div>
        <div class="stat"><span class="stat-num">10+</span><span class="stat-label">Modelos 3D</span></div>
        <div class="stat"><span class="stat-num">5+</span><span class="stat-label">Videojuegos</span></div>
        <div class="stat"><span class="stat-num">∞</span><span class="stat-label">Polígonos</span></div>
      </div>
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
        ${projects.filter(p => p.type === '3D' || p.type === 'Modelo').map(p => `
          <div class="project-card" data-project="${p.id}">
            <div class="project-thumb">
              <canvas class="card-canvas" data-project-id="${p.id}"></canvas>
              <span class="project-thumb-tag">${p.type}</span>
            </div>
            <div class="project-info">
              <div class="project-name">${p.name}</div>
              <div class="project-desc">${p.desc}</div>
              <div class="project-tags">
                ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
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
      <div class="projects-grid">
        ${projects.filter(p => p.type === 'VR' || p.type === 'Juego').map(p => `
          <div class="project-card" data-project="${p.id}">
            <div class="project-thumb">
              <canvas class="card-canvas" data-project-id="${p.id}"></canvas>
              <span class="project-thumb-tag">${p.type}</span>
            </div>
            <div class="project-info">
              <div class="project-name">${p.name}</div>
              <div class="project-desc">${p.desc}</div>
              <div class="project-tags">
                ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
        <div class="project-card" style="border-style: dashed; display:flex; align-items:center; justify-content:center; min-height: 200px;">
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