import { renderPrintable } from './printable';

export const PDF_FILENAME = 'rebellious-aging-check-up.pdf';
export const HTML2PDF_SRC = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';

export function loadHtml2Pdf() {
  if (window.html2pdf) return Promise.resolve(window.html2pdf);
  return new Promise(function (resolve, reject) {
    const existing = document.querySelector('script[data-html2pdf]');
    const done = function () {
      if (window.html2pdf) resolve(window.html2pdf);
      else reject(new Error('html2pdf failed to load'));
    };
    if (existing) {
      if (window.html2pdf) {
        resolve(window.html2pdf);
        return;
      }
      existing.addEventListener('load', done, { once: true });
      existing.addEventListener(
        'error',
        function () {
          reject(new Error('html2pdf failed to load'));
        },
        { once: true }
      );
      return;
    }
    const script = document.createElement('script');
    script.src = HTML2PDF_SRC;
    script.async = true;
    script.dataset.html2pdf = 'true';
    script.addEventListener('load', done, { once: true });
    script.addEventListener(
      'error',
      function () {
        reject(new Error('html2pdf failed to load'));
      },
      { once: true }
    );
    document.head.appendChild(script);
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 3000);
}

export async function makePdfBlob() {
  renderPrintable();
  const node = document.getElementById('printable');
  const html2pdf = await loadHtml2Pdf();
  node.classList.add('pdf-capture');
  try {
    const source = node.querySelector('.rp-wrap') || node;
    return await html2pdf()
      .set({
        margin: 10,
        filename: PDF_FILENAME,
        image: { type: 'jpeg', quality: 0.92 },
        html2canvas: { scale: 1.5, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .from(source)
      .outputPdf('blob');
  } finally {
    node.classList.remove('pdf-capture');
  }
}
