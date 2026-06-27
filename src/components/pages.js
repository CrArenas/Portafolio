import { projects, skills } from '../data/projects.js';

export function buildSpine() {
  const pages = [
    { id: 'home',     label: 'Inicio',     num: '01' },
    { id: 'projects', label: 'Proyectos',  num: '02' },
    { id: 'skills',   label: 'Habilidades',num: '03' },
    { id: 'contact',  label: 'Contacto',   num: '04' },
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
        <div class="name">Alejandro Mora</div>
        <div class="role">3D / VR Developer</div>
        <div class="socials">
          <a class="social-link" href="#">GitHub</a>
          <a class="social-link" href="#">LinkedIn</a>
          <a class="social-link" href="#">Behance</a>
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
          <div class="section-eyebrow">Portfolio interactivo</div>
          <h1 class="section-title">Arte en <span>tres</span><br>dimensiones</h1>
          <p class="section-body">Construyo experiencias inmersivas donde la geometría cobra vida. Cada proyecto es un mundo por explorar, tejido con WebGL, shaders y realidad virtual.</p>
        </div>
        <div class="home-canvas-wrap">
          <canvas id="hero-canvas"></canvas>
          <span class="hero-canvas-label">// TORUS_KNOT_V2.3 — INTERACTIVO</span>
        </div>
        <div class="stats-row">
          <div class="stat"><span class="stat-num">24+</span><span class="stat-label">Proyectos</span></div>
          <div class="stat"><span class="stat-num">6</span><span class="stat-label">Años exp.</span></div>
          <div class="stat"><span class="stat-num">12</span><span class="stat-label">Clientes</span></div>
          <div class="stat"><span class="stat-num">∞</span><span class="stat-label">Polígonos</span></div>
        </div>
      </div>
    </section>
  `;
}

export function buildProjectsPage() {
  return `
    <section class="page" id="page-projects">
      <div class="page-number">— 02 —</div>
      <div class="page-header-line"></div>
      <div class="section-eyebrow">Exploración dimensional</div>
      <h2 class="section-title">Mis <span>proyectos</span></h2>
      <p class="section-body">Cada pieza es un universo construido con código, luz y matemáticas. Desliza para explorar.</p>
      <div class="projects-grid">
        ${projects.map(p => `
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
      </div>
    </section>
  `;
}

export function buildSkillsPage() {
  return `
    <section class="page" id="page-skills">
      <div class="page-number">— 03 —</div>
      <div class="page-header-line"></div>
      <div class="section-eyebrow">Arsenal técnico</div>
      <h2 class="section-title">Habili<span>dades</span></h2>
      <p class="section-body">Dominio de las herramientas que dan forma a mundos digitales, desde el vertex shader hasta la experiencia de usuario final.</p>
      <div class="skills-list">
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

export function buildContactPage() {
  return `
    <section class="page" id="page-contact">
      <div class="page-number">— 04 —</div>
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
