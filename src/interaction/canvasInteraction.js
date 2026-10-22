/* ============================================================
   CANVAS INTERACTION — select / move / resize / marquee / pan
   ============================================================ */

import { state, getEl, getSelected, currentDevice } from '../core/state.js';
import { bus, EVENTS } from '../core/bus.js';
import { $, isTyping } from '../utils/dom.js';
import { clamp } from '../utils/math.js';
import { GRID_SIZE, MIN_SIZE } from '../config/constants.js';
import { dom } from '../rendering/viewport.js';
import { updateSelectionBox } from '../rendering/selectionOverlay.js';

const snap = (v) => Math.round(v / GRID_SIZE) * GRID_SIZE;

let dragState = null;   // { mode:'move'|'resize'|'marquee'|'pan', ... }
let spaceDown = false;

dom.deviceFrame.addEventListener('pointerdown', (e) => {
  if (e.button === 2) return;

  // --- Pan ---
  if (state.tool === 'hand' || spaceDown || e.button === 1) {
    startPan(e);
    return;
  }

  // --- Resize handle ---
  const handle = e.target.closest ? e.target.closest('.handle') : null;
  if (handle) {
    startResize(e, handle.dataset.dir);
    return;
  }

  // --- Elemen ---
  const node = e.target.closest ? e.target.closest('.wf-el') : null;
  if (node) {
    const id = node.dataset.id;
    const el = getEl(id);
    if (!el) return;

    if (e.shiftKey) {
      if (state.selection.includes(id)) state.selection = state.selection.filter(s => s !== id);
      else state.selection.push(id);
    } else if (!state.selection.includes(id)) {
      state.selection = [id];
    }

    bus.emit('layers:render');
    bus.emit('inspector:update');
    updateSelectionBox();

    if (!el.locked) startMove(e);
    return;
  }

  // --- Klik area kosong: deselect + marquee ---
  if (!e.shiftKey) {
    state.selection = [];
    bus.emit('layers:render');
    bus.emit('inspector:update');
    updateSelectionBox();
  }
  startMarquee(e);
});

/* ---------- MOVE ---------- */
function startMove(e) {
  const sel = getSelected().filter(el => !el.locked);
  if (!sel.length) return;

  dragState = {
    mode: 'move',
    startX: e.clientX,
    startY: e.clientY,
    items: sel.map(el => ({ el, ox: el.style.x, oy: el.style.y }))
  };
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragUp, { once: true });
  e.preventDefault();
}

/* ---------- RESIZE ---------- */
function startResize(e, dir) {
  const sel = getSelected();
  if (sel.length !== 1) return;
  const el = sel[0];
  if (el.locked) return;

  dragState = {
    mode: 'resize',
    dir,
    startX: e.clientX,
    startY: e.clientY,
    el,
    ox: el.style.x, oy: el.style.y,
    ow: el.style.w, oh: el.style.h,
    ratio: el.style.w / Math.max(1, el.style.h)
  };
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragUp, { once: true });
  e.preventDefault();
  e.stopPropagation();
}

/* ---------- MARQUEE ---------- */
function startMarquee(e) {
  const fr = dom.deviceFrame.getBoundingClientRect();
  const z = state.zoom;
  const x0 = (e.clientX - fr.left) / z;
  const y0 = (e.clientY - fr.top) / z;

  const box = document.createElement('div');
  box.className = 'marquee';
  dom.overlay.appendChild(box);

  dragState = { mode:'marquee', x0, y0, box, fr, z, additive: e.shiftKey };
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragUp, { once: true });
}

/* ---------- PAN ---------- */
function startPan(e) {
  dom.canvasScroll.classList.add('panning');
  dragState = {
    mode: 'pan',
    startX: e.clientX, startY: e.clientY,
    sl: dom.canvasScroll.scrollLeft, st: dom.canvasScroll.scrollTop
  };
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragUp, { once: true });
  e.preventDefault();
}

/* ---------- SHARED MOVE HANDLER ---------- */
function onDragMove(e) {
  if (!dragState) return;
  const z = state.zoom || 1;

  switch (dragState.mode) {
    case 'move': {
      let dx = (e.clientX - dragState.startX) / z;
      let dy = (e.clientY - dragState.startY) / z;
      if (e.altKey) { dx = Math.round(dx); dy = Math.round(dy); }
      dragState.items.forEach(it => {
        it.el.style.x = Math.round(it.ox + dx);
        it.el.style.y = Math.round(it.oy + dy);
        bus.emit('element:sync', it.el);
      });
      updateSelectionBox();
      break;
    }

    case 'resize': {
      const d = dragState;
      let dx = (e.clientX - d.startX) / z;
      let dy = (e.clientY - d.startY) / z;
      let x = d.ox, y = d.oy, w = d.ow, h = d.oh;
      const dir = d.dir;

      if (dir.includes('e')) w = d.ow + dx;
      if (dir.includes('s')) h = d.oh + dy;
      if (dir.includes('w')) { w = d.ow - dx; x = d.ox + dx; }
      if (dir.includes('n')) { h = d.oh - dy; y = d.oy + dy; }

      // preserve aspect ratio dengan Shift
      if (e.shiftKey && dir.length === 2) {
        if (Math.abs(w - d.ow) > Math.abs(h - d.oh)) {
          h = w / d.ratio;
          if (dir.includes('n')) y = d.oy + (d.oh - h);
        } else {
          w = h * d.ratio;
          if (dir.includes('w')) x = d.ox + (d.ow - w);
        }
      }

      // snap ke grid
      if (!e.altKey) {
        w = Math.max(MIN_SIZE, snap(w));
        h = Math.max(MIN_SIZE, snap(h));
        x = snap(x); y = snap(y);
      }

      // minimum size
      if (w < MIN_SIZE) { if (dir.includes('w')) x = d.ox + d.ow - MIN_SIZE; w = MIN_SIZE; }
      if (h < MIN_SIZE) { if (dir.includes('n')) y = d.oy + d.oh - MIN_SIZE; h = MIN_SIZE; }

      d.el.style.x = Math.round(x);
      d.el.style.y = Math.round(y);
      d.el.style.w = Math.round(w);
      d.el.style.h = Math.round(h);
      bus.emit('element:sync', d.el);
      updateSelectionBox();
      bus.emit('inspector:update');
      break;
    }

    case 'marquee': {
      const d = dragState;
      const x1 = (e.clientX - d.fr.left) / d.z;
      const y1 = (e.clientY - d.fr.top)  / d.z;
      const left = Math.min(d.x0, x1), top = Math.min(d.y0, y1);
      const w = Math.abs(x1 - d.x0), h = Math.abs(y1 - d.y0);
      d.box.style.left = left + 'px';
      d.box.style.top  = top + 'px';
      d.box.style.width = w + 'px';
      d.box.style.height = h + 'px';
      break;
    }

    case 'pan': {
      dom.canvasScroll.scrollLeft = dragState.sl - (e.clientX - dragState.startX);
      dom.canvasScroll.scrollTop  = dragState.st - (e.clientY - dragState.startY);
      break;
    }
  }
}

/* ---------- SHARED UP HANDLER ---------- */
function onDragUp(e) {
  window.removeEventListener('pointermove', onDragMove);
  if (!dragState) return;
  const d = dragState;
  dragState = null;
  dom.canvasScroll.classList.remove('panning');

  if (d.mode === 'move' || d.mode === 'resize') {
    // clamp ke dalam parent / frame
    const items = d.mode === 'move' ? d.items : [{ el: d.el }];
    items.forEach(it => {
      const el = it.el;
      const bw = el.parentId ? (getEl(el.parentId) || { style: currentDevice() }).style.w : currentDevice().w;
      const bh = el.parentId ? (getEl(el.parentId) || { style: currentDevice() }).style.h : currentDevice().h;
      el.style.x = clamp(el.style.x, 0, Math.max(0, bw - el.style.w));
      el.style.y = clamp(el.style.y, 0, Math.max(0, bh - el.style.h));
      bus.emit('element:sync', el);
    });
    updateSelectionBox();
    bus.emit('inspector:update');
    bus.emit(EVENTS.HISTORY_PUSH);
    bus.emit(EVENTS.SAVE_SOON);

  } else if (d.mode === 'marquee') {
    d.box.remove();
    const x1 = (e.clientX - d.fr.left) / d.z;
    const y1 = (e.clientY - d.fr.top)  / d.z;
    const rLeft = Math.min(d.x0, x1), rTop = Math.min(d.y0, y1);
    const rW = Math.abs(x1 - d.x0), rH = Math.abs(y1 - d.y0);

    if (rW > 3 || rH > 3) {
      const hits = [];
      state.elements.forEach(el => {
        if (el.hidden) return;
        const node = dom.frameContent.querySelector(`.wf-el[data-id="${el.id}"]`);
        if (!node) return;
        const r = node.getBoundingClientRect();
        const l = (r.left - d.fr.left) / d.z;
        const t = (r.top  - d.fr.top ) / d.z;
        const w = r.width / d.z, h = r.height / d.z;
        if (l < rLeft + rW && l + w > rLeft && t < rTop + rH && t + h > rTop) hits.push(el.id);
      });
      state.selection = d.additive
        ? Array.from(new Set(state.selection.concat(hits)))
        : hits;
      bus.emit('layers:render');
      bus.emit('inspector:update');
      updateSelectionBox();
    }
  }
}

/* track posisi mouse untuk status bar */
dom.deviceFrame.addEventListener('pointermove', (e) => {
  const fr = dom.deviceFrame.getBoundingClientRect();
  const x = Math.round((e.clientX - fr.left) / state.zoom);
  const y = Math.round((e.clientY - fr.top)  / state.zoom);
  $('statX').textContent = x;
  $('statY').textContent = y;
});
dom.deviceFrame.addEventListener('pointerleave', () => {
  $('statX').textContent = '—';
  $('statY').textContent = '—';
});

/* Ctrl + scroll = zoom, scroll biasa = scroll normal */
dom.canvasScroll.addEventListener('wheel', (e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    bus.emit('zoom:set', state.zoom + delta);
  }
}, { passive: false });

/* Space = pan sementara */
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isTyping(e.target)) {
    spaceDown = true;
    dom.canvasScroll.classList.add('tool-hand');
  }
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    spaceDown = false;
    dom.canvasScroll.classList.remove('tool-hand');
  }
});

export function initCanvasInteraction() { /* binding dilakukan saat module dimuat */ }
