// TWAM GLOBAL — Main JS

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) navLinks.classList.remove('open');
  });
}

// Reveal on scroll
globalThis.revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => globalThis.revealObserver.observe(el));

// Filter buttons (products page)
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    document.querySelectorAll('.category-block').forEach(b => {
      b.style.display = (target === 'all' || b.id === target) ? '' : 'none';
    });
    if (target !== 'all') {
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
      }, 50);
    }
  });
});

// Contact form — validation + Netlify Forms lead capture
const form = document.getElementById('contactForm');
if (form) {
  const RULES = {
    firstName: { required: true, pattern: /^[A-Za-z\s'-]{2,}$/, msg: { required: 'First name is required.', pattern: 'Please enter a valid name (letters only).' } },
    lastName:  { required: true, pattern: /^[A-Za-z\s'-]{2,}$/, msg: { required: 'Last name is required.',  pattern: 'Please enter a valid name (letters only).' } },
    email:     { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, msg: { required: 'Email address is required.', pattern: 'Please enter a valid email address.' } },
    phone:     { required: false, pattern: /^\+?[\d\s().-]{7,20}$/, msg: { pattern: 'Please enter a valid phone number.' } },
    message:   { required: true, minLength: 10, msg: { required: 'Please describe your requirements.', minLength: 'Message must be at least 10 characters.' } },
  };

  function getGroup(id) { return document.getElementById(id).closest('.form-group'); }

  function showError(id, msg) {
    const group = getGroup(id);
    group.classList.add('error');
    group.classList.remove('success');
    let span = group.querySelector('.field-error');
    if (!span) { span = document.createElement('span'); span.className = 'field-error'; group.appendChild(span); }
    span.textContent = msg;
  }

  function clearError(id) {
    const group = getGroup(id);
    group.classList.remove('error');
    group.classList.add('success');
    const span = group.querySelector('.field-error');
    if (span) span.textContent = '';
  }

  function validateField(id) {
    const el = document.getElementById(id);
    const val = el.value.trim();
    const rule = RULES[id];
    if (!rule) return true;
    if (rule.required && !val) { showError(id, rule.msg.required); return false; }
    if (val && rule.pattern && !rule.pattern.test(val)) { showError(id, rule.msg.pattern); return false; }
    if (rule.minLength && val.length < rule.minLength) { showError(id, rule.msg.minLength); return false; }
    clearError(id);
    return true;
  }

  Object.keys(RULES).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(id));
    el.addEventListener('input', () => { if (getGroup(id).classList.contains('error')) validateField(id); });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const valid = Object.keys(RULES).map(id => validateField(id)).every(Boolean);
    if (!valid) {
      const first = form.querySelector('.form-group.error input, .form-group.error textarea');
      if (first) first.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
      .then(() => {
        // Show success banner
        let banner = form.querySelector('.form-success-banner');
        if (!banner) {
          banner = document.createElement('div');
          banner.className = 'form-success-banner';
          banner.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#22c55e"/><path d="M6 10l3 3 5-5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><p>Thank you! Your enquiry has been received. We&#39;ll get back to you within 24 working hours.</p>';
          form.prepend(banner);
        }
        banner.style.display = 'flex';
        form.querySelectorAll('.form-group').forEach(g => { g.classList.remove('success', 'error'); const s = g.querySelector('.field-error'); if (s) s.textContent = ''; });
        form.reset();
        btn.textContent = origText;
        btn.disabled = false;
        banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { banner.style.display = 'none'; }, 8000);
      })
      .catch(() => {
        btn.textContent = 'Failed — Please Retry';
        btn.style.background = '#dc2626';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = origText; btn.style.background = ''; }, 4000);
      });
  });
}
