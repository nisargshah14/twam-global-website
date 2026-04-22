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

  function patch(el, value) {
    if (!value) return;
    if (el.tagName === 'IMG') el.src = value;
    else if (el.tagName === 'A' && el.dataset.cmsHref) el.href = value;
    else el.innerHTML = value;
  }

  function hideEl(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    if (val) el.textContent = val;
    else el.style.display = 'none';
  }

  function observeReveal(container) {
    container.querySelectorAll('.reveal').forEach(el => window.revealObserver?.observe(el));
  }

  // ── Section functions ──────────────────────────────────────────

  function applyDataCms(dataMap) {
    document.querySelectorAll('[data-cms]').forEach(el => {
      const key    = el.dataset.cms;
      const source = key.split('.')[0];
      const subkey = key.split('.').slice(1).join('.');
      const data   = dataMap[source];
      if (!data) return;
      const value = get(data, subkey);
      if (value === '') el.style.display = 'none';
      else if (value !== null) patch(el, value);
    });
  }

  function applyHeroCarousel(home) {
    const container = document.getElementById('hero-carousel');
    const dotsEl    = document.getElementById('hero-dots');
    const prevBtn   = document.getElementById('hero-prev');
    const nextBtn   = document.getElementById('hero-next');
    if (!container) return;

    const slides  = home?.hero?.carousel_slides;
    const fallback = home?.hero?.hero_image;
    const images  = (slides && slides.length > 0)
      ? slides.map(s => ({ src: s.image, alt: s.alt || 'TWAM Global' })).filter(s => s.src)
      : (fallback ? [{ src: fallback, alt: 'TWAM Global' }] : []);

    if (images.length === 0) return;

    container.innerHTML = images.map((img, i) =>
      `<div class="hero-slide${i === 0 ? ' active' : ''}" style="background-image:url('${img.src}')" aria-label="${img.alt}"></div>`
    ).join('');

    if (dotsEl) {
      dotsEl.innerHTML = images.map((_, i) =>
        `<button class="hero-dot${i === 0 ? ' active' : ''}" data-idx="${i}" aria-label="Slide ${i + 1}"></button>`
      ).join('');
    }

    if (images.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (dotsEl)  dotsEl.style.display  = 'none';
      return;
    }

    let current = 0;
    let timer;

    function goTo(idx) {
      const sl = container.querySelectorAll('.hero-slide');
      const dt = dotsEl?.querySelectorAll('.hero-dot');
      current  = (idx + sl.length) % sl.length;
      sl.forEach(s => s.classList.remove('active'));
      dt?.forEach(d => d.classList.remove('active'));
      sl[current]?.classList.add('active');
      dt?.[current]?.classList.add('active');
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 5000);
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    dotsEl?.querySelectorAll('.hero-dot').forEach(d => {
      d.addEventListener('click', () => goTo(+d.dataset.idx));
    });

    timer = setInterval(() => goTo(current + 1), 5000);
  }

  function applyHomeStats(home) {
    const el = document.getElementById('hero-stats');
    if (!el || !home?.hero?.stats) return;
    el.innerHTML = home.hero.stats.map((s, i) =>
      (i > 0 ? '<div class="stat-div"></div>' : '') +
      `<div class="stat">
        <span class="stat-num">${s.num}</span>
        <span class="stat-label">${s.label}</span>
      </div>`
    ).join('');
  }

  function applyWhyUs(home) {
    const grid = document.getElementById('why-grid');
    if (!grid || !home?.why_us?.cards) return;
    grid.innerHTML = home.why_us.cards.map((c, i) => `
      <div class="why-card reveal${i % 3 === 1 ? ' delay-1' : i % 3 === 2 ? ' delay-2' : ''}">
        <div class="why-icon"><span style="font-size:1.5rem">${c.icon}</span></div>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
      </div>
    `).join('');
    observeReveal(grid);
  }

  function applyHomeProductGrid(catOrder, categories) {
    const grid = document.getElementById('home-product-grid');
    if (!grid) return;
    grid.innerHTML = catOrder.map((id, i) => {
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
    observeReveal(grid);
  }

  function applyMarquee(catOrder, categories) {
    const el = document.getElementById('marquee-track');
    if (!el) return;
    const names   = catOrder.map(id => categories[id]?.name).filter(Boolean);
    const doubled = [...names, ...names];
    el.innerHTML  = doubled.map(n => `<span>${n}</span><span class="dot">◆</span>`).join('');
  }

  function applyAboutStats(about) {
    const sg = document.getElementById('about-stats-grid');
    if (!sg || !about?.stats) return;
    sg.innerHTML = about.stats.map((s, i) => `
      <div class="value-item reveal${i > 0 ? ' delay-' + Math.min(i, 3) : ''}">
        <div class="value-num">${s.num}</div>
        <div class="value-label">${s.label}</div>
      </div>
    `).join('');
    observeReveal(sg);
  }

  function applyCertifications(contact) {
    if (!contact?.certifications) return;
    document.querySelectorAll('.cert-badges-dynamic').forEach(el => {
      el.innerHTML = contact.certifications.map(c => `<div class="cert-badge">${c}</div>`).join('');
    });
    const chips = document.getElementById('cert-chips');
    if (chips) {
      chips.innerHTML = contact.certifications.map(c =>
        `<span style="padding:6px 12px;background:var(--white);border:1px solid var(--border);border-radius:4px;font-size:0.8rem;font-weight:600;color:var(--green);">${c}</span>`
      ).join('');
    }
  }

  function applyContactDetails(contact) {
    if (!contact) return;

    // footer contact list — only render non-empty lines
    const fc = document.getElementById('footer-contact-list');
    if (fc) {
      fc.innerHTML = [
        contact.email1   ? `<li><span>📧</span> ${contact.email1}</li>`   : '',
        contact.phone1   ? `<li><span>📞</span> ${contact.phone1}</li>`   : '',
        contact.address3 ? `<li><span>📍</span> ${contact.address3}</li>` : '',
      ].join('');
    }
    const ft = document.getElementById('footer-tagline');
    if (ft && contact.footer_text) ft.textContent = contact.footer_text;

    // contact page detail spans
    ['email1','email2','phone1','phone2','address1','address2','address3','hours'].forEach(f => {
      setText('c-' + f, contact[f]);
    });

    // hide secondary line wrappers when absent
    ['email2','phone2','address2','address3'].forEach(f => {
      if (!contact[f]) hideEl('c-' + f + '-line');
    });

    // hide entire contact blocks when all their content is absent
    if (!contact.email1 && !contact.email2)                         hideEl('contact-block-email');
    if (!contact.phone1 && !contact.phone2)                         hideEl('contact-block-phone');
    if (!contact.address1 && !contact.address2 && !contact.address3) hideEl('contact-block-address');
    if (!contact.hours)                                             hideEl('contact-block-hours');

    // strip
    const se = document.getElementById('strip-email');
    if (se && contact.email1) { se.textContent = contact.email1; se.href = 'mailto:' + contact.email1; }
    else hideEl('strip-block-email');

    const sp = document.getElementById('strip-phone');
    if (sp && contact.phone1) sp.textContent = contact.phone1;
    else hideEl('strip-block-phone');

    const sr = document.getElementById('strip-response');
    if (sr && contact.strip_response_time) sr.textContent = contact.strip_response_time;
    else hideEl('strip-block-response');

    const sc = document.getElementById('strip-countries');
    if (sc && contact.strip_countries) sc.textContent = contact.strip_countries;
    else hideEl('strip-block-countries');

    // map
    const ml = document.getElementById('map-link');
    if (ml && contact.maps_url) ml.href = contact.maps_url;
    else hideEl('map-link');
    setText('c-address3-map', contact.address3);
  }

  function applyProductsPage(catOrder, categories) {
    const listing = document.getElementById('products-listing');
    if (!listing) return;

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
    observeReveal(listing);

    const filterBar = document.getElementById('filter-bar');
    if (!filterBar) return;

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

  // ── Apply all sections ─────────────────────────────────────────
  applyDataCms({ home, about, contact });
  applyHeroCarousel(home);
  applyHomeStats(home);
  applyWhyUs(home);
  applyHomeProductGrid(catOrder, categories);
  applyMarquee(catOrder, categories);
  applyAboutStats(about);
  applyCertifications(contact);
  applyContactDetails(contact);
  applyProductsPage(catOrder, categories);

  const fy = document.getElementById('footer-year');
  if (fy) fy.textContent = new Date().getFullYear();

  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => {
      if (!user) window.netlifyIdentity.on('login', () => { document.location.href = '/admin/'; });
    });
  }

})();
