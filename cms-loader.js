/**
 * TWAM GLOBAL — CMS Content Loader
 * Fetches JSON files from /content/ and populates the page dynamically.
 * Works with Decap CMS (Netlify CMS) + GitHub + Netlify hosting.
 */

const BASE = '/content';

// ─── Utility helpers ─────────────────────────────────────────────────────────
async function fetchJSON(path) {
  try {
    const res = await fetch(path + '?v=' + Date.now());
    if (!res.ok) throw new Error('Not found: ' + path);
    return await res.json();
  } catch (e) {
    console.warn('CMS Loader:', e.message);
    return null;
  }
}

function set(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = text;
}

function setSrc(id, src, alt) {
  const el = document.getElementById(id);
  if (el && src) { el.src = src; if (alt) el.alt = alt; }
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
async function loadHome() {
  const [home, contact] = await Promise.all([
    fetchJSON(BASE + '/pages/home.json'),
    fetchJSON(BASE + '/pages/contact.json')
  ]);

  if (home) {
    // Hero
    const h = home.hero;
    setSrc('hero-bg-img', h.hero_image);
    set('hero-badge', h.badge);
    // Split headline: wrap last sentence in em for italic gold
    const parts = h.headline.split(' of ');
    set('hero-headline', parts.length > 1
      ? parts[0] + ' of<br><em>' + parts.slice(1).join(' of ') + '</em>'
      : h.headline
    );
    set('hero-sub', h.subheadline);
    set('hero-cta', h.cta_text);

    // Stats
    if (h.stats) {
      const statsEl = document.getElementById('hero-stats');
      if (statsEl) {
        statsEl.innerHTML = h.stats.map((s, i) =>
          (i > 0 ? '<div class="stat-div"></div>' : '') +
          `<div class="stat">
            <span class="stat-num">${s.num}</span>
            <span class="stat-label">${s.label}</span>
          </div>`
        ).join('');
      }
    }

    // About preview
    const a = home.about_preview;
    setSrc('about-img-main', a.image_main);
    setSrc('about-img-accent', a.image_accent);
    set('about-badge-num', a.badge_num);
    set('about-badge-label', a.badge_label);
    set('about-heading', a.heading1 + '<br><em>' + a.heading2 + '</em>');
    set('about-para1', a.para1);
    set('about-para2', a.para2);

    // Why choose us
    set('why-heading', home.why_us.heading.replace(/ of /, ' of<br><em>').replace(/ the Journey/, ' the Journey</em>') || home.why_us.heading);
    const whyEl = document.getElementById('why-grid');
    if (whyEl && home.why_us.cards) {
      whyEl.innerHTML = home.why_us.cards.map((c, i) => `
        <div class="why-card reveal${i > 0 && i % 3 !== 0 ? ' delay-' + (i % 3) : ''}">
          <div class="why-icon"><span style="font-size:1.4rem">${c.icon}</span></div>
          <h3>${c.title}</h3>
          <p>${c.desc}</p>
        </div>
      `).join('');
    }

    // CTA
    set('cta-heading', 'Ready to Source<br><em>' + home.cta.heading.split('?')[0].replace('Ready to Source ', '') + '?</em>');
    set('cta-subtext', home.cta.subtext);
    setSrc('cta-img', home.cta.image);
  }

  // Marquee - load product category names
  const categories = ['spices','oilseeds','edibleoils','sugar','rice','raisins','agri','pulses'];
  const catData = await Promise.all(categories.map(c => fetchJSON(BASE + '/products/' + c + '.json')));
  const names = catData.filter(Boolean).map(c => c.name);
  const marqueeEl = document.getElementById('marquee-track');
  if (marqueeEl && names.length) {
    const doubled = [...names, ...names];
    marqueeEl.innerHTML = doubled.map(n =>
      `<span>${n}</span><span class="dot">◆</span>`
    ).join('');
  }

  // Product grid (home)
  const gridEl = document.getElementById('product-grid');
  if (gridEl && catData.filter(Boolean).length) {
    const catIds = ['spices','oilseeds','edibleoils','sugar','rice','raisins','agri','pulses'];
    gridEl.innerHTML = catData.filter(Boolean).map((c, i) => `
      <a href="products.html#${catIds[i]}" class="product-card reveal${i % 3 === 1 ? ' delay-1' : i % 3 === 2 ? ' delay-2' : ''}">
        <div class="card-img-wrap">
          <img src="${c.cover_image}" alt="${c.name}" loading="lazy">
          <div class="card-overlay"></div>
        </div>
        <div class="card-body">
          <h3>${c.emoji} ${c.name}</h3>
          <p>${c.description}</p>
          <span class="card-link">View Category →</span>
        </div>
      </a>
    `).join('');
    // Re-observe new elements
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
  }

  // Contact info in footer
  if (contact) {
    set('footer-tagline', contact.footer_text);
    const fc = document.getElementById('footer-contact');
    if (fc) {
      fc.innerHTML = `
        <li><span>📧</span> ${contact.email1}</li>
        <li><span>📞</span> ${contact.phone1}</li>
        <li><span>📍</span> ${contact.address3}</li>
      `;
    }
    // Certifications
    const certEl = document.getElementById('cert-badges');
    if (certEl && contact.certifications) {
      certEl.innerHTML = contact.certifications.map(c =>
        `<div class="cert-badge">${c}</div>`
      ).join('');
    }
  }

  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
async function loadAbout() {
  const [about, contact] = await Promise.all([
    fetchJSON(BASE + '/pages/about.json'),
    fetchJSON(BASE + '/pages/contact.json')
  ]);

  if (about) {
    set('page-heading', about.heading);
    set('page-subtext', about.subtext);
    setSrc('page-hero-img', about.hero_image);

    // Intro
    set('intro-heading', 'TWAM GLOBAL —<br><em>' + (about.intro.heading.split('—')[1] || about.intro.heading).trim() + '</em>');
    set('intro-para1', about.intro.para1);
    set('intro-para2', about.intro.para2);
    set('intro-para3', about.intro.para3);
    setSrc('intro-img', about.intro.image);

    // Stats
    const statsEl = document.getElementById('about-stats-grid');
    if (statsEl && about.stats) {
      statsEl.innerHTML = about.stats.map((s, i) => `
        <div class="value-item reveal${i > 0 ? ' delay-' + Math.min(i, 3) : ''}">
          <div class="value-num">${s.num}</div>
          <div class="value-label">${s.label}</div>
        </div>
      `).join('');
    }

    // Vision & Mission
    set('vision-heading', about.vision.heading);
    set('vision-content', about.vision.content);
    set('mission-heading', about.mission.heading);
    set('mission-content', about.mission.content);
  }

  if (contact) {
    set('footer-tagline', contact.footer_text);
    const fc = document.getElementById('footer-contact');
    if (fc) {
      fc.innerHTML = `
        <li><span>📧</span> ${contact.email1}</li>
        <li><span>📞</span> ${contact.phone1}</li>
        <li><span>📍</span> ${contact.address3}</li>
      `;
    }
    const certEl = document.getElementById('cert-badges');
    if (certEl && contact.certifications) {
      certEl.innerHTML = contact.certifications.map(c =>
        `<div class="cert-badge">${c}</div>`
      ).join('');
    }
  }

  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
async function loadProducts() {
  const categories = ['spices','oilseeds','edibleoils','sugar','rice','raisins','agri','pulses'];
  const [catData, contact] = await Promise.all([
    Promise.all(categories.map(c => fetchJSON(BASE + '/products/' + c + '.json'))),
    fetchJSON(BASE + '/pages/contact.json')
  ]);

  const listingEl = document.getElementById('products-listing');
  if (listingEl) {
    listingEl.innerHTML = catData.filter(Boolean).map((cat, i) => `
      <div class="category-block reveal" id="${categories[i]}">
        <div class="category-header">
          <h2>${cat.emoji} <em>${cat.name}</em></h2>
          <span class="category-count">${cat.products.length} Products</span>
        </div>
        <div class="products-mini-grid">
          ${cat.products.map(p => `
            <div class="product-mini-card">
              <div class="mini-card-img">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
              </div>
              <div class="mini-card-body">
                <h4>${p.name}</h4>
                <p>${p.sublabel}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Re-run reveal observer on new elements
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
  }

  // Rebuild filter buttons
  const filterEl = document.getElementById('filter-bar');
  if (filterEl) {
    filterEl.innerHTML = `<button class="filter-btn active" data-target="all">All Products</button>` +
      catData.filter(Boolean).map((cat, i) =>
        `<button class="filter-btn" data-target="${categories[i]}">${cat.emoji} ${cat.name}</button>`
      ).join('');

    filterEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.target;
        document.querySelectorAll('.category-block').forEach(b => {
          b.style.display = (target === 'all' || b.id === target) ? '' : 'none';
        });
        if (target !== 'all') {
          const el = document.getElementById(target);
          if (el) {
            setTimeout(() => {
              const top = el.getBoundingClientRect().top + window.scrollY - 120;
              window.scrollTo({ top, behavior: 'smooth' });
            }, 50);
          }
        }
      });
    });
  }

  if (contact) {
    set('footer-tagline', contact.footer_text);
    const fc = document.getElementById('footer-contact');
    if (fc) {
      fc.innerHTML = `
        <li><span>📧</span> ${contact.email1}</li>
        <li><span>📞</span> ${contact.phone1}</li>
        <li><span>📍</span> ${contact.address3}</li>
      `;
    }
  }

  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
async function loadContact() {
  const contact = await fetchJSON(BASE + '/pages/contact.json');
  if (contact) {
    set('contact-email1', contact.email1);
    set('contact-email2', contact.email2);
    set('contact-phone1', contact.phone1);
    set('contact-phone2', contact.phone2);
    set('contact-address1', contact.address1);
    set('contact-address2', contact.address2);
    set('contact-address3', contact.address3);
    set('contact-hours', contact.hours);
    set('footer-tagline', contact.footer_text);
    const fc = document.getElementById('footer-contact');
    if (fc) {
      fc.innerHTML = `
        <li><span>📧</span> ${contact.email1}</li>
        <li><span>📞</span> ${contact.phone1}</li>
        <li><span>📍</span> ${contact.address3}</li>
      `;
    }
    const certEl = document.getElementById('contact-certs');
    if (certEl && contact.certifications) {
      certEl.innerHTML = contact.certifications.map(c =>
        `<span style="padding:6px 12px; background:var(--white); border:1px solid var(--border); border-radius:4px; font-size:0.8rem; font-weight:600; color:var(--green);">${c}</span>`
      ).join('');
    }
    // Quick strip
    set('strip-email', contact.email1);
    set('strip-phone', contact.phone1);

    // Map address
    set('map-address', contact.address2 + ', ' + contact.address3);
  }
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

// ─── ROUTER — detect which page and run the right loader ──────────────────────
const page = window.location.pathname.split('/').pop() || 'index.html';

if (page === '' || page === 'index.html') {
  loadHome();
} else if (page === 'about.html') {
  loadAbout();
} else if (page === 'products.html') {
  loadProducts();
} else if (page === 'contact.html') {
  loadContact();
}

// Netlify Identity redirect for admin
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/';
      });
    }
  });
}
