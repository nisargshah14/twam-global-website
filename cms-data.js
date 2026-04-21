/**
 * TWAM GLOBAL — CMS Data Patcher
 * 
 * Strategy: The HTML keeps its full original structure & design.
 * This script ONLY patches text/images into elements that have
 * data-cms="key.path" attributes — everything else is untouched.
 * 
 * Admin saves content → JSON files update → this script reads them
 * → patches values into the exact right spots on page load.
 */

(async function () {

  // ── Fetch helpers ──────────────────────────────────────────────
  async function load(path) {
    try {
      const r = await fetch(path + '?_=' + Date.now());
      return r.ok ? await r.json() : null;
    } catch { return null; }
  }

  function get(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }

  // ── Patch a single element ──────────────────────────────────────
  function patch(el, value) {
    if (!value) return;
    if (el.tagName === 'IMG') {
      el.src = value;
    } else if (el.tagName === 'A' && el.dataset.cmsHref) {
      el.href = value;
    } else {
      el.innerHTML = value; // allows <br>, <em> etc.
    }
  }

  // ── Load all JSON files needed for this page ───────────────────
  const page = location.pathname.split('/').pop() || 'index.html';

  const [home, about, contact, spices, oilseeds, edibleoils, sugar, rice, raisins, agri, pulses] =
    await Promise.all([
      (page === '' || page === 'index.html') ? load('/content/pages/home.json') : Promise.resolve(null),
      (page === 'about.html' || page === '' || page === 'index.html') ? load('/content/pages/about.json') : Promise.resolve(null),
      load('/content/pages/contact.json'),
      load('/content/products/spices.json'),
      load('/content/products/oilseeds.json'),
      load('/content/products/edibleoils.json'),
      load('/content/products/sugar.json'),
      load('/content/products/rice.json'),
      load('/content/products/raisins.json'),
      load('/content/products/agri.json'),
      load('/content/products/pulses.json'),
    ]);

  const categories = { spices, oilseeds, edibleoils, sugar, rice, raisins, agri, pulses };
  const catOrder   = ['spices','oilseeds','edibleoils','sugar','rice','raisins','agri','pulses'];

  // ── 1. Patch data-cms attributes (generic) ────────────────────
  document.querySelectorAll('[data-cms]').forEach(el => {
    const key    = el.dataset.cms;       // e.g. "home.hero.headline"
    const source = key.split('.')[0];    // "home" | "about" | "contact"
    const subkey = key.split('.').slice(1).join('.');

    const map = { home, about, contact };
    const data = map[source];
    if (!data) return;

    const value = get(data, subkey);
    if (value !== null) patch(el, value);
  });

  // ── 2. Hero stats (home) ──────────────────────────────────────
  if (home?.hero?.stats) {
    const statsEl = document.getElementById('hero-stats');
    if (statsEl) {
      statsEl.innerHTML = home.hero.stats.map((s, i) =>
        (i > 0 ? '<div class="stat-div"></div>' : '') +
        `<div class="stat">
          <span class="stat-num">${s.num}</span>
          <span class="stat-label">${s.label}</span>
        </div>`
      ).join('');
    }
  }

  // ── 3. Why Choose Us cards (home) ────────────────────────────
  if (home?.why_us?.cards) {
    const grid = document.getElementById('why-grid');
    if (grid) {
      grid.innerHTML = home.why_us.cards.map((c, i) => `
        <div class="why-card reveal${i % 3 === 1 ? ' delay-1' : i % 3 === 2 ? ' delay-2' : ''}">
          <div class="why-icon"><span style="font-size:1.5rem">${c.icon}</span></div>
          <h3>${c.title}</h3>
          <p>${c.desc}</p>
        </div>
      `).join('');
      grid.querySelectorAll('.reveal').forEach(el => window.revealObserver?.observe(el));
    }
  }

  // ── 4. Product grid on home page ─────────────────────────────
  const homeGrid = document.getElementById('home-product-grid');
  if (homeGrid) {
    homeGrid.innerHTML = catOrder.map((id, i) => {
      const c = categories[id];
      if (!c) return '';
      const delay = i % 3 === 1 ? ' delay-1' : i % 3 === 2 ? ' delay-2' : '';
      return `
        <a href="products.html#${id}" class="product-card reveal${delay}">
          <div class="card-img-wrap">
            <img src="${c.cover_image}" alt="${c.name}" loading="lazy">
            <div class="card-overlay"></div>
          </div>
          <div class="card-body">
            <h3>${c.emoji} ${c.name}</h3>
            <p>${c.description}</p>
            <span class="card-link">View Category →</span>
          </div>
        </a>`;
    }).join('');
    homeGrid.querySelectorAll('.reveal').forEach(el => window.revealObserver?.observe(el));
  }

  // ── 5. Marquee bar ────────────────────────────────────────────
  const marqueeEl = document.getElementById('marquee-track');
  if (marqueeEl) {
    const names = catOrder.map(id => categories[id]?.name).filter(Boolean);
    const doubled = [...names, ...names];
    marqueeEl.innerHTML = doubled.map(n => `<span>${n}</span><span class="dot">◆</span>`).join('');
  }

  // ── 6. About stats (about page) ──────────────────────────────
  if (about?.stats) {
    const sg = document.getElementById('about-stats-grid');
    if (sg) {
      sg.innerHTML = about.stats.map((s, i) => `
        <div class="value-item reveal${i > 0 ? ' delay-' + Math.min(i, 3) : ''}">
          <div class="value-num">${s.num}</div>
          <div class="value-label">${s.label}</div>
        </div>
      `).join('');
      sg.querySelectorAll('.reveal').forEach(el => window.revealObserver?.observe(el));
    }
  }

  // ── 7. Certifications (home + about) ─────────────────────────
  if (contact?.certifications) {
    document.querySelectorAll('.cert-badges-dynamic').forEach(el => {
      el.innerHTML = contact.certifications.map(c => `<div class="cert-badge">${c}</div>`).join('');
    });
    // also mini cert chips on contact page
    const chips = document.getElementById('cert-chips');
    if (chips) {
      chips.innerHTML = contact.certifications.map(c =>
        `<span style="padding:6px 12px;background:var(--white);border:1px solid var(--border);border-radius:4px;font-size:0.8rem;font-weight:600;color:var(--green);">${c}</span>`
      ).join('');
    }
  }

  // ── 8. Footer contact details (all pages) ────────────────────
  if (contact) {
    const fc = document.getElementById('footer-contact-list');
    if (fc) {
      fc.innerHTML = `
        <li><span>📧</span> ${contact.email1}</li>
        <li><span>📞</span> ${contact.phone1}</li>
        <li><span>📍</span> ${contact.address3}</li>
      `;
    }
    // footer tagline
    const ft = document.getElementById('footer-tagline');
    if (ft) ft.textContent = contact.footer_text;

    // contact page detail spans
    const fields = ['email1','email2','phone1','phone2','address1','address2','address3','hours'];
    fields.forEach(f => {
      const el = document.getElementById('c-' + f);
      if (el && contact[f]) el.textContent = contact[f];
    });

    // strip at bottom of contact page
    const se = document.getElementById('strip-email');
    const sp = document.getElementById('strip-phone');
    if (se) { se.textContent = contact.email1; se.href = 'mailto:' + contact.email1; }
    if (sp) sp.textContent = contact.phone1;
  }

  // ── 9. Products page — full dynamic listing ───────────────────
  const listing = document.getElementById('products-listing');
  if (listing) {
    listing.innerHTML = catOrder.map(id => {
      const c = categories[id];
      if (!c) return '';
      return `
        <div class="category-block reveal" id="${id}">
          <div class="category-header">
            <h2>${c.emoji} <em>${c.name}</em></h2>
            <span class="category-count">${c.products.length} Products</span>
          </div>
          <div class="products-mini-grid">
            ${c.products.map(p => `
              <div class="product-mini-card">
                <div class="mini-card-img">
                  <img src="${p.image}" alt="${p.name}" loading="lazy">
                </div>
                <div class="mini-card-body">
                  <h4>${p.name}</h4>
                  <p>${p.sublabel}</p>
                </div>
              </div>`).join('')}
          </div>
        </div>`;
    }).join('');
    listing.querySelectorAll('.reveal').forEach(el => window.revealObserver?.observe(el));

    // rebuild filter buttons to reflect CMS names
    const filterBar = document.getElementById('filter-bar');
    if (filterBar) {
      filterBar.innerHTML =
        `<button class="filter-btn active" data-target="all">All Products</button>` +
        catOrder.map(id => {
          const c = categories[id];
          return c ? `<button class="filter-btn" data-target="${id}">${c.emoji} ${c.name}</button>` : '';
        }).join('');

      filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const t = btn.dataset.target;
          document.querySelectorAll('.category-block').forEach(b => {
            b.style.display = (t === 'all' || b.id === t) ? '' : 'none';
          });
          if (t !== 'all') {
            setTimeout(() => {
              const el = document.getElementById(t);
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
            }, 50);
          }
        });
      });
    }
  }

  // ── 10. Footer year ──────────────────────────────────────────
  const fy = document.getElementById('footer-year');
  if (fy) fy.textContent = new Date().getFullYear();

  // ── Netlify Identity redirect ──────────────────────────────────
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => {
      if (!user) window.netlifyIdentity.on('login', () => { document.location.href = '/admin/'; });
    });
  }

})();
