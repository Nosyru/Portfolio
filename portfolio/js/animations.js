/**
 * js/animations.js
 * Handles: loading screen, custom cursor, scroll reveal,
 * hero stagger animate-in, animated skill bars, 3-D card
 * tilt, hero floating particles, typed text effect,
 * and skills tab filter.
 */
'use strict';

/* ── Loading screen ── */
(function () {
  const loader = document.querySelector('#loader');
  if (!loader) return;

  const minDelay = new Promise(r => setTimeout(r, 1200));
  const ready    = new Promise(r => {
    if (document.readyState === 'complete') r();
    else addEventListener('load', r, { once: true });
  });

  Promise.all([minDelay, ready]).then(() => {
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
    animateHeroIn();
  });
})();

/* ── Custom cursor with lerp trail ── */
(function () {
  const dot   = document.querySelector('#cursor');
  const trail = document.querySelector('#cursorTrail');
  if (!dot || !trail) return;
  if (window.matchMedia('(hover:none)').matches) return;

  let mx = -200, my = -200, tx = -200, ty = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  const lerp = (a, b, t) => a + (b - a) * t;

  (function tick() {
    tx = lerp(tx, mx, 0.12);
    ty = lerp(ty, my, 0.12);
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(tick);
  })();

  document.addEventListener('mousedown',  () => { dot.classList.add('clicking');    trail.classList.add('clicking'); });
  document.addEventListener('mouseup',    () => { dot.classList.remove('clicking'); trail.classList.remove('clicking'); });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0';  trail.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1';  trail.style.opacity = '1'; });
})();

/* ── Scroll reveal ── */
(function () {
  const els = [...document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right')];
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ── Hero stagger animate-in (called by loader) ── */
function animateHeroIn() {
  [...document.querySelectorAll('#hero .reveal-up,#hero .reveal-left,#hero .reveal-right')]
    .forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 80));
}

/* ── Animated skill bars ── */
(function () {
  const bars = [...document.querySelectorAll('.skill-bar')];
  if (!bars.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const bar = e.target;
      setTimeout(() => { bar.style.width = (bar.dataset.width || 0) + '%'; }, 200);
      obs.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => obs.observe(b));
})();

/* ── 3-D card tilt (desktop only) ── */
(function () {
  if (window.matchMedia('(hover:none)').matches) return;

  [...document.querySelectorAll('.project-card')].forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const rx = ((e.clientY - top  - height / 2) / (height / 2)) * -5;
      const ry = ((e.clientX - left - width  / 2) / (width  / 2)) *  5;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ── Hero floating particles ── */
(function () {
  const hero = document.querySelector('#hero');
  if (!hero) return;

  if (!document.getElementById('particleKF')) {
    const s = document.createElement('style');
    s.id = 'particleKF';
    s.textContent = '@keyframes floatDot{0%,100%{transform:translateY(0) scale(1);opacity:.4}33%{transform:translateY(-18px) scale(1.3);opacity:.8}66%{transform:translateY(10px) scale(.8);opacity:.2}}';
    document.head.appendChild(s);
  }

  const frag = document.createDocumentFragment();
  for (let i = 0; i < 24; i++) {
    const d = document.createElement('span');
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = `
      position:absolute;
      width:${(Math.random() * 3 + 1).toFixed(1)}px;
      height:${(Math.random() * 3 + 1).toFixed(1)}px;
      border-radius:50%;
      background:rgba(14,165,233,${(Math.random() * .5 + .15).toFixed(2)});
      top:${(Math.random() * 100).toFixed(1)}%;
      left:${(Math.random() * 100).toFixed(1)}%;
      animation:floatDot ${(6 + Math.random() * 8).toFixed(1)}s ease-in-out infinite;
      animation-delay:${(Math.random() * -8).toFixed(1)}s;
      pointer-events:none;
    `;
    frag.appendChild(d);
  }
  hero.style.overflow = 'hidden';
  hero.appendChild(frag);
})();

/* ── Typed text effect ── */
(function () {
  const el = document.querySelector('#typed');
  if (!el) return;

  const phrases = [
    'Computer Science Degree Holder',
    'Web Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
    'Open Source Fan',
  ];

  let pi = 0, ci = 0, del = false;

  function tick() {
    const cur = phrases[pi];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { setTimeout(() => { del = true; tick(); }, 1800); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
    }
    setTimeout(tick, del ? 55 : 100);
  }
  tick();
})();

/* ── Skills tab filter ── */
(function () {
  const tabs  = [...document.querySelectorAll('.skills-tabs .tab-btn')];
  const cards = [...document.querySelectorAll('#skillsGrid .skill-card')];
  if (!tabs.length) return;

  tabs.forEach(tab => tab.addEventListener('click', () => {
    const f = tab.dataset.filter;
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    cards.forEach(c => {
      const match = f === 'all' || c.dataset.category === f;
      if (match) {
        c.classList.remove('hidden');
        c.classList.remove('visible');
        void c.offsetWidth;           // force reflow to re-trigger transition
        c.classList.add('visible');
      } else {
        c.classList.add('hidden');
      }
    });
  }));
})();