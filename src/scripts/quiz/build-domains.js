import { S, el, radiusFlagged, save } from './state';
import { updateProgress } from './nav';
import { DATA, RLAB } from './data';

/* ═════════════════════════════ BUILD DOMAINS ═════════════════════════════ */
export function buildDomain(di) {
  const host = document.getElementById('dom' + di);
  host.innerHTML = '';
  DATA.systems.forEach((sy) => {
    if (sy.domain !== di) return;
    const card = el('div', 'quiz-system-card');

    /* System name header row */
    card.appendChild(el('div', 'quiz-system-name', sy.label));

    sy.q.forEach((stem, qi) => {
      const q = el('div', 'quiz-question');
      q.appendChild(el('div', 'quiz-q-stem', stem));

      /* Horizontal answer buttons */
      const opts = el('div', 'quiz-opts');
      const labs = DATA.scales[(sy.scale && sy.scale[qi]) || 'freq'] || [];
      labs.forEach((lab, vi) => {
        const b = el('button', 'quiz-opts-btn', lab);
        b.type = 'button';
        b.setAttribute('aria-pressed', S.answers[sy.id + '_' + qi] === vi ? 'true' : 'false');
        if (S.answers[sy.id + '_' + qi] === vi) b.classList.add('selected');
        b.onclick = function () {
          S.answers[sy.id + '_' + qi] = vi;
          save();
          opts.querySelectorAll('.quiz-opts-btn').forEach((o, oi) => {
            o.setAttribute('aria-pressed', oi === vi ? 'true' : 'false');
            o.classList.toggle('selected', oi === vi);
          });
          updateProgress();
        };
        opts.appendChild(b);
      });
      q.appendChild(opts);
      card.appendChild(q);
    });
    host.appendChild(card);
  });
}

/* ═════════════════════════════ BUILD RADIUS ═════════════════════════════ */
export function buildRadius() {
  const host = document.getElementById('radlist');
  host.innerHTML = '';
  DATA.radius.forEach((r) => {
    const card = el('div', 'quiz-system-card');
    card.appendChild(el('div', 'quiz-q-stem', r.label));
    if (r.note) {
      const note = el('div', 'quiz-small', r.note);
      note.style.marginBottom = '8px';
      note.style.opacity = '0.6';
      card.appendChild(note);
    }
    const opts = el('div', 'quiz-opts quiz-opts-three');
    RLAB.forEach((lab, vi) => {
      const b = el('button', 'quiz-opts-btn', lab);
      b.type = 'button';
      b.setAttribute('aria-pressed', S.radius[r.id] === vi ? 'true' : 'false');
      if (S.radius[r.id] === vi) b.classList.add('selected');
      b.onclick = function () {
        S.radius[r.id] = vi;
        save();
        opts.querySelectorAll('.quiz-opts-btn').forEach((o, oi) => {
          o.setAttribute('aria-pressed', oi === vi ? 'true' : 'false');
          o.classList.toggle('selected', oi === vi);
        });
        naBtn.setAttribute('aria-pressed', 'false');
        naBtn.classList.remove('selected');
        updateProgress();
      };
      opts.appendChild(b);
    });
    card.appendChild(opts);

    const naWrap = el('div', 'quiz-opts quiz-opts-na');
    const naBtn = el('button', 'quiz-opts-btn', "Doesn't apply to me");
    naBtn.type = 'button';
    naBtn.setAttribute('aria-pressed', S.radius[r.id] === 'n' ? 'true' : 'false');
    if (S.radius[r.id] === 'n') naBtn.classList.add('selected');
    naBtn.onclick = function () {
      S.radius[r.id] = 'n';
      save();
      opts.querySelectorAll('.quiz-opts-btn').forEach((o) => {
        o.setAttribute('aria-pressed', 'false');
        o.classList.remove('selected');
      });
      naBtn.setAttribute('aria-pressed', 'true');
      naBtn.classList.add('selected');
      updateProgress();
    };
    naWrap.appendChild(naBtn);
    card.appendChild(naWrap);
    host.appendChild(card);
  });
}

/* ═════════════════════════════ BUILD PRIORITY ═════════════════════════════ */
export function buildPriority() {
  const flagged = radiusFlagged();
  const host = document.getElementById('prilist');
  host.innerHTML = '';
  S.priority = S.priority.filter((id) => flagged.some((f) => f.id === id));
  const intro = document.getElementById('pri-intro');
  const cnt = document.getElementById('pri-count');
  if (!flagged.length) {
    intro.textContent = 'You did not flag anything on the last page. That is a good result.';
    cnt.textContent = '';
    return;
  }
  intro.textContent = 'Pick up to three you would most want to be doing easily five years from now.';
  const card = el('div', 'quiz-system-card');
  flagged.forEach((r) => {
    const b = el('button', 'quiz-opts-btn', r.label);
    b.type = 'button';
    b.style.cssText =
      'width:100%;margin-bottom:8px;min-height:52px;font-size:13px;text-transform:none;letter-spacing:0;text-align:left;padding:14px 16px;';
    const isOn = () => S.priority.indexOf(r.id) >= 0;
    const paint = () => {
      b.setAttribute('aria-pressed', isOn() ? 'true' : 'false');
      b.classList.toggle('selected', isOn());
    };
    b.onclick = function () {
      const i = S.priority.indexOf(r.id);
      if (i >= 0) S.priority.splice(i, 1);
      else if (S.priority.length < 3) S.priority.push(r.id);
      save();
      buildPriority();
    };
    paint();
    card.appendChild(b);
  });
  host.appendChild(card);
  cnt.textContent = S.priority.length + ' of 3 chosen';
}
