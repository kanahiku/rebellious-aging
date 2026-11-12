import { S, el, radiusFlagged, sysScore } from './state';
import { BUILD, DATA } from './data';

export function summaryText() {
  const L = [],
    nl = '\n';
  L.push('REBELLIOUS AGING SELF-ASSESSMENT');
  L.push('Completed ' + new Date().toLocaleDateString());
  L.push('Self-reported. Not a diagnosis. Scores are 0-9 per area; higher means more reported difficulty.');
  if (S.priority.length) {
    L.push('');
    L.push('WHAT I WANT TO KEEP DOING');
    S.priority.forEach((id) => {
      const r = DATA.radius.find((x) => x.id === id);
      if (r) L.push('  - ' + r.label);
    });
  }
  const flagged = radiusFlagged();
  if (flagged.length) {
    L.push('');
    L.push('ACTIVITIES I HAVE CHANGED OR STOPPED');
    flagged.forEach((r) => {
      L.push('  - ' + r.label + '  (' + (S.radius[r.id] === 2 ? 'no longer' : 'changed') + ')');
    });
  }
  const ranked = DATA.systems
    .map((sy) => ({ sy, s: sysScore(sy.id) }))
    .filter((x) => x.s !== null)
    .sort((a, b) => b.s - a.s);
  const shown = ranked.filter((x) => x.s >= 3);
  L.push('');
  L.push('AREAS REPORTED, HIGHEST FIRST');
  if (!shown.length) L.push('  Nothing scored above the reporting threshold.');
  shown.forEach((x) => {
    L.push('  ' + x.s + '/9  ' + x.sy.label + '  (' + DATA.domains[x.sy.domain] + ')');
  });
  L.push('');
  L.push('MEASUREMENTS');
  DATA.measured.forEach((m) => {
    L.push('  ' + m.label + ': ' + (S.measured[m.id] || '________') + ' ' + m.unit);
  });
  L.push('');
  L.push('rebelliousaging.org  |  ' + BUILD + '  |  Produced on my own device; no answers were transmitted.');
  return L.join(nl);
}

export function renderPrintable() {
  const p = document.getElementById('printable');
  p.innerHTML = '';

  /* Blank out browser-injected page-margin text (date, title, URL, page number).
   @page named margin boxes suppress Chrome/Edge/Safari's default content. */
  const blankPageStyle = document.createElement('style');
  blankPageStyle.textContent = [
    '@page {',
    '  @top-left   { content: ""; }',
    '  @top-center { content: ""; }',
    '  @top-right  { content: ""; }',
    '  @bottom-left   { content: ""; }',
    '  @bottom-center { content: ""; }',
    '  @bottom-right  { content: ""; }',
    '}',
  ].join('\n');
  p.appendChild(blankPageStyle);

  const w = el('div', 'rp-wrap');

  /* ── Header ── */
  const hdr = el('header', 'rp-header');
  const hdrRow = el('div', 'rp-header-row');
  hdrRow.appendChild(el('span', 'rp-brand', 'Rebellious Aging'));
  hdrRow.appendChild(el('span', 'rp-header-label', 'Clinical summary'));
  hdr.appendChild(hdrRow);
  const hdrMeta = el('div', 'rp-header-meta');
  hdrMeta.textContent =
    'Completed ' +
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) +
    ' · Self-reported · Not a diagnosis · Scores 0-9 per area (higher = more reported difficulty)';
  hdr.appendChild(hdrMeta);
  w.appendChild(hdr);

  /* ── Disclaimer note ── */
  const note = el('p', 'rp-note');
  note.textContent =
    "This document was produced on the patient's own device using a check-up tool at rebelliousaging.org. It is a structured self-report to support a clinical conversation. It is not a diagnostic instrument.";
  w.appendChild(note);

  /* ── Priorities ── */
  if (S.priority && S.priority.length) {
    const sec = el('section', 'rp-section');
    sec.appendChild(el('h2', 'rp-section-title', 'What this person wants to keep doing'));
    const pills = el('div', 'rp-pills');
    S.priority.forEach((id) => {
      const r = DATA.radius.find((x) => x.id === id);
      if (r) pills.appendChild(el('span', 'rp-pill', r.label));
    });
    sec.appendChild(pills);
    w.appendChild(sec);
  }

  /* ── Changed / stopped activities ── */
  const flagged = radiusFlagged();
  if (flagged.length) {
    const sec = el('section', 'rp-section');
    sec.appendChild(el('h2', 'rp-section-title', 'Activities changed or stopped'));
    flagged.forEach((r) => {
      const row = el('div', 'rp-flag-row');
      row.appendChild(el('span', 'rp-flag-label', r.label));
      const stopped = S.radius[r.id] === 2;
      row.appendChild(
        el(
          'span',
          'rp-flag-tag ' + (stopped ? 'rp-tag-stopped' : 'rp-tag-changed'),
          stopped ? 'No longer' : 'Changed'
        )
      );
      sec.appendChild(row);
    });
    w.appendChild(sec);
  }

  /* ── Areas flagged — sorted by score ── */
  const ranked = DATA.systems
    .map((sy) => ({ sy, s: sysScore(sy.id) }))
    .filter((x) => x.s !== null)
    .sort((a, b) => b.s - a.s);
  const flaggedSys = ranked.filter((x) => x.s >= 3);
  const sec1 = el('section', 'rp-section');
  sec1.appendChild(el('h2', 'rp-section-title', 'Areas flagged, sorted by score'));
  if (!flaggedSys.length) {
    sec1.appendChild(el('p', 'rp-mini-na', 'Nothing scored above the reporting threshold (3/9).'));
  } else {
    flaggedSys.forEach(({ sy, s }) => {
      const row = el('div', 'rp-score-row');
      row.appendChild(el('div', 'rp-score-label', sy.label));
      row.appendChild(el('div', 'rp-score-domain', DATA.domains[sy.domain]));
      const barWrap = el('div', 'rp-score-bar-wrap');
      const bar = el('div', 'rp-score-bar' + (s >= 7 ? ' rp-bar-high' : s >= 5 ? ' rp-bar-mid' : ''));
      bar.style.width = Math.round((s / 9) * 100) + '%';
      barWrap.appendChild(bar);
      row.appendChild(barWrap);
      row.appendChild(el('div', 'rp-score-val', s + '/9'));
      sec1.appendChild(row);
    });
  }
  w.appendChild(sec1);

  /* ── All 32 systems — complete overview ── */
  const sec2 = el('section', 'rp-section');
  sec2.appendChild(el('h2', 'rp-section-title', 'All systems: complete overview'));
  DATA.domains.forEach((domain, di) => {
    const systems = DATA.systems.filter((sy) => sy.domain === di);
    const domLabel = el('div', 'rp-domain-label', domain);
    sec2.appendChild(domLabel);
    systems.forEach((sy) => {
      const s = sysScore(sy.id);
      const row = el('div', 'rp-mini-row');
      row.appendChild(el('span', 'rp-mini-label', sy.label));
      if (s !== null) {
        const bw = el('span', 'rp-mini-bar-wrap');
        const b = el('span', 'rp-mini-bar');
        b.style.width = Math.round((s / 9) * 100) + '%';
        bw.appendChild(b);
        row.appendChild(bw);
        row.appendChild(el('span', 'rp-mini-val', s + '/9'));
      } else {
        const na = el('span', 'rp-mini-na', 'not answered');
        na.style.gridColumn = '2 / 4';
        row.appendChild(na);
      }
      sec2.appendChild(row);
    });
  });
  w.appendChild(sec2);

  /* ── Measurements ── */
  const sec3 = el('section', 'rp-section');
  sec3.appendChild(el('h2', 'rp-section-title', 'Eight measurements to collect'));
  const measNote = el('p', 'rp-meas-note');
  measNote.textContent =
    'These cannot be measured reliably at home. A free 20-minute measurement visit is available at Athena Clinic, Honolulu. rebelliousaging.org/measure';
  sec3.appendChild(measNote);
  const tbl = el('table', 'rp-table');
  const thead = el('thead');
  const headRow = el('tr');
  ['Test', 'How it is measured', 'Reference range', 'Result'].forEach((h) => {
    const th = el('th');
    th.textContent = h;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  tbl.appendChild(thead);
  const tbody = el('tbody');
  DATA.measured.forEach((m) => {
    const tr = el('tr');
    tr.appendChild(el('td', 'rp-meas-name', m.label));
    tr.appendChild(el('td', null, m.how));
    const refTd = el('td', 'rp-meas-ref');
    refTd.textContent = m.ref || '-';
    tr.appendChild(refTd);
    const resultTd = el('td', 'rp-meas-result');
    resultTd.textContent = S.measured && S.measured[m.id] ? S.measured[m.id] + ' ' + m.unit : '________';
    tr.appendChild(resultTd);
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
  sec3.appendChild(tbl);
  w.appendChild(sec3);

  /* Footer removed — browser headers/footers suppressed via @page margin:0 */

  p.appendChild(w);
}
