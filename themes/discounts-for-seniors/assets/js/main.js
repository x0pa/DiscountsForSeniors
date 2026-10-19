// Mobile navigation.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Near-you form: jump to the directory preset to the chosen province.
const nearForm = document.getElementById('near-form');
if (nearForm) {
  nearForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const code = document.getElementById('provincePick').value;
    const base = nearForm.querySelector('button').dataset.dir;
    window.location.href = base + '?province=' + encodeURIComponent(code);
  });
}

// Directory filters. Runs entirely in the browser against the printed list —
// no server, no index, no search engine required.
const dirGrid = document.getElementById('directory-grid');
if (dirGrid) {
  const cards = Array.from(dirGrid.querySelectorAll('.dir-card'));
  const age = document.getElementById('f-age');
  const prov = document.getElementById('f-province');
  const cat = document.getElementById('f-category');
  const day = document.getElementById('f-day');
  const today = document.getElementById('f-today');
  const count = document.getElementById('dir-count');
  const empty = document.getElementById('dir-empty');
  const params = new URLSearchParams(window.location.search);
  if (params.get('age')) age.value = params.get('age');
  if (params.get('province')) prov.value = params.get('province');
  if (params.get('category')) cat.value = params.get('category');
  if (params.get('day')) day.value = params.get('day');

  const filterToggle = document.getElementById('dir-filter-toggle');
  const toolsForm = document.getElementById('dir-tools');
  function setFiltersCollapsed(collapsed) {
    if (!filterToggle || !toolsForm) return;
    toolsForm.classList.toggle('is-collapsed', collapsed);
    filterToggle.setAttribute('aria-expanded', String(!collapsed));
    filterToggle.querySelector('.dft-label').textContent = collapsed ? filterToggle.dataset.show : filterToggle.dataset.hide;
    filterToggle.classList.toggle('is-open', !collapsed);
  }
  if (filterToggle && toolsForm) {
    setFiltersCollapsed(window.matchMedia('(max-width: 760px)').matches);
    filterToggle.addEventListener('click', () => setFiltersCollapsed(!toolsForm.classList.contains('is-collapsed')));
  }

  const todayName = () => new Date().toLocaleDateString(document.documentElement.lang || 'en-CA', { weekday: 'long' });

  function apply() {
    const wantedDay = today.checked ? todayName() : day.value;
    let shown = 0;
    cards.forEach((card) => {
      const okAge = !age.value || Number(card.dataset.age) <= Number(age.value);
      const okProv = !prov.value || card.dataset.provinces === 'All' || card.dataset.provinces.split(',').includes(prov.value);
      const okCat = !cat.value || card.dataset.category === cat.value;
      const days = card.dataset.days.split(',');
      const okDay = !wantedDay || days.includes(dirGrid.dataset.everyday) || days.includes(wantedDay);
      const show = okAge && okProv && okCat && okDay;
      card.hidden = !show;
      if (show) shown += 1;
    });
    count.textContent = shown === cards.length ? dirGrid.dataset.countAll.replace('{n}', cards.length) : dirGrid.dataset.countSome.replace('{n}', shown).replace('{t}', cards.length);
    empty.hidden = shown !== 0;
  }
  [age, prov, cat, day, today].forEach((el) => el.addEventListener('change', apply));
  document.getElementById('dir-reset').addEventListener('click', () => {
    age.value = ''; prov.value = ''; cat.value = ''; day.value = ''; today.checked = false; apply();
  });
  document.getElementById('dir-print').addEventListener('click', () => window.print());
  apply();
}

// Sidebar find-deals form: jump to the directory with presets.
const sideForm = document.querySelector('.side-deals-form');
if (sideForm) {
  sideForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const prov = document.getElementById('sd-prov').value;
    const cat = document.getElementById('sd-cat').value;
    const base = sideForm.querySelector('button').dataset.dir;
    const qs = new URLSearchParams();
    if (prov) qs.set('province', prov);
    if (cat) qs.set('category', cat);
    window.location.href = base + (qs.toString() ? '?' + qs.toString() : '');
  });
}
