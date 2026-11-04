(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const initIcons = () => window.lucide && lucide.createIcons({ attrs: { 'stroke-width': 2.25 } });
  initIcons();
  $('#year').textContent = new Date().getFullYear();

  /* Mobile navigation */
  const nav = $('.pq-nav'), toggle = $('.pq-nav__toggle');
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener('click', (e) => { if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false); });
  $$('.pq-nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));

  /* Move focus to in-page targets so keyboard & screen-reader users land in the section */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    setTimeout(() => target.focus({ preventScroll: true }), 0);
  });

  /* Highlight current section in nav */
  const links = $$('.pq-nav [data-link]');
  const setCurrent = (id) => links.forEach((l) => (l.dataset.link === id && l.classList.contains('pq-nav__link')) ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setCurrent(en.target.dataset.nav); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('[data-nav]').forEach((s) => io.observe(s));
  }

  /* Pet filters */
  const filters = $$('[data-filter]'), cards = $$('.pq-pet'), count = $('#pet-count');
  filters.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter; let n = 0;
    filters.forEach((b) => b.setAttribute('aria-pressed', b === btn));
    cards.forEach((c) => { const show = f === 'all' || c.dataset.group === f; c.hidden = !show; if (show) n++; });
    count.textContent = `Showing ${n} ${n === 1 ? 'animal' : 'animals'}`;
  }));

  /* Pet profile dialog */
  const dlg = $('#pet-dialog'); let opener = null;
  $$('[data-meet]').forEach((btn) => btn.addEventListener('click', () => {
    const c = btn.closest('.pq-pet'), d = c.dataset, img = c.querySelector('img'), chip = c.querySelector('.pq-pet__species');
    $('#pd-img').src = img.src; $('#pd-img').alt = img.alt;
    $('#pd-species').textContent = d.species; $('#pd-species').className = chip.className;
    $('#pd-name').textContent = `Hi, I'm ${d.name}`;
    $('#pd-desc').textContent = c.querySelector('.pq-pet__desc').textContent;
    $('#pd-age').textContent = d.age; $('#pd-sex').textContent = d.sex; $('#pd-size').textContent = d.size; $('#pd-good').textContent = d.good;
    $('#pd-ask').href = `mailto:adopt@pawquest.org?subject=${encodeURIComponent('Question about ' + d.name)}`;
    $('#pd-ask span').textContent = `Ask about ${d.name}`;
    opener = btn;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }));
  const closeDlg = () => dlg.close ? dlg.close() : dlg.removeAttribute('open');
  $('#pd-close').addEventListener('click', closeDlg);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) closeDlg(); });
  dlg.addEventListener('close', () => { if (opener && !dlg.dataset.leaving) opener.focus(); delete dlg.dataset.leaving; });
  $('#pd-start').addEventListener('click', () => { dlg.dataset.leaving = '1'; closeDlg(); });

  /* Volunteer form */
  const vf = $('#vol-form');
  const validate = (input) => { const ok = input.checkValidity(); input.setAttribute('aria-invalid', !ok); return ok; };
  $$('input[required]', vf).forEach((i) => i.addEventListener('blur', () => i.value && validate(i)));
  vf.addEventListener('submit', (e) => {
    e.preventDefault();
    const req = $$('input[required]', vf), bad = req.filter((i) => !validate(i));
    if (bad.length) { bad[0].focus(); return; }
    const role = vf.role.value, name = vf.name.value.trim().split(' ')[0];
    $('#vol-success-msg').textContent = `Thanks, ${name}! We'll email you the date of our next ${role.toLowerCase()} orientation.`;
    vf.hidden = true; const s = $('#vol-success'); s.hidden = false; s.focus();
  });

  /* Donation form */
  const df = $('#don-form');
  const impact = { 15: 'a bag of nutritious food for a shelter cat', 35: 'a week of food and care for a rescued animal', 75: 'vaccines and a microchip for one pet', 150: "a rescued dog's spay or neuter surgery" };
  const updateDonate = () => {
    const amt = df.amount.value, monthly = df.freq.value === 'monthly';
    $('#impact-text').textContent = `$${amt}${monthly ? ' a month' : ''} provides ${impact[amt]}.`;
    $('#don-btn span:last-child').textContent = `Donate $${amt}${monthly ? ' monthly' : ''}`;
  };
  df.addEventListener('change', updateDonate);
  df.addEventListener('submit', (e) => {
    e.preventDefault();
    const amt = df.amount.value, monthly = df.freq.value === 'monthly';
    $('#don-success-msg').textContent = `Your $${amt}${monthly ? ' monthly' : ''} gift provides ${impact[amt]}. (Prototype — no payment was taken.)`;
    df.hidden = true; const s = $('#don-success'); s.hidden = false; s.focus();
  });
})();
