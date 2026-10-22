/* ============================================================
   CANVAS RENDERER — rebuild DOM canvas dari state
   ============================================================ */

import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { renderInner } from '../components/templates.js';
import { applyNodeStyle } from './nodeStyle.js';
import { dom } from './viewport.js';
import { updateSelectionBox } from './selectionOverlay.js';

/** Render ulang seluruh canvas dari state */
export function renderCanvas() {
  dom.frameContent.innerHTML = '';
  const nodes = new Map();

  // 1) buat semua node
  state.elements.forEach(el => {
    const n = document.createElement('div');
    n.className = 'wf-el';
    n.dataset.id = el.id;
    applyNodeStyle(n, el);
    if (el.hidden) n.style.display = 'none';

    const content = document.createElement('div');
    content.className = 'wf-content';
    content.style.cssText = 'position:absolute;inset:0;';
    content.innerHTML = renderInner(el);
    n.appendChild(content);

    nodes.set(el.id, n);
  });

  // 2) susun hirarki (urutan array = z-order)
  state.elements.forEach(el => {
    const parentNode = (el.parentId && nodes.get(el.parentId)) ? nodes.get(el.parentId) : dom.frameContent;
    parentNode.appendChild(nodes.get(el.id));
  });

  updateSelectionBox();
}

/** Sinkronkan SATU elemen ke DOM (tanpa rebuild penuh) */
export function syncElement(el) {
  const n = dom.frameContent.querySelector(`.wf-el[data-id="${el.id}"]`);
  if (!n) return;
  applyNodeStyle(n, el);
  n.style.display = el.hidden ? 'none' : '';
  const content = n.querySelector(':scope > .wf-content');
  if (content) content.innerHTML = renderInner(el);
}

export function initCanvasRenderer() {
  bus.on('element:sync', syncElement);
}
