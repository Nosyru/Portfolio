/**
 * js/projects.js
 * Defines the PROJECTS data array and dynamically renders
 * project cards into #projectsGrid.
 * To add a project: push a new object into PROJECTS below.
 */
'use strict';

/* ── Project data ── */
const PROJECTS = [
  {
    id: 1,
    icon: '🛒',
    colorClass: 'p1',
    type: 'Frontend',
    title: 'Bubblelicious',
    description: 'A full-featured online store with product catalog, cart management, user authentication, and an admin dashboard. Focuses on performance and mobile-first design.',
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    demoUrl: '#',
    githubUrl: '#',
  },
  {
    id: 2,
    icon: '📋',
    colorClass: 'p2',
    type: 'Frontend',
    title: 'AeroSense',
    description: 'An air-quality monitoring app with real-time sensor data visualization, alert thresholds, historical charts, and offline PWA support.',
    stack: ['Flutter', 'Dart', 'Firebase', 'Python'],
    demoUrl: '#',
    githubUrl: '#',
  },
  {
    id: 3,
    icon: '🌦️',
    colorClass: 'p3',
    type: 'Full Stack',
    title: 'Velora',
    description: 'Real-time weather application consuming OpenWeatherMap API. Features location search, 7-day forecast, animated weather icons, and interactive charts.',
    stack: ['JavaScript', 'REST API', 'Chart.js', 'CSS3'],
    demoUrl: '#',
    githubUrl: '#',
  },
  {
    id: 4,
    icon: '📊',
    colorClass: 'p4',
    type: 'Frontend / QA',
    title: 'Tresh',
    description: 'A smart waste-management platform with route optimisation, collection scheduling, and role-based dashboards for operators and admins.',
    stack: ['HTML', 'CSS', 'Python', 'MySQL'],
    demoUrl: '#',
    githubUrl: '#',
  },
];

/* ── Render cards into DOM ── */
(function renderProjects() {
  const grid = document.querySelector('#projectsGrid');
  if (!grid) return;

  const frag = document.createDocumentFragment();

  PROJECTS.forEach((p, i) => {
    const stackHTML = p.stack.map(t => `<span class="stack-tag">${t}</span>`).join('');
    const num       = String(p.id).padStart(2, '0');

    const art = document.createElement('article');
    art.className = 'project-card reveal-up';
    art.style.setProperty('--delay', `${0.05 * (i + 1)}s`);
    art.innerHTML = `
      <div class="project-img" aria-hidden="true">
        <div class="project-img-placeholder project-thumb ${p.colorClass}">
          <span class="p-icon">${p.icon}</span>
        </div>
        <div class="project-overlay">
          <a href="${p.demoUrl}" class="project-link-btn" aria-label="View ${p.title} live demo" target="_blank" rel="noopener">Live Demo ↗</a>
          <a href="${p.githubUrl}" class="project-link-btn project-link-gh" aria-label="View ${p.title} on GitHub" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
      </div>
      <div class="project-body">
        <div class="project-meta">
          <span class="project-number">${num}</span>
          <span class="project-type">${p.type}</span>
        </div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-stack" aria-label="Technologies used">${stackHTML}</div>
      </div>`;

    frag.appendChild(art);
  });

  grid.appendChild(frag);

  /* Observe freshly rendered cards for scroll-reveal */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  grid.querySelectorAll('.reveal-up').forEach(el => obs.observe(el));
})();