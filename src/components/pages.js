import { skillGroups, models3d, games, loc } from '../data/projects.js';
import { es } from '../data/i18n.js';

// t = textos activos (es o en)
let t = es;

export function setTexts(texts) {
  t = texts;
}

const L = (value) => loc(value, t.lang);

// ── Enlaces e iconos ─────────────────────────────────────────────────────────
const LINKS = {
  linkedin:   'https://www.linkedin.com/in/candresav123/',
  artstation: 'https://www.artstation.com/carenas',
  github:     'https://github.com/CrArenas',
};

const svg = (path) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="${path}"/></svg>`;

const ICONS = {
  linkedin: svg('M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'),
  artstation: svg('M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.142-1.289H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z'),
  github: svg('M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'),
};

const ext = (href) => `href="${href}" target="_blank" rel="noopener noreferrer"`;

function socialLinks() {
  return `
    <a class="social-link" ${ext(LINKS.linkedin)} aria-label="LinkedIn">${ICONS.linkedin}</a>
    <a class="social-link" ${ext(LINKS.artstation)} aria-label="ArtStation">${ICONS.artstation}</a>
    <a class="social-link" ${ext(LINKS.github)} aria-label="GitHub">${ICONS.github}</a>
  `;
}

function langButton(id) {
  return `
    <button class="lang-btn" id="${id}" aria-label="${t.langAria}" lang="${t.lang === 'es' ? 'en' : 'es'}">
      <span class="${t.lang === 'es' ? 'is-current' : ''}">ES</span>
      <span class="lang-sep">/</span>
      <span class="${t.lang === 'en' ? 'is-current' : ''}">EN</span>
    </button>
  `;
}

const tagsHTML = (tags) => tags.map(tag => `<span class="tag">${L(tag)}</span>`).join('');

function pageHeader(num) {
  return `
    <div class="page-number">— ${num} —</div>
    <div class="page-header-line"></div>
  `;
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
          <div class="mobile-nav-logo">Cristian Arenas</div>
          <div class="mobile-nav-subtitle">${t.spine.role}</div>
        </div>
        <div class="mobile-nav-actions">
          ${langButton('lang-btn-mobile')}
          <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="mobile-nav-menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="mobile-nav-menu" id="mobile-nav-menu">
        <div class="mobile-nav-links">
          ${pages.map(p => `
            <a class="mobile-nav-item" data-page="${p.id}" href="#${p.id}">
              <span class="nav-num">${p.num}</span>
              <span class="nav-label">${p.label}</span>
            </a>
          `).join('')}
        </div>
        <div class="mobile-nav-footer">
          <div class="socials">${socialLinks()}</div>
        </div>
      </div>
    </nav>

    <!-- Spine desktop -->
    <aside class="spine">
      <div class="spine-logo">
        <div class="title">Cristian Arenas</div>
        <div class="subtitle">${t.spine.role}</div>
        <span class="ornament"></span>
      </div>
      <nav class="nav">
        ${pages.map(p => `
          <a class="nav-item" data-page="${p.id}" href="#${p.id}">
            <span class="nav-num">${p.num}</span>
            <span class="nav-label">${p.label}</span>
            <span class="nav-dot"></span>
          </a>
        `).join('')}
      </nav>
      <div class="spine-footer">
        <div class="spine-footer-label">${t.spine.subtitle}</div>
        <div class="socials">${socialLinks()}</div>
        ${langButton('lang-btn-desktop')}
      </div>
    </aside>
  `;
}

export function buildHomePage() {
  return `
    <section class="page" id="page-home">
      ${pageHeader('01')}
      <div class="home-hero">
        <div class="home-intro">
          <div class="section-eyebrow">${t.home.eyebrow}</div>
          <h1 class="section-title">${t.home.title}</h1>
          <p class="section-body">${t.home.body}</p>
          <div class="home-actions">
            <a class="btn btn-primary" data-page="games" href="#games">${t.home.ctaProjects} <span aria-hidden="true">→</span></a>
            <a class="btn btn-ghost" data-page="contact" href="#contact">${t.home.ctaContact}</a>
          </div>
        </div>
        <dl class="stats-row">
          <div class="stat"><dt class="stat-label">${t.home.statProjects}</dt><dd class="stat-num">${String(games.length).padStart(2, '0')}</dd></div>
          <div class="stat"><dt class="stat-label">${t.home.statModels}</dt><dd class="stat-num">${String(models3d.length).padStart(2, '0')}</dd></div>
          <div class="stat"><dt class="stat-label">${t.home.statLocation}</dt><dd class="stat-num">${t.home.location}</dd></div>
        </dl>
        <div class="home-canvas-wrap" aria-hidden="true">
          <canvas id="hero-canvas"></canvas>
          <span class="hero-canvas-hint hint-pointer">${t.home.canvasHint}</span>
          <span class="hero-canvas-hint hint-touch">${t.home.canvasHintTouch}</span>
        </div>
      </div>
    </section>
  `;
}

export function buildAboutPage() {
  return `
    <section class="page" id="page-about">
      ${pageHeader('02')}
      <div class="about-header">
        <div class="profile-photo-wrap">
          <img src="/images/profile.jpg" alt="Cristian A. Arenas" class="profile-photo" />
          <div class="profile-photo-ring"></div>
        </div>
        <div>
          <div class="section-eyebrow">${t.about.eyebrow}</div>
          <h2 class="section-title">${t.about.title}</h2>
        </div>
      </div>

      <div class="about-layout">
        <div class="about-body">
          <p class="section-body">${t.about.p1}</p>
          <p class="section-body">${t.about.p2}</p>
          <p class="section-body">${t.about.p3}</p>
          <p class="section-body">${t.about.p4}</p>
        </div>

        <aside class="about-side">
          <div class="side-block">
            <h3 class="block-label">${t.about.educationLabel}</h3>
            <ul class="education-list">
              ${t.about.education.map(e => `
                <li>
                  <span class="education-title">${e.title}</span>
                  ${e.note ? `<span class="education-note">${e.note}</span>` : ''}
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="side-block">
            <h3 class="block-label">${t.about.skillsLabel}</h3>
            <div class="skill-groups">
              ${skillGroups.map(g => `
                <div class="skill-group">
                  <div class="skill-group-title">${L(g.title)}</div>
                  <div class="chips">
                    ${g.items.map(item => `<span class="chip">${L(item)}</span>`).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;
}

export function buildModelsPage() {
  return `
    <section class="page" id="page-models">
      ${pageHeader('03')}
      <div class="section-eyebrow">${t.models.eyebrow}</div>
      <h2 class="section-title">${t.models.title}</h2>
      <p class="section-body">${t.models.body}</p>
      <div class="projects-grid">
        ${models3d.map(m => `
          <article class="project-card" data-model-id="${m.id}">
            <div class="project-thumb">
              <canvas class="card-canvas" data-model-id="${m.id}" aria-label="${L(m.name)}"></canvas>
              <span class="thumb-hint" aria-hidden="true">↻ ${t.models.dragHint}</span>
            </div>
            <div class="project-info">
              <h3 class="project-name">${L(m.name)}</h3>
              <p class="project-desc">${L(m.desc)}</p>
              <div class="project-tags">${tagsHTML(m.tags)}</div>
            </div>
          </article>
        `).join('')}
      </div>

      <a ${ext(LINKS.artstation)} class="artstation-card">
        <div class="artstation-card-content">
          <div class="artstation-eyebrow">${t.models.artStationLabel}</div>
          <div class="artstation-name">ArtStation <span>— Cristian A.</span></div>
          <div class="artstation-url">artstation.com/carenas ↗</div>
        </div>
        <div class="artstation-icon">${ICONS.artstation}</div>
      </a>
    </section>
  `;
}

// Miniatura del video. El iframe de YouTube solo se carga al hacer clic
// (ver main.js), así la página no descarga 3 reproductores de entrada.
export function buildVideoPoster(youtubeId, name) {
  return `
    <button class="video-poster" type="button" data-yt="${youtubeId}" aria-label="${t.games.play}: ${name}">
      <img src="https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg" alt="" loading="lazy" />
      <span class="video-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5.14v13.72L19 12z"/></svg>
      </span>
    </button>
  `;
}

export function buildGamesPage() {
  return `
    <section class="page" id="page-games">
      ${pageHeader('04')}
      <div class="section-eyebrow">${t.games.eyebrow}</div>
      <h2 class="section-title">${t.games.title}</h2>
      <p class="section-body">${t.games.body}</p>
      <div class="games-grid">
        ${games.map((g, i) => `
          <article class="game-card">
            <div class="game-video-wrap" data-yt="${g.youtubeId}" data-name="${L(g.name)}">
              ${buildVideoPoster(g.youtubeId, L(g.name))}
            </div>
            <div class="project-info">
              <div class="game-meta">
                <span class="game-index">${String(i + 1).padStart(2, '0')}</span>
                <span class="game-type">${L(g.type)}</span>
              </div>
              <h3 class="project-name">${L(g.name)}</h3>
              <p class="project-desc">${L(g.desc)}</p>
              <div class="project-tags">${tagsHTML(g.tags)}</div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

export function buildContactPage() {
  const items = [
    { key: 'linkedin',   label: 'LinkedIn',   value: t.contact.linkedinValue },
    { key: 'artstation', label: 'ArtStation', value: t.contact.artstationValue },
    { key: 'github',     label: 'GitHub',     value: t.contact.githubValue },
  ];
  return `
    <section class="page" id="page-contact">
      ${pageHeader('05')}
      <div class="section-eyebrow">${t.contact.eyebrow}</div>
      <h2 class="section-title">${t.contact.title}</h2>
      <p class="section-body">${t.contact.body}</p>
      <div class="contact-grid">
        ${items.map(c => `
          <a class="contact-item" ${ext(LINKS[c.key])}>
            <div class="contact-icon">${ICONS[c.key]}</div>
            <div class="contact-label">${c.label}</div>
            <div class="contact-value">${c.value} <span class="contact-arrow" aria-hidden="true">↗</span></div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}
