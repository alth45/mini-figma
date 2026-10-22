/* ============================================================
   LIBRARY PANEL — daftar komponen di panel kiri + drag-to-canvas
   ============================================================ */

import { state, currentDevice, getEl } from '../core/state.js';
import { bus } from '../core/bus.js';
import { COMPONENTS } from '../components/registry.js';
import { $, esc } from '../utils/dom.js';
import { addComponent } from '../core/canvasService.js';
import { dom } from '../rendering/viewport.js';

/** Bangun daftar kategori & item komponen */
export function buildLibrary() {
  const lib = $('library');
  lib.innerHTML = '';
  const cats = {};
  Object.keys(COMPONENTS).forEach(k => {
    const c = COMPONENTS[k];
    (cats[c.cat] = cats[c.cat] || []).push({ key:k, def:c });
  });

  Object.keys(cats).forEach(catName => {
    const wrap = document.createElement('div');
    wrap.className = 'cat';
    wrap.dataset.cat = catName;

    const head = document.createElement('div');
    head.className = 'cat-head';
    head.innerHTML = `<span class="chev">▼</span><span>${esc(catName)}</span>`;
    head.addEventListener('click', () => wrap.classList.toggle('closed'));

    const body = document.createElement('div');
    body.className = 'cat-body';

    cats[catName].forEach(({ key, def }) => {
      const item = document.createElement('div');
      item.className = 'comp-item';
      item.dataset.type = key;
      item.dataset.search = (def.label + ' ' + catName + ' ' + key).toLowerCase();
      item.innerHTML = `<span class="ci">${def.icon}</span><span>${esc(def.label)}</span>`;
      item.addEventListener('pointerdown', (e) => startLibraryDrag(e, key));
      body.appendChild(item);
    });

    wrap.appendChild(head);
    wrap.appendChild(body);
    lib.appendChild(wrap);
  });
}

/** Filter pencarian komponen */
function bindSearch() {
  $('compSearch').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.comp-item').forEach(item => {
      const match = !q || item.dataset.search.includes(q);
      item.style.display = match ? '' : 'none';
    });
    document.querySelectorAll('.cat').forEach(cat => {
      const any = [...cat.querySelectorAll('.comp-item')].some(i => i.style.display !== 'none');
      cat.style.display = any ? '' : 'none';
      if (q && any) cat.classList.remove('closed');
    });
  });
}

/* ---------- DRAG DARI LIBRARY (pointer events) ---------- */
let libDrag = null;

function startLibraryDrag(e, type) {
  if (e.button !== 0) return;
  e.preventDefault();

  const def = COMPONENTS[type];
  const ghost = document.createElement('div');
  ghost.className = 'lib-ghost';
  ghost.textContent = def.label;
  ghost.style.left = e.clientX + 'px';
  ghost.style.top  = e.clientY + 'px';
  document.body.appendChild(ghost);

  libDrag = { type, ghost, moved: false };

  window.addEventListener('pointermove', onLibraryDragMove);
  window.addEventListener('pointerup', onLibraryDragUp, { once: true });
}

function onLibraryDragMove(e) {
  if (!libDrag) return;
  libDrag.moved = true;
  libDrag.ghost.style.left = e.clientX + 'px';
  libDrag.ghost.style.top  = e.clientY + 'px';
}

function onLibraryDragUp(e) {
  window.removeEventListener('pointermove', onLibraryDragMove);
  if (!libDrag) return;
  const { type, ghost, moved } = libDrag;
  ghost.remove();
  libDrag = null;

  const fr = dom.deviceFrame.getBoundingClientRect();
  const inside = e.clientX >= fr.left && e.clientX <= fr.right &&
                 e.clientY >= fr.top  && e.clientY <= fr.bottom;

  if (!moved) {
    // klik = auto-place di tengah frame
    const d = currentDevice();
    const def = COMPONENTS[type];
    addComponent(type, (d.w - def.w) / 2, (d.h - def.h) / 2, null);
    bus.emit('toast', { msg: def.label + ' added', type: 'info' });
    return;
  }

  if (!inside) return; // drop di luar frame → diabaikan

  let x = (e.clientX - fr.left) / state.zoom;
  let y = (e.clientY - fr.top)  / state.zoom;

  // cari container di bawah pointer
  let parentId = null;
  const under = document.elementFromPoint(e.clientX, e.clientY);
  const targetNode = under && under.closest ? under.closest('.wf-el') : null;
  if (targetNode) {
    const pel = getEl(targetNode.dataset.id);
    if (pel && COMPONENTS[pel.type] && COMPONENTS[pel.type].acceptsChildren) {
      parentId = pel.id;
      const pr = targetNode.getBoundingClientRect();
      x = (e.clientX - pr.left) / state.zoom;
      y = (e.clientY - pr.top)  / state.zoom;
    }
  }

  const def = COMPONENTS[type];
  const el = addComponent(type, x - def.w / 2, y - def.h / 2, parentId);
  if (el) bus.emit('toast', { msg: def.label + ' added', type: 'ok' });
}

export function initLibraryPanel() {
  buildLibrary();
  bindSearch();
}
