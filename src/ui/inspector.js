/* ============================================================
   INSPECTOR — panel properti kanan (Design tab)
   ============================================================ */

import { getSelected } from '../core/state.js';
import { bus, EVENTS } from '../core/bus.js';
import { CONTENT_FIELDS } from '../components/registry.js';
import { $, esc, setVal, hexOrNull } from '../utils/dom.js';
import { MIN_SIZE } from '../config/constants.js';
import { applyStyle, applyContent, deleteSelected, moveZ } from '../core/canvasService.js';

/** Field konten contextual per tipe elemen */
function renderContentFields(sel) {
  const wrap = $('contentFields');
  wrap.innerHTML = '';
  const a = sel[0];
  const fields = CONTENT_FIELDS[a.type];

  if (!fields) {
    wrap.innerHTML = '<div style="color:#666;font-size:11.5px">No editable content for this component.</div>';
    return;
  }

  fields.forEach(f => {
    const c = a.content || {};
    if (f.type === 'bool') {
      const lab = document.createElement('label');
      lab.className = 'chk';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!c[f.key];
      cb.addEventListener('change', () => {
        applyContent(f.key, cb.checked);
        bus.emit('element:sync', a);
      });
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(f.label));
      wrap.appendChild(lab);
      return;
    }

    const lbl = document.createElement('div');
    lbl.className = 'inline-label';
    lbl.innerHTML = `<span>${esc(f.label)}</span>`;
    wrap.appendChild(lbl);

    let input;
    if (f.type === 'area') {
      input = document.createElement('textarea');
      input.className = 'ta';
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'fld';
      input.style.cssText = 'width:100%;height:28px;background:#262626;border:1px solid #333;border-radius:5px;padding:0 7px;outline:none;margin-bottom:6px';
    }
    input.value = c[f.key] == null ? '' : c[f.key];
    input.addEventListener('input', () => {
      applyContent(f.key, input.value);
      if (a.type === 'avatar') bus.emit('element:sync', a);
    });
    wrap.appendChild(input);
  });
}

/** Populate inspector dari selection */
export function updateInspector() {
  const sel = getSelected();
  const insp = $('inspector');
  const empty = $('inspectorEmpty');

  if (!sel.length) {
    insp.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  insp.style.display = 'block';
  empty.style.display = 'none';

  const a = sel[0];
  const s = a.style;

  setVal('prop-x', Math.round(s.x));
  setVal('prop-y', Math.round(s.y));
  setVal('prop-w', Math.round(s.w));
  setVal('prop-h', Math.round(s.h));
  setVal('prop-rotate', String(s.rotate || 0));

  const fillHex = hexOrNull(s.fill) || '#ffffff';
  setVal('prop-fill', fillHex);
  setVal('prop-fill-hex', s.fill || 'none');

  setVal('prop-borderColor', hexOrNull(s.borderColor) || '#d1d5db');
  setVal('prop-borderWidth', s.borderWidth || 0);
  setVal('prop-radius', s.radius || 0);
  setVal('prop-shadow', s.shadow || 'none');

  setVal('prop-opacity', Math.round((s.opacity == null ? 1 : s.opacity) * 100));
  $('opacityVal').textContent = Math.round((s.opacity == null ? 1 : s.opacity) * 100) + '%';

  setVal('prop-fontFamily', s.fontFamily);
  setVal('prop-fontSize', s.fontSize);
  setVal('prop-fontWeight', String(s.fontWeight));
  setVal('prop-color', hexOrNull(s.color) || '#111827');
  setVal('prop-color-hex', s.color);
  setVal('prop-lineHeight', s.lineHeight);

  document.querySelectorAll('[data-align]').forEach(b => {
    b.classList.toggle('active', b.dataset.align === s.textAlign);
  });

  setVal('prop-name', sel.length > 1 ? '' : a.name);

  renderContentFields(sel);
}

/* ---------- BINDING ---------- */
function bindNum(id, prop, min) {
  const inp = $(id);
  inp.addEventListener('input', () => {
    const v = parseFloat(inp.value);
    if (isNaN(v)) return;
    applyStyle(prop, min != null ? Math.max(min, v) : v);
  });
}

export function initInspector() {
  bindNum('prop-x', 'x');
  bindNum('prop-y', 'y');
  bindNum('prop-w', 'w', MIN_SIZE);
  bindNum('prop-h', 'h', MIN_SIZE);
  bindNum('prop-borderWidth', 'borderWidth', 0);
  bindNum('prop-radius', 'radius', 0);
  bindNum('prop-fontSize', 'fontSize', 6);
  bindNum('prop-lineHeight', 'lineHeight', 0.8);

  $('prop-rotate').addEventListener('change', (e) => applyStyle('rotate', parseFloat(e.target.value)));

  $('prop-fill').addEventListener('input', (e) => {
    applyStyle('fill', e.target.value);
    setVal('prop-fill-hex', e.target.value);
  });
  $('prop-fill-hex').addEventListener('input', (e) => {
    const v = e.target.value.trim();
    applyStyle('fill', v === '' ? 'none' : v);
    const hx = hexOrNull(v);
    if (hx) setVal('prop-fill', hx);
  });
  $('prop-fill-none').addEventListener('click', () => {
    applyStyle('fill', 'none');
    setVal('prop-fill-hex', 'none');
    bus.emit(EVENTS.HISTORY_PUSH);
  });

  $('prop-borderColor').addEventListener('input', (e) => applyStyle('borderColor', e.target.value));
  $('prop-shadow').addEventListener('change', (e) => applyStyle('shadow', e.target.value));
  $('prop-opacity').addEventListener('input', (e) => {
    const v = parseFloat(e.target.value) / 100;
    $('opacityVal').textContent = e.target.value + '%';
    applyStyle('opacity', v);
  });

  $('prop-fontFamily').addEventListener('change', (e) => applyStyle('fontFamily', e.target.value));
  $('prop-fontWeight').addEventListener('change', (e) => applyStyle('fontWeight', e.target.value));
  $('prop-color').addEventListener('input', (e) => {
    applyStyle('color', e.target.value);
    setVal('prop-color-hex', e.target.value);
  });
  $('prop-color-hex').addEventListener('input', (e) => {
    const v = e.target.value.trim();
    if (!v) return;
    applyStyle('color', v);
    const hx = hexOrNull(v);
    if (hx) setVal('prop-color', hx);
  });

  document.querySelectorAll('[data-align]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyStyle('textAlign', btn.dataset.align);
      document.querySelectorAll('[data-align]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* Layer section */
  $('prop-name').addEventListener('input', (e) => {
    const sel = getSelected();
    if (!sel.length) return;
    sel[0].name = e.target.value || 'Layer';
    bus.emit('layers:render');
    bus.emit(EVENTS.SAVE_SOON);
    bus.emit(EVENTS.HISTORY_SCHEDULE);
  });

  $('btnLayerHide').addEventListener('click', () => {
    const sel = getSelected();
    if (!sel.length) return;
    const hide = !sel.every(e => e.hidden);
    sel.forEach(e => { e.hidden = hide; bus.emit('element:sync', e); });
    bus.emit('layers:render');
    bus.emit('selection:box');
    bus.emit(EVENTS.HISTORY_PUSH);
    bus.emit(EVENTS.SAVE_SOON);
  });

  $('btnLayerLock').addEventListener('click', () => {
    const sel = getSelected();
    if (!sel.length) return;
    const lock = !sel.every(e => e.locked);
    sel.forEach(e => { e.locked = lock; });
    bus.emit('layers:render');
    bus.emit(EVENTS.HISTORY_PUSH);
    bus.emit(EVENTS.SAVE_SOON);
    bus.emit('toast', { msg: lock ? 'Locked' : 'Unlocked', type: 'info' });
  });

  $('btnLayerDelete').addEventListener('click', deleteSelected);
  $('btnLayerUp').addEventListener('click', () => moveZ(1));
  $('btnLayerDown').addEventListener('click', () => moveZ(-1));

  bus.on('inspector:update', updateInspector);
}
