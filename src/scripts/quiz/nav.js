import { DATA } from './data';
import { S, answeredCount, radiusAnswered, save } from './state';
import { buildPriority, buildRadius } from './build-domains';
import { buildResults } from './build-results';

/* ═════════════════════════════ NAVIGATION ═════════════════════════════ */
export const ORDER = ['home', 'dom0', 'dom1', 'dom2', 'dom3', 'dom4', 'dom5', 'radius', 'priority', 'results'];
export const SECTION_TABS = ['screen', 'measured', 'handoff'];
export const SECTION_NAMES = ['What you told us', 'To be measured', 'For your doctor'];
export let at = 0;

/* ── Sync quiz-main padding-top to actual header height ── */
export function syncMainPadding(isHome) {
  const header = document.getElementById('quiz-header');
  const main = document.getElementById('quiz-main');
  if (!header || !main) return;
  main.style.paddingTop = isHome ? '0px' : header.offsetHeight + 'px';
}

export function show(i) {
  at = Math.max(0, Math.min(ORDER.length - 1, i));
  const cur = ORDER[at];

  ORDER.forEach((id) => {
    const e = document.getElementById('sc-' + id);
    if (e) e.classList.toggle('on', id === cur);
  });

  /* Header visibility */
  const header = document.getElementById('quiz-header');
  const isHome = cur === 'home';
  const isResults = cur === 'results';
  header.classList.toggle('hidden', isHome);

  /* Question fill bar only — labels stay on Results */
  const track = document.getElementById('prog-track');
  if (track) track.classList.toggle('hidden', isResults);

  /* Bottom nav */
  const nav = document.getElementById('nav');
  nav.classList.toggle('hidden', isHome);

  /* main padding top: always matches actual rendered header height so content never hides under it */
  const main = document.getElementById('quiz-main');
  syncMainPadding(isHome);

  /* Update header progress */
  updateHeaderForScreen(cur);

  if (cur === 'radius') buildRadius();
  if (cur === 'priority') buildPriority();
  if (cur === 'results') {
    S.finished = Date.now();
    save();
    buildResults();
    switchTab('screen', false);
  } else {
    syncNav();
  }

  updateProgress();
  document.getElementById('quiz-main').scrollTo(0, 0);
}

export function updateHeaderForScreen(cur) {
  const progSection = document.getElementById('prog-section');
  const progTab = document.getElementById('prog-tab');

  if (cur.startsWith('dom')) {
    const di = parseInt(cur.replace('dom', ''));
    progSection.textContent = 'Section ' + (di + 1) + ' of 6';
    progTab.textContent = DATA.domains[di];
  } else if (cur === 'radius') {
    progSection.textContent = 'Last section';
    progTab.textContent = 'Activities';
  } else if (cur === 'priority') {
    progSection.textContent = 'Almost done';
    progTab.textContent = 'Priorities';
  } else if (cur === 'results') {
    progSection.textContent = 'Results';
    progTab.textContent = 'Your check-up';
  }
}

export function updateProgress() {
  const total = 96 + 16;
  const done = answeredCount() + radiusAnswered();
  const pct = Math.round((done / total) * 100);
  /* Two-div bar: fill shrinks-to-width, remaining takes the rest */
  const fillEl = document.getElementById('prog-fill');
  const remainEl = document.getElementById('prog-remaining');
  if (fillEl) fillEl.style.width = pct + '%';
  if (remainEl) remainEl.style.display = pct >= 100 ? 'none' : '';
  document.getElementById('prog-count').textContent = done + ' of ' + total + ' answered';
}

/* Current result step index — based on which pane is visible */
export function curTab() {
  return SECTION_TABS.findIndex((t) => {
    const pane = document.getElementById('pane-' + t);
    return pane && pane.classList.contains('on');
  });
}

export function switchTab(name, scroll) {
  SECTION_TABS.forEach((t) => {
    document.getElementById('pane-' + t).classList.toggle('on', t === name);
  });
  syncNav();
  if (scroll) {
    document.getElementById('quiz-main').scrollTo(0, 0);
  }
}

export const NAV_ARROW =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="flex-shrink:0"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function syncNav() {
  const cur = ORDER[at];
  const nextBtn = document.getElementById('btn-next');
  const homeBtn = document.getElementById('btn-home');
  const backBtn = document.getElementById('btn-back');

  backBtn.classList.toggle('hidden', at <= 1);

  if (cur === 'results') {
    const last = curTab() === SECTION_TABS.length - 1;
    nextBtn.classList.toggle('hidden', last);
    if (homeBtn) homeBtn.classList.toggle('hidden', !last);
    if (!last) nextBtn.innerHTML = 'Next ' + NAV_ARROW;
    return;
  }

  nextBtn.classList.remove('hidden');
  if (homeBtn) homeBtn.classList.add('hidden');
  nextBtn.innerHTML = (cur === 'priority' ? 'See my results' : 'Next') + ' ' + NAV_ARROW;
}
