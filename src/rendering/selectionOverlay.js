/* ============================================================
   SELECTION OVERLAY — gambar kotak seleksi + handle resize
   ============================================================ */

import { state, getSelected } from '../core/state.js';
import { bus } from '../core/bus.js';
import { dom } from './viewport.js';

export function updateSelectionBox() {
  dom.overlay.innerHTML = '';
  const sel = getSelected();
  if (!sel.length) return;

  const fr = dom.deviceFrame.getBoundingClientRect();
  const z  = state.zoom || 1;
  dom.overlay.style.setProperty('--hs', (8 / z) + 'px');

  sel.forEach((el, idx) => {
    const node = dom.frameContent.querySelector(`.wf-el[data-id="${el.id}"]`);
    if (!node) return;
    const r = node.getBoundingClientRect();
    const box = document.createElement('div');
    box.className = 'sel-box' + (idx > 0 ? ' secondary' : '');
    box.style.left   = ((r.left - fr.left) / z) + 'px';
    box.style.top    = ((r.top  - fr.top ) / z) + 'px';
    box.style.width  = (r.width  / z) + 'px';
    box.style.height = (r.height / z) + 'px';

    // 8 handle hanya untuk single selection
    if (sel.length === 1) {
      ['nw','n','ne','e','se','s','sw','w'].forEach(dir => {
        const h = document.createElement('div');
        h.className = 'handle ' + dir;
        h.dataset.dir = dir;
        box.appendChild(h);
      });
    }
    dom.overlay.appendChild(box);
  });
}

export function initSelectionOverlay() {
  bus.on('selection:box', updateSelectionBox);
}
