/* ============================================================
   EXPORT HTML — bangun dokumen statis siap pakai dari state
   ============================================================ */

import { state, currentDevice } from '../core/state.js';
import { bus } from '../core/bus.js';
import { $, esc } from '../utils/dom.js';
import { safeFileName, download } from '../utils/math.js';
import { dom } from '../rendering/viewport.js';
import { openModal } from '../ui/modal.js';

/** Bangun HTML statis siap pakai dari state */
export function buildExportHTML() {
  const dev = currentDevice();

  const cloned = dom.frameContent.cloneNode(true);
  // bersihkan class & atribut editor
  cloned.querySelectorAll('.wf-el').forEach(n => {
    n.className = '';
    n.removeAttribute('data-id');
    if (n.style.display === 'none') n.remove(); // elemen tersembunyi tidak diexport
  });
  cloned.querySelectorAll('[data-id]').forEach(n => n.removeAttribute('data-id'));

  const radius = state.chrome ? 26 : 0;
  const screenStyle = state.chrome
    ? `border-radius:${radius}px;box-shadow:0 24px 70px rgba(15,23,42,.28);`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(state.docName)}</title>
<style>
  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0;background:#eef2f7;display:flex;align-items:center;justify-content:center;
    min-height:100vh;padding:32px;
    font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    color:#111827;
  }
  .screen{
    position:relative;width:${dev.w}px;height:${dev.h}px;background:#ffffff;
    overflow:hidden;flex:0 0 auto;${screenStyle}
  }
</style>
</head>
<body>
<div class="screen">
${cloned.innerHTML}
</div>
</body>
</html>`;
}

export function exportHTML() {
  const html = buildExportHTML();
  openModal(
    'Export — HTML + CSS',
    `<p class="modal-note">Salin kode di bawah atau unduh sebagai file <code>.html</code>.
     Semua styling sudah inline &amp; class editor sudah dibersihkan.</p>
     <textarea id="exportText" spellcheck="false" readonly></textarea>`,
    `<button class="btn" id="mCopy">Copy</button>
     <button class="btn primary" id="mDownload">Download .html</button>`
  );
  $('exportText').value = html;
  $('mCopy').addEventListener('click', () => {
    const ta = $('exportText');
    ta.select();
    navigator.clipboard.writeText(html).then(
      () => bus.emit('toast', { msg: 'Copied!', type: 'ok' }),
      () => { document.execCommand('copy'); bus.emit('toast', { msg: 'Copied!', type: 'ok' }); }
    );
  });
  $('mDownload').addEventListener('click', () => {
    download(safeFileName(state.docName) + '.html', html, 'text/html;charset=utf-8');
    bus.emit('toast', { msg: 'Exported HTML', type: 'ok' });
  });
}
