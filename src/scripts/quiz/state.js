import { DATA, KEY } from './data';

/* ═════════════════════════════ STATE ═════════════════════════════ */
export let S = { answers: {}, radius: {}, priority: [], measured: {}, started: null, finished: null, ack: false };

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const o = JSON.parse(raw);
      ['answers', 'radius', 'measured'].forEach((k) => {
        if (o[k]) S[k] = o[k];
      });
      if (o.priority) S.priority = o.priority;
      S.started = o.started || null;
      S.finished = o.finished || null;
      S.previous = o.previous || null;
      S.ack = !!o.ack;
    }
  } catch (e) {}
}
export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
}
load();

/* ═════════════════════════════ SCORING ═════════════════════════════ */
export function sysScore(sid) {
  let s = 0,
    n = 0;
  for (let i = 0; i < 3; i++) {
    const v = S.answers[sid + '_' + i];
    if (typeof v === 'number') {
      s += v;
      n++;
    }
  }
  /* Score any system with at least one answer. Unanswered items count as 0
   so the 0–9 total stays comparable. "Not answered" is only for n === 0. */
  return n === 0 ? null : s;
}
export function band(sc) {
  return sc === null ? -1 : sc <= 2 ? 0 : sc <= 5 ? 1 : 2;
}
export function sysById(id) {
  return DATA.systems.find((s) => s.id === id) || null;
}
export function answeredCount() {
  return Object.values(S.answers).filter((v) => typeof v === 'number').length;
}
export function radiusFlagged() {
  return DATA.radius.filter((r) => S.radius[r.id] === 1 || S.radius[r.id] === 2);
}
export function radiusAnswered() {
  return DATA.radius.filter((r) => S.radius[r.id] !== undefined).length;
}

/* ═════════════════════════════ DOM HELPERS ═════════════════════════════ */
export function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
