/* ============================================================
   PERSISTENCE — simpan/muat dokumen dari LocalStorage
   ============================================================ */

import { assignDoc, serializeState } from '../core/state.js';
import { bus, EVENTS } from '../core/bus.js';
import { $ } from '../utils/dom.js';
import { STORAGE_KEY, SAVE_DEBOUNCE } from '../config/constants.js';
import { syncHeaderControls } from '../rendering/viewport.js';
import { toast } from '../ui/toast.js';

let saveTimer = null;

export function saveSoon() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveToLocalStorage(true), SAVE_DEBOUNCE);
}

export function saveToLocalStorage(silent) {
  try {
    localStorage.setItem(STORAGE_KEY, serializeState());
    if (!silent) toast('Saved to LocalStorage', 'ok');
    return true;
  } catch (err) {
    if (!silent) toast('Save failed: ' + err.message, 'err');
    return false;
  }
}

export function loadFromLocalStorage(silent) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.elements)) return false;

    assignDoc(data);
    syncHeaderControls();
    bus.emit('device:apply');
    bus.emit(EVENTS.RENDER_ALL);
    if (!silent) toast('Loaded from LocalStorage', 'ok');
    return true;
  } catch (err) {
    if (!silent) toast('Load failed: ' + err.message, 'err');
    return false;
  }
}

export function initPersistence() {
  bus.on(EVENTS.SAVE_SOON, saveSoon);
}
