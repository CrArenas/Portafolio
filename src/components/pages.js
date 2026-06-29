import { skills, models3d, games } from '../data/projects.js';
import { es } from '../data/i18n.js';

// t = textos activos (es o en)
let t = es;

export function setTexts(texts) {
  t = texts;
}

export function buildSpine() {
  const pages = [
    { id: 'home',    label: t.nav.home,    num: '01' },
    { id: 'about',   label: t.nav.about,   num: '02' },
    { id: 'models',  label: t.nav.models,  num: '03' },
    { id: 'games',   label: t.nav.games,   num: '04' },
    { id: 'contact', label: t.nav.contact, num: '05' },
  ];

  return `
    <!-- Navbar móvil -->
    <nav class="mobile-nav" id="mobile-nav">
      <div class="mobile-nav-top">
        <div>
          <div class="mobile-nav-logo">Portfolio 3D & VR</div>
          <div class="mobile-nav-subtitle">Cristian A. Arenas</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <button class="lang-btn" id="lang-btn-mobile">${t.langBtn}</button>
          <button class="hamburger" id="hamburger" aria-label="Menú">
            <span></span><span></span><span></span>
          </button>
        </div>
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
            <div class="role">${t.spine.role}</div>
          </div>
          <a class="social-link" href="https://www.linkedin.com/in/candresav123/">LinkedIn</a>
        </div>
      </div>
    </nav>

    <!-- Spine desktop -->
    <aside class="spine">
      <div class="spine-logo">
        <div class="title">Portfolio 3D & VR</div>
        <div class="subtitle">${t.spine.subtitle}</div>
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
        <div class="role">${t.spine.role}</div>
        <div class="socials">
          <a class="social-link" href="https://www.linkedin.com/in/candresav123/">LinkedIn</a>
        </div>
        <button class="lang-btn" id="lang-btn-desktop">${t.langBtn}</button>
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
          <div class="section-eyebrow">${t.home.eyebrow}</div>
          <h1 class="section-title">${t.home.title.replace('proyectos', '<span>proyectos</span>').replace('projects', '<span>projects</span>')}</h1>
          <p class="section-body">${t.home.body}</p>
        </div>
        <div class="home-canvas-wrap">
          <canvas id="hero-canvas"></canvas>
          <span class="hero-canvas-label">${t.home.canvasLabel}</span>
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
      <div class="section-eyebrow">${t.about.eyebrow}</div>
      <h2 class="section-title">${t.about.title.includes('de mí') ? 'Acerca <span>de mí</span>' : 'About <span>me</span>'}</h2>
      <p class="section-body">${t.about.p1}</p>
      <p class="section-body">${t.about.p2}</p>
      <p class="section-body">${t.about.p3}</p>
      <p class="section-body">${t.about.p4}</p>
      <div class="skills-list" style="margin-top: 48px;">
        <p class="section-eyebrow" style="margin-bottom: 20px;">${t.about.skillsLabel}</p>
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
      <div class="section-eyebrow">${t.models.eyebrow}</div>
      <h2 class="section-title">${t.models.title.includes('modelos') ? 'Mis modelos <span>3D</span>' : 'My <span>3D</span> models'}</h2>
      <p class="section-body">${t.models.body}</p>
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
                ${m.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
        <div class="project-card" style="border-style:dashed;display:flex;align-items:center;justify-content:center;min-height:200px;">
          <div style="text-align:center;padding:24px;">
            <div style="font-size:28px;margin-bottom:12px;color:var(--gold-dim);">＋</div>
            <div class="project-name" style="color:var(--gold-dim);">${t.models.comingSoon}</div>
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
      <div class="section-eyebrow">${t.games.eyebrow}</div>
      <h2 class="section-title">${t.games.title.includes('desarrollados') ? 'Videojuegos <span>desarrollados</span>' : 'Games <span>developed</span>'}</h2>
      <p class="section-body">${t.games.body}</p>
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
                ${g.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
        <div class="game-card" style="border-style:dashed;display:flex;align-items:center;justify-content:center;min-height:200px;">
          <div style="text-align:center;padding:24px;">
            <div style="font-size:28px;margin-bottom:12px;color:var(--gold-dim);">＋</div>
            <div class="project-name" style="color:var(--gold-dim);">${t.games.comingSoon}</div>
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
      <div class="section-eyebrow">${t.contact.eyebrow}</div>
      <h2 class="section-title">${t.contact.title.includes('Contacto') ? 'Con<span>tacto</span>' : 'Con<span>tact</span>'}</h2>
      <p class="section-body">${t.contact.body}</p>
      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-icon">✉</div>
          <div class="contact-label">${t.contact.emailLabel}</div>
          <div class="contact-value">-</div>
        </div>
        <div class="contact-item">
          <div class="contact-icon">◈</div>
          <div class="contact-label">${t.contact.locationLabel}</div>
          <div class="contact-value">${t.contact.locationValue}</div>
        </div>
        <div class="contact-item">
          <div class="contact-icon">◉</div>
          <div class="contact-label">${t.contact.availLabel}</div>
          <div class="contact-value">${t.contact.availValue}</div>
        </div>
        <div class="contact-item">
          <div class="contact-icon">⬡</div>
          <div class="contact-label">${t.contact.replyLabel}</div>
          <div class="contact-value">${t.contact.replyValue}</div>
        </div>
      </div>
    </section>
  `;
}