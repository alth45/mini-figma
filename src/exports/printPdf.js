/* ============================================================
   PRINT / PDF — buka dialog print lewat iframe tersembunyi
   ============================================================ */

import { bus } from '../core/bus.js';
import { buildExportHTML } from './exportHtml.js';

export function exportPrint() {
  const html = buildExportHTML();
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (err) {
      bus.emit('toast', { msg: 'Print gagal: ' + err.message, type: 'err' });
    }
    setTimeout(() => iframe.remove(), 2000);
  }, 400);
  bus.emit('toast', { msg: 'Membuka dialog print…', type: 'info' });
}
