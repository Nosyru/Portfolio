/**
 * js/contact.js
 * Handles contact form validation, live error feedback,
 * async (mock) form submission, and the CV download helper.
 */
'use strict';

/* ── Contact form ── */
(function initContactForm() {
  const form       = document.querySelector('#contactForm');
  const submitBtn  = document.querySelector('#submitBtn');
  const successMsg = document.querySelector('#formSuccess');
  if (!form) return;

  /* Validation rules — key matches the field's name attribute */
  const validators = {
    name:    v => v.trim().length >= 2  ? '' : 'Please enter your full name (at least 2 characters).',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    message: v => v.trim().length >= 10 ? '' : 'Your message must be at least 10 characters.',
  };

  function validateField(field) {
    const rule  = validators[field.name];
    const err   = rule ? rule(field.value) : '';
    const errEl = field.closest('.form-group')?.querySelector('.form-error');
    field.classList.toggle('error', !!err);
    if (errEl) errEl.textContent = err;
    return !err;
  }

  /* Live validation: check on blur, re-check on input if already errored */
  [...form.querySelectorAll('input, textarea')].forEach(f => {
    f.addEventListener('blur',  () => validateField(f));
    f.addEventListener('input', () => { if (f.classList.contains('error')) validateField(f); });
  });

  /* Submit */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const ok = [...form.querySelectorAll('[required]')]
      .map(f => validateField(f))
      .every(Boolean);
    if (!ok) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      /* ─── Replace the line below with a real fetch() call ───
         const res = await fetch('/api/contact', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             name:    form.name.value,
             email:   form.email.value,
             subject: form.subject.value,
             message: form.message.value,
           }),
         });
         if (!res.ok) throw new Error('Server error');
      ────────────────────────────────────────────────────── */
      await new Promise(r => setTimeout(r, 1800)); // mock delay

      form.reset();
      successMsg.removeAttribute('hidden');
      setTimeout(() => successMsg.setAttribute('hidden', ''), 5000);

    } catch (err) {
      console.error('Contact form error:', err);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
})();

/* ── CV download helper ──
   Called via onclick="downloadCV()" in sections/resume.html.
   Replace 'cv.pdf' with the real path to your PDF file.      */
function downloadCV() {
  const link      = document.createElement('a');
  link.href       = 'cv.pdf';  // ← update this path
  link.download   = 'Khen_Hurryson_E_Granadozo_CV.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}