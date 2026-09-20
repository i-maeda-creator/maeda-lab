(() => {
  'use strict';
  function revealSection() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let el = target;
    let opened = false;
    while (el) {
      if (el.tagName === 'DETAILS' && !el.open) { el.open = true; opened = true; }
      el = el.parentElement;
    }
    if (opened) target.scrollIntoView();
  }
  window.addEventListener('hashchange', revealSection);
  revealSection();
  const topics = window.CLOUD_TOPICS || [];
  const ids = new Set(topics.map(t => t.id));
  const key = 'maeda-cloud-reading-v1';
  let state = {read: [], last: null};
  let persisted = true;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && typeof saved === 'object') {
      state.read = Array.isArray(saved.read) ? [...new Set(saved.read.filter(id => ids.has(id)))] : [];
      state.last = ids.has(saved.last) ? saved.last : null;
    }
  } catch { persisted = false; }
  const note = document.querySelector('#storage-note');
  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); persisted = true; }
    catch { persisted = false; }
    if (note) note.textContent = persisted ? '記録はこのブラウザ内に保存されます。別の端末には同期されません。' : 'このブラウザでは保存できません。今回の閲覧中だけ記録します。';
  }
  const current = document.body.dataset.topicId;
  const mark = document.querySelector('#mark-read');
  if (ids.has(current) && mark) {
    state.last = current;
    save();
    mark.disabled = false;
    const paint = () => {
      const read = state.read.includes(current);
      mark.setAttribute('aria-pressed', String(read));
      mark.textContent = read ? '✓ 読了済み（押すと取り消す）' : '読んだことを記録する';
    };
    paint();
    mark.addEventListener('click', () => {
      state.read = state.read.includes(current) ? state.read.filter(id => id !== current) : [...state.read, current];
      save(); paint();
    });
  }
  const input = document.querySelector('#topic-search');
  if (!input) return;
  save(); // Probe whether persistence is available; reading itself may succeed when writes do not.
  document.querySelector('#progress-label').textContent = `${state.read.length} / ${topics.length} トピックを読了`;
  for (const el of document.querySelectorAll('[data-status]')) {
    if (state.read.includes(el.dataset.status)) { el.textContent = '✓ 読了'; el.classList.add('is-read'); }
  }
  const resume = document.querySelector('#resume-link');
  if (state.last) {
    resume.href = `cloud/${state.last}.html`;
    resume.textContent = '前回のページへ →';
  }
  const filter = document.querySelector('#level-filter');
  const clear = document.querySelector('#clear-search');
  const normalize = v => v.normalize('NFKC').toLocaleLowerCase('ja').trim();
  const index = new Map(topics.map(t => [t.id, {level: String(t.level), text: normalize(t.text)}]));
  const params = new URLSearchParams(location.search);
  input.value = params.get('q') || '';
  const selected = params.get('level');
  if ([...filter.options].some(o=>o.value===selected)) filter.value = selected;
  input.disabled = filter.disabled = clear.disabled = false;
  function search() {
    const terms = normalize(input.value).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const card of document.querySelectorAll('[data-topic]')) {
      const entry = index.get(card.dataset.topic);
      const match = entry && (filter.value === 'all' || entry.level === filter.value) && terms.every(t => entry.text.includes(t));
      card.hidden = !match;
      if (match) count++;
    }
    for (const section of document.querySelectorAll('[data-level]')) section.hidden = !section.querySelector('[data-topic]:not([hidden])');
    document.querySelector('#search-count').textContent = `${count} / ${topics.length} トピック`;
    document.querySelector('#no-results').hidden = count !== 0;
    const url = new URL(location.href);
    input.value.trim() ? url.searchParams.set('q', input.value.trim()) : url.searchParams.delete('q');
    filter.value !== 'all' ? url.searchParams.set('level', filter.value) : url.searchParams.delete('level');
    try { history.replaceState(null, '', url); } catch { /* file:// also remains usable */ }
  }
  input.addEventListener('input', search);
  filter.addEventListener('change', search);
  clear.addEventListener('click', () => { input.value = ''; filter.value = 'all'; search(); input.focus(); });
  document.querySelector('#search-form').addEventListener('submit', e => { e.preventDefault(); search(); });
  search();
})();
