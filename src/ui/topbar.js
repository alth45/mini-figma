/* ============================================================
   TOPBAR — seluruh kontrol pada header (dokumen, zoom, grid,
   device, chrome, undo/redo, menu export, simpan/muat).
   ============================================================ */

import { state } from '../core/state.js';
import { bus, EVENTS } from '../core/bus.js';
import { $ } from '../utils/dom.js';
import { clamp } from '../utils/math.js';
import { ZOOM_MIN, ZOOM_MAX } from '../config/constants.js';
import { applyDevice, setZoom, fitZoom, syncHeaderControls } from '../rendering/viewport.js';
import { duplicateSelected } from '../core/canvasService.js';
import { undo, redo } from '../history/history.js';
import { saveToLocalStorage, loadFromLocalStorage } from '../persistence/storage.js';
import { exportHTML } from '../exports/exportHtml.js';
import { exportPNG } from '../exports/exportPng.js';
import { exportJSON } from '../exports/exportJson.js';
import { importJSON } from '../exports/importJson.js';
import { exportPrint } from '../exports/printPdf.js';

const EXPORT_ACTIONS = {
  html  : exportHTML,
  png   : exportPNG,
  json  : exportJSON,
  import: importJSON,
  print : exportPrint
};

export function initTopbar() {
  /* ---- nama dokumen ---- */
  $('docName').addEventListener('input', (e) => {
    state.docName = e.target.value || 'Untitled Design';
    bus.emit(EVENTS.SAVE_SOON);
    bus.emit(EVENTS.HISTORY_SCHEDULE);
  });

  /* ---- New document ---- */
  $('btnNew').addEventListener('click', () => {
    if (state.elements.length && !confirm('Buat dokumen baru? Perubahan yang belum diekspor akan hilang dari kanvas.')) return;
    assignEmptyDoc();
    bus.emit('device:apply');
    bus.emit(EVENTS.RENDER_ALL);
    bus.emit(EVENTS.HISTORY_PUSH);
    bus.emit(EVENTS.SAVE_SOON);
    bus.emit('toast', { msg: 'New document', type: 'info' });
  });

  /* ---- Duplicate ---- */
  $('btnDup').addEventListener('click', duplicateSelected);

  /* ---- Save / Load ---- */
  $('btnSave').addEventListener('click', () => saveToLocalStorage(false));
  $('btnLoad').addEventListener('click', () => {
    if (!loadFromLocalStorage(false)) {
      bus.emit('toast', { msg: 'Belum ada data tersimpan', type: 'err' });
    } else {
      bus.emit(EVENTS.HISTORY_PUSH);
    }
  });

  /* ---- Undo / Redo (tombol header) ---- */
  $('btnUndo').addEventListener('click', undo);
  $('btnRedo').addEventListener('click', redo);

  /* ---- Grid toggle ---- */
  $('btnGrid').addEventListener('click', () => {
    state.grid = !state.grid;
    $('gridOverlay').style.display = state.grid ? 'block' : 'none';
    $('btnGrid').classList.toggle('active', state.grid);
    bus.emit(EVENTS.SAVE_SOON);
  });

  /* ---- Zoom controls ---- */
  $('btnZoomIn').addEventListener('click',  () => setZoom(state.zoom + 0.1));
  $('btnZoomOut').addEventListener('click', () => setZoom(state.zoom - 0.1));
  $('btnZoomFit').addEventListener('click', () => setZoom(fitZoom()));
  bus.on('zoom:set', (z) => setZoom(clamp(z, ZOOM_MIN, ZOOM_MAX)));
  bus.on('zoom:fit', () => setZoom(fitZoom()));

  /* ---- Device select & custom size ---- */
  $('deviceSelect').addEventListener('change', (e) => {
    state.device = e.target.value;
    $('customSizeWrap').style.display = state.device === 'custom' ? 'flex' : 'none';
    applyDevice();
    bus.emit(EVENTS.SAVE_SOON);
    bus.emit(EVENTS.HISTORY_SCHEDULE);
  });

  const bindCustom = (id, prop) => $(id).addEventListener('input', (e) => {
    const v = parseInt(e.target.value, 10);
    if (!Number.isNaN(v)) {
      state[prop] = v;
      applyDevice();
      bus.emit(EVENTS.SAVE_SOON);
      bus.emit(EVENTS.HISTORY_SCHEDULE);
    }
  });
  bindCustom('customW', 'customW');
  bindCustom('customH', 'customH');

  /* ---- Chrome toggle ---- */
  $('chromeToggle').addEventListener('change', (e) => {
    state.chrome = e.target.checked;
    applyDevice();
    bus.emit(EVENTS.SAVE_SOON);
    bus.emit(EVENTS.HISTORY_SCHEDULE);
  });

  /* ---- Menu Export ---- */
  const btnExport  = $('btnExport');
  const exportMenu = $('exportMenu');
  btnExport.addEventListener('click', (e) => {
    e.stopPropagation();
    exportMenu.classList.toggle('open');
  });
  exportMenu.querySelectorAll('[data-export]').forEach(btn => {
    btn.addEventListener('click', () => {
      exportMenu.classList.remove('open');
      const fn = EXPORT_ACTIONS[btn.dataset.export];
      if (fn) fn();
    });
  });
  document.addEventListener('click', () => exportMenu.classList.remove('open'));

  /* ---- sinkronkan kontrol dengan state saat dokumen berganti ---- */
  bus.on(EVENTS.DOC_CHANGED, syncHeaderControls);
}

/** Kosongkan dokumen (dipakai tombol New) */
function assignEmptyDoc() {
  state.docName = 'Untitled Design';
  state.elements = [];
  state.selection = [];
  syncHeaderControls();
}
