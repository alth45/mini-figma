/* ============================================================
   IMPORT JSON — muat dokumen dari file .json
   ============================================================ */

import { state, assignDoc } from '../core/state.js';
import { bus, EVENTS } from '../core/bus.js';
import { $ } from '../utils/dom.js';
import { syncHeaderControls } from '../rendering/viewport.js';

export function importJSON() {
  $('fileInput').value = '';
  $('fileInput').click();
}

$('fileInput').addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || !Array.isArray(data.elements)) throw new Error('Format JSON tidak valid');

      if (state.elements.length && !confirm('Import akan mengganti dokumen saat ini. Lanjutkan?')) return;

      assignDoc(data);
      state.selection = [];
      syncHeaderControls();
      bus.emit('device:apply');
      bus.emit(EVENTS.RENDER_ALL);
      bus.emit(EVENTS.HISTORY_PUSH);
      bus.emit(EVENTS.SAVE_SOON);
      bus.emit('toast', { msg: 'JSON imported', type: 'ok' });
    } catch (err) {
      bus.emit('toast', { msg: 'Import gagal: ' + err.message, type: 'err' });
    }
  };
  reader.readAsText(file);
});
