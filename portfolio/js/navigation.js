/**
 * js/navigation.js
 * Handles: navbar scroll shadow, hamburger menu, smooth anchor
 * scrolling, active nav-link highlighting, dark/light theme
 * toggle, back-to-top button, and footer copyright year.
 */
'use strict';

/* ── Navbar scroll shadow ── */
(function () {
  const nb = document.querySelector('#navbar');
  if (!nb) return;
  const fn = () => nb.classList.toggle('scrolled', scrollY > 20);
  addEventListener('scroll', fn, { passive: true });
  fn();
})();

/* ── Hamburger / mobile menu ── */
(function () {
  const nb    = document.querySelector('#navbar');
  const hb    = document.querySelector('#hamburger');
  const nl    = document.querySelector('#navLinks');
  const links = [...document.querySelectorAll('.nav-link')];
  if (!hb || !nl) return;

  function toggle(forceClose = false) {
    const open = forceClose ? false : !hb.classList.contains('open');
    hb.classList.toggle('open', open);
    nl.classList.toggle('open', open);
    hb.setAttribute('aria-expanded', String(open));
  }

  hb.addEventListener('click', () => toggle());
  links.forEach(l => l.addEventListener('click', () => toggle(true)));
  document.addEventListener('click', e => { if (nb && !nb.contains(e.target)) toggle(true); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(true); });
})();

/* ── Smooth anchor scrolling ── */
(function () {
  [...document.querySelectorAll('a[href^="#"]')].forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length === 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── Active nav-link highlighting ── */
(function () {
  const secs = [...document.querySelectorAll('section[id]')];
  const lnks = [...document.querySelectorAll('.nav-link[data-section]')];
  if (!secs.length || !lnks.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      lnks.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  secs.forEach(s => obs.observe(s));
})();

/* ── Dark / light theme toggle ── */
(function () {
  const btn  = document.querySelector('#themeToggle');
  const html = document.documentElement;
  const icon = btn?.querySelector('.theme-icon');
  if (!btn) return;

  function apply(theme) {
    html.dataset.theme = theme;
    if (icon) icon.textContent = theme === 'dark' ? '☀' : '🌙';
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  }

  apply(localStorage.getItem('portfolioTheme') || 'light');

  btn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next);
    localStorage.setItem('portfolioTheme', next);
  });
})();

/* ── Back-to-top button ── */
(function () {
  const btn = document.querySelector('#backToTop');
  if (!btn) return;
  addEventListener('scroll', () => btn.classList.toggle('visible', scrollY > 500), { passive: true });
  btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── Footer copyright year ── */
(function () {
  const el = document.querySelector('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();