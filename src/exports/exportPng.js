/* ============================================================
   EXPORT PNG — render canvas via SVG foreignObject
   ============================================================ */

import { state, currentDevice } from '../core/state.js';
import { bus } from '../core/bus.js';
import { safeFileName } from '../utils/math.js';
import { dom } from '../rendering/viewport.js';

export function exportPNG() {
  const dev = currentDevice();
  const d = Math.min(2, window.devicePixelRatio || 1);
  const scale = Math.max(1, Math.min(2, d));

  // clone konten + inline style dasar
  const cloned = dom.frameContent.cloneNode(true);
  cloned.querySelectorAll('.wf-el').forEach(n => {
    n.removeAttribute('data-id');
    if (n.style.display === 'none') n.remove();
  });

  const inner = cloned.innerHTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${dev.w}" height="${dev.h}" viewBox="0 0 ${dev.w} ${dev.h}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml"
         style="width:${dev.w}px;height:${dev.h}px;background:#ffffff;position:relative;overflow:hidden;
                font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;">
      ${inner}
    </div>
  </foreignObject>
</svg>`;

  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(dev.w * scale);
      canvas.height = Math.round(dev.h * scale);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, dev.w, dev.h);

      canvas.toBlob((blob) => {
        if (!blob) { bus.emit('toast', { msg: 'PNG export failed', type: 'err' }); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = safeFileName(state.docName) + '.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        bus.emit('toast', { msg: 'Exported PNG', type: 'ok' });
      }, 'image/png');
    } catch (err) {
      bus.emit('toast', { msg: 'PNG export failed: ' + err.message, type: 'err' });
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
    bus.emit('toast', { msg: 'PNG export tidak didukung browser ini — gunakan Export HTML.', type: 'err' });
  };

  img.src = url;
}
