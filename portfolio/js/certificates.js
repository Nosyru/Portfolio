/**
 * js/certificates.js
 * Defines the CERTIFICATES data array, renders filter tabs
 * and certificate cards into the DOM, handles tab filtering,
 * and powers the detail modal.
 * To add a certificate: push a new object into CERTIFICATES below.
 */
'use strict';

/* ── Certificate data ── */
const CERTIFICATES = [
  {
    id: 'cert-1',
    icon: '🏅',
    colorClass: 'cert-c1',
    category: 'web',
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    date: 'March 2023',
    badge: 'Web Dev',
    description: 'Completed 300+ hours covering HTML5, CSS3, Flexbox, CSS Grid, and accessibility. Passed 5 certification projects.',
    linkUrl: 'https://www.freecodecamp.org/',
  },
  {
    id: 'cert-2',
    icon: '⚙️',
    colorClass: 'cert-c2',
    category: 'programming',
    title: 'JavaScript Algorithms & Data Structures',
    issuer: 'freeCodeCamp',
    date: 'June 2022',
    badge: 'JavaScript',
    description: 'Deep-dive into ES6+, functional programming, OOP, and algorithmic problem solving with JavaScript.',
    linkUrl: 'https://www.freecodecamp.org/',
  },
  {
    id: 'cert-3',
    icon: '🐍',
    colorClass: 'cert-c3',
    category: 'programming',
    title: 'Python for Everybody',
    issuer: 'Coursera / University of Michigan',
    date: 'January 2023',
    badge: 'Python',
    description: 'Five-course specialisation covering Python fundamentals, data structures, web scraping, databases, and visualisation.',
    linkUrl: 'https://www.coursera.org/',
  },
  {
    id: 'cert-4',
    icon: '🎨',
    colorClass: 'cert-c4',
    category: 'design',
    title: 'UI / UX Design Foundations',
    issuer: 'Google / Coursera',
    date: 'August 2023',
    badge: 'Design',
    description: 'Google UX Design Certificate: user research, wireframing, prototyping in Figma, and usability testing methodologies.',
    linkUrl: 'https://www.coursera.org/',
  },
  {
    id: 'cert-5',
    icon: '🐙',
    colorClass: 'cert-c1',
    category: 'tools',
    title: 'Git & GitHub — Complete Guide',
    issuer: 'Udemy',
    date: 'October 2022',
    badge: 'DevTools',
    description: 'Version control, branching strategies, pull requests, GitHub Actions basics, and collaborative workflows.',
    linkUrl: 'https://www.udemy.com/',
  },
  {
    id: 'cert-6',
    icon: '🗄️',
    colorClass: 'cert-c2',
    category: 'tools',
    title: 'SQL & Database Design',
    issuer: 'freeCodeCamp',
    date: 'April 2023',
    badge: 'Database',
    description: 'Relational database design, normalisation, advanced SQL, joins, stored procedures, and MySQL optimisation.',
    linkUrl: 'https://www.freecodecamp.org/',
  },
];

/* ── Render filter tabs ── */
(function renderCertTabs() {
  const container = document.querySelector('#certTabs');
  if (!container) return;

  const cats   = ['all', ...new Set(CERTIFICATES.map(c => c.category))];
  const labels = { all: 'All', web: 'Web Dev', programming: 'Programming', design: 'Design', tools: 'Tools' };

  cats.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className  = 'tab-btn' + (i === 0 ? ' active' : '');
    btn.dataset.filter = cat;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(i === 0));
    btn.textContent = labels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
    container.appendChild(btn);
  });
})();

/* ── Render certificate cards ── */
(function renderCertCards() {
  const grid = document.querySelector('#certGrid');
  if (!grid) return;

  const frag = document.createDocumentFragment();

  CERTIFICATES.forEach((cert, i) => {
    const card = document.createElement('div');
    card.className = 'cert-card reveal-up';
    card.dataset.id  = cert.id;
    card.dataset.cat = cert.category;
    card.tabIndex    = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View certificate: ${cert.title}`);
    card.style.setProperty('--delay', `${0.05 * (i + 1)}s`);
    card.innerHTML = `
      <div class="cert-thumb ${cert.colorClass}" aria-hidden="true"><span>${cert.icon}</span></div>
      <div class="cert-body">
        <span class="cert-issuer">${cert.issuer}</span>
        <h3 class="cert-title">${cert.title}</h3>
        <div class="cert-footer">
          <span class="cert-date">${cert.date}</span>
          <span class="cert-badge">${cert.badge}</span>
        </div>
      </div>`;
    frag.appendChild(card);
  });

  grid.appendChild(frag);

  /* Observe freshly rendered cards for scroll-reveal */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  [...document.querySelectorAll('.cert-card')].forEach(el => obs.observe(el));
})();

/* ── Tab filter ── */
document.addEventListener('click', e => {
  const btn = e.target.closest('#certTabs .tab-btn');
  if (!btn) return;

  const f = btn.dataset.filter;
  [...document.querySelectorAll('#certTabs .tab-btn')].forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  [...document.querySelectorAll('.cert-card')].forEach(c => {
    const match = f === 'all' || c.dataset.cat === f;
    if (match) {
      c.classList.remove('hidden');
      c.classList.remove('visible');
      void c.offsetWidth;           // force reflow
      c.classList.add('visible');
    } else {
      c.classList.add('hidden');
    }
  });
});

/* ── Certificate modal ── */
(function initCertModal() {
  const modal    = document.querySelector('#certModal');
  const backdrop = document.querySelector('#certModalBackdrop');
  const closeBtn = document.querySelector('#certModalClose');
  if (!modal) return;

  const mIssuer = document.querySelector('#certModalIssuer');
  const mTitle  = document.querySelector('#certModalTitle');
  const mDate   = document.querySelector('#certModalDate');
  const mDesc   = document.querySelector('#certModalDesc');
  const mLink   = document.querySelector('#certModalLink');
  const mImg    = document.querySelector('#certModalImg');

  function openModal(id) {
    const cert = CERTIFICATES.find(c => c.id === id);
    if (!cert) return;

    mIssuer.textContent = cert.issuer;
    mTitle.textContent  = cert.title;
    mDate.textContent   = `Issued: ${cert.date}`;
    mDesc.textContent   = cert.description;
    mLink.href          = cert.linkUrl;
    mImg.querySelector('.cert-modal-icon').textContent = cert.icon;
    mImg.className = `cert-modal-img-wrap ${cert.colorClass} h-40 flex items-center justify-center`;

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  /* Open on click or keyboard */
  document.addEventListener('click', e => {
    const card = e.target.closest('.cert-card');
    if (card) openModal(card.dataset.id);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = document.activeElement?.closest('.cert-card');
      if (card) { e.preventDefault(); openModal(card.dataset.id); }
    }
    if (e.key === 'Escape') closeModal();
  });

  backdrop?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
})();