/* ============================================================
   CANVAS SERVICE — CRUD elemen pada state (layer bisnis logika)
   Mengirim event via bus agar modul lain (history, autosave,
   rendering) merespons tanpa circular import.
   ============================================================ */

import { state, getEl, getSelected, currentDevice } from '../core/state.js';
import { COMPONENTS } from '../components/registry.js';
import { bus, EVENTS } from '../core/bus.js';
import { clamp, uid, clone } from '../utils/math.js';

export function defaultStyle() {
  return {
    x:0, y:0, w:100, h:40, rotate:0,
    fill:'#ffffff', borderColor:'#d1d5db', borderWidth:0, radius:6,
    shadow:'none', opacity:1,
    fontFamily:'Inter, system-ui, sans-serif', fontSize:14, fontWeight:'400',
    color:'#111827', textAlign:'left', lineHeight:1.4
  };
}

/**
 * Tambah komponen baru ke canvas.
 * @param {string} type
 * @param {number} x  koordinat relatif terhadap parent (frame bila parentId null)
 * @param {number} y
 * @param {string|null} parentId
 */
export function addComponent(type, x, y, parentId) {
  const def = COMPONENTS[type];
  if (!def) return null;

  parentId = parentId || null;
  const id = uid();
  const st = Object.assign(defaultStyle(), clone(def.style || {}), {
    x: 0, y: 0, w: def.w, h: def.h
  });

  const el = {
    id, type,
    name: def.label,
    parentId,
    hidden: false,
    locked: false,
    content: clone(def.content || {}),
    style: st
  };

  // hitung batas parent
  const bounds = parentId ? (() => {
    const p = getEl(parentId);
    return p ? { w: p.style.w, h: p.style.h } : { w: currentDevice().w, h: currentDevice().h };
  })() : { w: currentDevice().w, h: currentDevice().h };

  el.style.x = clamp(Math.round(x), 0, Math.max(0, bounds.w - st.w));
  el.style.y = clamp(Math.round(y), 0, Math.max(0, bounds.h - st.h));

  state.elements.push(el);
  state.selection = [id];

  bus.emit(EVENTS.RENDER_ALL);
  bus.emit(EVENTS.HISTORY_PUSH);
  bus.emit(EVENTS.SAVE_SOON);
  return el;
}

/** Update properti style elemen terpilih (live) */
export function applyStyle(prop, value) {
  const sel = getSelected();
  if (!sel.length) return;
  sel.forEach(el => {
    if (el.locked) return;
    el.style[prop] = value;
    bus.emit('element:sync', el);
  });
  bus.emit('selection:box');
  bus.emit('status:update');
  bus.emit(EVENTS.SAVE_SOON);
  bus.emit(EVENTS.HISTORY_SCHEDULE);
}

/** Update field konten elemen terpilih */
export function applyContent(key, value) {
  const sel = getSelected();
  if (!sel.length) return;
  sel.forEach(el => {
    if (!el.content) el.content = {};
    el.content[key] = value;
    bus.emit('element:sync', el);
  });
  bus.emit(EVENTS.SAVE_SOON);
  bus.emit(EVENTS.HISTORY_SCHEDULE);
}

/** Hapus elemen terpilih (rekursif ke anak) */
export function deleteSelected() {
  if (!state.selection.length) return;
  const toDelete = new Set();
  const collect = (id) => {
    toDelete.add(id);
    state.elements.filter(e => e.parentId === id).forEach(ch => collect(ch.id));
  };
  state.selection.forEach(collect);
  state.elements = state.elements.filter(e => !toDelete.has(e.id));
  state.selection = [];
  bus.emit(EVENTS.RENDER_ALL);
  bus.emit(EVENTS.HISTORY_PUSH);
  bus.emit(EVENTS.SAVE_SOON);
  bus.emit('toast', { msg: 'Deleted ' + toDelete.size + ' element(s)', type: 'info' });
}

/** Duplikasi elemen terpilih */
export function duplicateSelected() {
  if (!state.selection.length) return;
  const newIds = [];
  state.selection.slice().forEach(id => {
    const src = getEl(id);
    if (!src) return;
    const copy = clone(src);
    copy.id = uid();
    copy.name = src.name + ' copy';
    copy.style.x = Math.max(0, src.style.x + 16);
    copy.style.y = Math.max(0, src.style.y + 16);
    state.elements.push(copy);
    newIds.push(copy.id);
  });
  state.selection = newIds;
  bus.emit(EVENTS.RENDER_ALL);
  bus.emit(EVENTS.HISTORY_PUSH);
  bus.emit(EVENTS.SAVE_SOON);
  bus.emit('toast', { msg: 'Duplicated', type: 'info' });
}

/** Ubah z-order elemen terpilih dalam array (dir: +1 maju / -1 mundur) */
export function moveZ(dir) {
  const sel = getSelected();
  if (!sel.length) return;
  if (dir > 0) {
    for (let i = state.elements.length - 2; i >= 0; i--) {
      const a = state.elements[i], b = state.elements[i + 1];
      if (state.selection.includes(a.id) && !state.selection.includes(b.id)) {
        state.elements[i] = b; state.elements[i + 1] = a;
      }
    }
  } else {
    for (let i = 1; i < state.elements.length; i++) {
      const a = state.elements[i], b = state.elements[i - 1];
      if (state.selection.includes(a.id) && !state.selection.includes(b.id)) {
        state.elements[i] = b; state.elements[i - 1] = a;
      }
    }
  }
  bus.emit(EVENTS.RENDER_ALL);
  bus.emit(EVENTS.HISTORY_PUSH);
  bus.emit(EVENTS.SAVE_SOON);
}
