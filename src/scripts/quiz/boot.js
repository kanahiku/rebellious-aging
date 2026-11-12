import { S, answeredCount, save } from './state';
import { buildDomain } from './build-domains';
import { ORDER, SECTION_TABS, at, curTab, show, switchTab, syncMainPadding } from './nav';

/* ═════════════════════════════ BOOT ═════════════════════════════ */
/* Fire on both hard load and Astro view-transition navigation */
export function boot() {
  for (let i = 0; i < 6; i++) buildDomain(i);

  /* Keep padding-top in sync whenever the header height might change */
  window.addEventListener('resize', () => {
    const isHome = ORDER[at] === 'home';
    syncMainPadding(isHome);
  });

  /* Smart context-aware nav — one handler for the whole quiz lifetime */
  document.getElementById('btn-next').onclick = function () {
    if (ORDER[at] === 'results') {
      const i = curTab();
      if (i < SECTION_TABS.length - 1) switchTab(SECTION_TABS[i + 1], true);
    } else {
      show(at + 1);
    }
  };
  document.getElementById('btn-back').onclick = function () {
    if (ORDER[at] === 'results') {
      const i = curTab();
      if (i > 0) switchTab(SECTION_TABS[i - 1], true);
      else show(ORDER.indexOf('priority')); /* back to priority from step 1 */
    } else {
      show(at - 1);
    }
  };

  /* Ack checkbox */
  const ackBox = document.getElementById('ack');
  function syncAck() {
    const ok = ackBox.checked;
    document.getElementById('btn-start').disabled = !ok;
    const resumeBtn = document.getElementById('btn-resume');
    if (resumeBtn) resumeBtn.disabled = !ok;
  }
  if (S.ack) ackBox.checked = true;
  ackBox.onchange = function () {
    S.ack = ackBox.checked;
    save();
    syncAck();
  };
  syncAck();

  document.getElementById('btn-start').onclick = function () {
    if (!ackBox.checked) return;
    if (!S.started) {
      S.started = Date.now();
      save();
    }
    show(1);
  };
  document.getElementById('btn-resume').onclick = function () {
    if (!ackBox.checked) return;
    show(1);
  };

  if (answeredCount() > 0) {
    document.getElementById('btn-resume').classList.remove('hidden');
  }

  /* Step indicator dots are non-clickable — navigation is via main Back / Next buttons */

  /* Page prev/next */
  /* btn-pageprev / btn-pagenext no longer exist — results use main nav via switchTab() */

  /* Share/save card removed — handlers no longer needed */


  show(0);
}

/* Hard load */
document.addEventListener('DOMContentLoaded', boot);
/* Astro view-transition navigation (soft load) */
document.addEventListener('astro:page-load', boot);
