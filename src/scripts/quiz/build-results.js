import { S, band, el, radiusAnswered, radiusFlagged, save, sysById, sysScore } from './state';
import { renderPrintable } from './printable';
import { BANDTXT, DATA } from './data';

/* ═════════════════════════════ BUILD RESULTS ═════════════════════════════ */
export function buildResults() {
  const sc = document.getElementById('pane-screen');
  sc.innerHTML = '';
  const flagged = radiusFlagged();

  if (radiusAnswered()) {
    const rc = el('div', 'quiz-card');
    rc.appendChild(el('h3', 'quiz-card-subheading', 'The things you want to keep doing'));
    const applicable = DATA.radius.filter((r) => S.radius[r.id] !== 'n' && S.radius[r.id] !== undefined).length;
    rc.appendChild(
      el('p', 'quiz-small', 'You noted changes in ' + flagged.length + ' of ' + applicable + ' activities.')
    );
    if (flagged.length) {
      const ul = el('div');
      ul.style.marginBottom = '12px';
      flagged.forEach((r) => ul.appendChild(el('span', 'quiz-pill', r.label)));
      rc.appendChild(ul);
      const tally = {};
      flagged.forEach((r) =>
        r.sys.forEach((s) => {
          tally[s] = (tally[s] || 0) + 1;
        })
      );
      const multi = Object.keys(tally).filter((k) => tally[k] >= 2);
      if (multi.length) {
        const names = multi.map((k) => {
          const s = sysById(k);
          return s ? s.label.toLowerCase() : k;
        });
        rc.appendChild(el('p', 'quiz-small', 'Several of these involve the same areas: ' + names.join(', ') + '.'));
      }
    }
    if (S.priority.length) {
      rc.appendChild(el('h3', 'quiz-card-subheading', 'What matters most to you'));
      const pl = el('div');
      pl.style.marginBottom = '8px';
      S.priority.forEach((id) => {
        const r = DATA.radius.find((x) => x.id === id);
        if (r) pl.appendChild(el('span', 'quiz-pill', r.label));
      });
      rc.appendChild(pl);
    }
    rc.appendChild(
      el(
        'p',
        'quiz-small',
        'Changes like these have many causes, including things going on in your life. They are worth raising with a clinician.'
      )
    );
    sc.appendChild(rc);
  }

  DATA.domains.forEach((dn, di) => {
    const card = el('div', 'quiz-card');
    card.appendChild(el('h3', 'quiz-card-subheading', dn));
    DATA.systems.forEach((sy) => {
      if (sy.domain !== di) return;
      const s = sysScore(sy.id),
        b = band(s);
      const row = el('div', 'quiz-result-row');
      row.appendChild(el('div', 'quiz-result-name', sy.label));
      row.appendChild(el('div', 'quiz-result-tag quiz-tag-' + (b < 0 ? 0 : b), b < 0 ? 'Not answered' : BANDTXT[b]));
      card.appendChild(row);
    });
    sc.appendChild(card);
  });

  const moodScore = sysScore('mood');
  if (moodScore !== null && moodScore >= 5) {
    const mn = el('div', 'quiz-card');
    mn.appendChild(el('h3', 'quiz-card-subheading', 'One thing worth saying plainly'));
    mn.appendChild(
      el(
        'p',
        'quiz-small',
        'Some of your answers describe low mood, lost interest or persistent worry. That is common, it is treatable, and it changes how everything else on this page feels. It is worth telling a doctor about even if nothing else here is.'
      )
    );
    mn.appendChild(
      el(
        'p',
        'quiz-small',
        'If things feel worse than that, you can call or text 988 in the US at any hour, or your local crisis line elsewhere.'
      )
    );
    sc.appendChild(mn);
  }

  const d = el('div', 'quiz-note');
  d.textContent =
    'This is not a diagnosis and it does not measure disease. It lists areas worth discussing with a clinician.';
  sc.appendChild(d);

  buildMeasured();
  buildHandoff();
}

export function buildMeasured() {
  const me = document.getElementById('pane-measured');
  me.innerHTML = '';
  const safety = el('div', 'quiz-card');
  safety.appendChild(el('h3', 'quiz-card-subheading', 'Before anyone does the movement measurements'));
  safety.appendChild(
    el(
      'p',
      'quiz-small',
      'Ask a doctor first if you have heart disease or chest pain on exertion, have fallen in the past six months, have osteoporosis or a fragility fracture, have had surgery in the last six months, feel dizzy on standing, or simply feel unwell today. Always do the balance and chair tests next to a wall or a partner who can steady you, never on your own.'
    )
  );
  me.appendChild(safety);
  const mc = el('div', 'quiz-card');
  mc.appendChild(el('h3', 'quiz-card-subheading', 'Eight things you cannot measure properly at home'));
  mc.appendChild(
    el(
      'p',
      'quiz-small',
      'Take this page to a clinician, or have them done at a measurement visit. Enter them here afterwards so next year has something to compare with.'
    )
  );
  DATA.measured.forEach((m) => {
    const r = el('div', 'quiz-measure-row');
    const L = el('div');
    L.appendChild(el('div', 'quiz-measure-label', m.label));
    L.appendChild(el('div', 'quiz-measure-how', m.how));
    if (m.ref) L.appendChild(el('div', 'quiz-measure-ref', m.ref));
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = m.unit;
    inp.value = S.measured[m.id] || '';
    inp.className = 'quiz-measure-input';
    inp.oninput = function () {
      S.measured[m.id] = inp.value.slice(0, 20);
      save();
    };
    r.appendChild(L);
    r.appendChild(inp);
    mc.appendChild(r);
  });
  mc.appendChild(el('p', 'quiz-small', 'These reference points are population figures, not verdicts about you.'));
  me.appendChild(mc);

}

export function buildHandoff() {
  const h = document.getElementById('pane-handoff');
  h.innerHTML = '';

  /* ── Card 1: Download / Print — always visible ── */
  const dlCard = el('div', 'quiz-card');
  dlCard.id = 'handoff-dl-card';
  dlCard.appendChild(el('h3', 'quiz-card-subheading', 'A summary for your clinician'));
  dlCard.appendChild(el('p', 'quiz-small', 'Stays on your device. Nothing is sent to a server.'));
  const printBtn = el('button', 'quiz-btn-primary', 'Download / Print this page');
  printBtn.type = 'button';
  printBtn.style.cssText = 'width:100%;margin-top:8px';
  printBtn.onclick = function () {
    renderPrintable();
    window.print();
  };
  dlCard.appendChild(printBtn);
  h.appendChild(dlCard);

  /* ── Email card removed — no email collected, nothing stored ── */

  const prev = el('div', 'quiz-card');
  prev.appendChild(el('h3', 'quiz-card-subheading', 'What it will contain'));
  const items = [
    'What you want to keep doing',
    'Activities you have changed or stopped',
    'The areas you flagged, highest first',
    'The eight measurements, blank or filled',
    'A note for the clinician about what else can cause reduced activity',
  ];
  items.forEach((t) => {
    const row = el('div', 'quiz-result-row');
    const nm = el('div', 'quiz-result-name', t);
    row.appendChild(nm);
    prev.appendChild(row);
  });
  h.appendChild(prev);

  const mv = el('div', 'quiz-card');
  mv.appendChild(el('h3', 'quiz-card-subheading', 'If you want the measurements done properly'));
  mv.appendChild(
    el(
      'p',
      'quiz-small',
      'Athena Clinic in Honolulu runs a free twenty-minute measurement visit: grip strength, walking speed, chair rises, balance and blood pressure. No charge and nothing to sign up for. rebelliousaging.org/measure'
    )
  );
  h.appendChild(mv);

  /* ── Next step band ── */
  const ns = el('div', 'quiz-next-step');

  const nsLeft = el('div', 'quiz-next-step-left');
  nsLeft.appendChild(el('p', 'quiz-next-step-eyebrow', 'Next step'));
  nsLeft.appendChild(el('h2', 'quiz-next-step-heading', 'Want a doctor to check this?'));
  ns.appendChild(nsLeft);

  const nsRight = el('div', 'quiz-next-step-right');
  nsRight.appendChild(el('p', 'quiz-next-step-body', 'Bring your printed results to an Athena evaluation, or to your own doctor.'));

  const nsBtn = document.createElement('a');
  nsBtn.href = '/athena-evaluation';
  nsBtn.className = 'quiz-btn-primary quiz-next-step-btn';
  nsBtn.textContent = 'Book an Athena evaluation';
  nsRight.appendChild(nsBtn);

  const nsLink = document.createElement('a');
  nsLink.href = '/talk-to-your-doctor';
  nsLink.className = 'quiz-next-step-link';
  nsLink.textContent = 'What to ask your own doctor';
  nsRight.appendChild(nsLink);

  ns.appendChild(nsRight);
  h.appendChild(ns);
}
