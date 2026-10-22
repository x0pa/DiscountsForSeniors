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
  const search = document.getElementById('f-search');
  const artBox = document.getElementById('dir-articles');
  const artList = document.getElementById('dir-articles-list');
  const count = document.getElementById('dir-count');
  const empty = document.getElementById('dir-empty');
  const params = new URLSearchParams(window.location.search);
  if (params.get('age')) age.value = params.get('age');
  if (params.get('province')) prov.value = params.get('province');
  if (params.get('category')) cat.value = params.get('category');
  if (params.get('day')) day.value = params.get('day');
  if (params.get('q')) search.value = params.get('q');

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

  const norm = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let searchIndex = null;
  let searchLoading = false;
  function ensureIndex() {
    if (searchIndex || searchLoading) return;
    searchLoading = true;
    fetch(dirGrid.dataset.searchIndex).then((r) => r.json()).then((d) => { searchIndex = d; apply(); }).catch(() => { searchLoading = false; });
  }
  const cardUrl = (card) => card.querySelector('h3 a').getAttribute('href');
  function entryCore(e) {
    return norm([e.title, e.retailer, e.discount, e.category, (e.days || []).join(' '), (e.provinces || []).join(' '), e.age ? e.age + ' ' + e.age + '+' : ''].join(' '));
  }
  function entryHay(e) {
    return entryCore(e) + ' ' + norm(e.text || '');
  }
  function matchEntries(toks) {
    const core = searchIndex.entries.filter((e) => toks.every((tk) => entryCore(e).includes(tk)));
    const pool = core.length ? core : searchIndex.entries.filter((e) => toks.every((tk) => entryHay(e).includes(tk)));
    return new Set(pool.map((e) => e.url));
  }

  function apply() {
    const wantedDay = today.checked ? todayName() : day.value;
    const toks = norm(search.value).split(/\s+/).filter(Boolean);
    let entryMatch = null;
    let artCount = 0;
    if (toks.length && searchIndex) {
      entryMatch = matchEntries(toks);
      const hits = searchIndex.articles.filter((a) => toks.every((tk) => norm(a.title).includes(tk)));
      artCount = hits.length;
      artList.replaceChildren(...hits.map((a) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.url;
        link.textContent = a.title;
        li.appendChild(link);
        return li;
      }));
    }
    artBox.hidden = artCount === 0;
    let shown = 0;
    cards.forEach((card) => {
      const okAge = !age.value || Number(card.dataset.age) <= Number(age.value);
      const okProv = !prov.value || card.dataset.provinces === 'All' || card.dataset.provinces.split(',').includes(prov.value);
      const okCat = !cat.value || card.dataset.category === cat.value;
      const days = card.dataset.days.split(',');
      const okDay = !wantedDay || days.includes(dirGrid.dataset.everyday) || days.includes(wantedDay);
      const okSearch = !toks.length || !searchIndex || entryMatch.has(cardUrl(card));
      const show = okAge && okProv && okCat && okDay && okSearch;
      card.hidden = !show;
      if (show) shown += 1;
    });
    count.textContent = shown === cards.length ? dirGrid.dataset.countAll.replace('{n}', cards.length) : dirGrid.dataset.countSome.replace('{n}', shown).replace('{t}', cards.length);
    empty.hidden = !(shown === 0 && artCount === 0);
  }
  [age, prov, cat, day, today].forEach((el) => el.addEventListener('change', apply));
  search.addEventListener('input', () => { ensureIndex(); apply(); });
  search.addEventListener('focus', ensureIndex);
  document.getElementById('dir-reset').addEventListener('click', () => {
    age.value = ''; prov.value = ''; cat.value = ''; day.value = ''; today.checked = false; search.value = ''; apply();
  });
  document.getElementById('dir-print').addEventListener('click', () => window.print());
  if (search.value) ensureIndex();
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
