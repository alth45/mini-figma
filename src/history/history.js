/* ============================================================
   HISTORY — undo / redo berbasis snapshot JSON state
   ============================================================ */

import { assignDoc, serializeState } from '../core/state.js';
import { bus, EVENTS } from '../core/bus.js';
import { $ } from '../utils/dom.js';
import { HISTORY_LIMIT } from '../config/constants.js';
import { syncHeaderControls } from '../rendering/viewport.js';

let history = [];
let hIndex = -1;
let histTimer = null;

/** Simpan snapshot state saat ini ke history */
export function pushHistory() {
  clearTimeout(histTimer);
  const snap = serializeState();
  if (hIndex >= 0 && history[hIndex] === snap) return;
  history = history.slice(0, hIndex + 1);
  history.push(snap);
  if (history.length > HISTORY_LIMIT + 1) history.shift();
  hIndex = history.length - 1;
  updateHistoryButtons();
}

/** Versi debounce untuk input kontinu */
export function scheduleHistory() {
  clearTimeout(histTimer);
  histTimer = setTimeout(() => { pushHistory(); }, 450);
}

function updateHistoryButtons() {
  $('btnUndo').disabled = hIndex <= 0;
  $('btnRedo').disabled = hIndex >= history.length - 1;
}

function applySnapshot(snap) {
  assignDoc(JSON.parse(snap));
  syncHeaderControls();
  bus.emit('device:apply');
  bus.emit(EVENTS.RENDER_ALL);
  updateHistoryButtons();
}

export function undo() {
  if (hIndex <= 0) return;
  hIndex--;
  applySnapshot(history[hIndex]);
  bus.emit('toast', { msg: 'Undo', type: 'info' });
}

export function redo() {
  if (hIndex >= history.length - 1) return;
  hIndex++;
  applySnapshot(history[hIndex]);
  bus.emit('toast', { msg: 'Redo', type: 'info' });
}

export function initHistory() {
  bus.on(EVENTS.HISTORY_PUSH, pushHistory);
  bus.on(EVENTS.HISTORY_SCHEDULE, scheduleHistory);
  $('btnUndo').addEventListener('click', undo);
  $('btnRedo').addEventListener('click', redo);
}
