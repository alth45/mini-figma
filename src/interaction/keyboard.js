/* ============================================================
   KEYBOARD — pintasan global (undo/redo, delete, zoom, tool)
   Semua aksi dikirim lewat bus agar tidak ada circular import.
   ============================================================ */

import { state } from '../core/state.js';
import { bus, EVENTS } from '../core/bus.js';
import { $, isTyping } from '../utils/dom.js';
import { deleteSelected, duplicateSelected } from '../core/canvasService.js';
import { undo, redo } from '../history/history.js';
import { saveToLocalStorage, loadFromLocalStorage } from '../persistence/storage.js';
import { exportHTML } from '../exports/exportHtml.js';
import { exportJSON } from '../exports/exportJson.js';
import { importJSON } from '../exports/importJson.js';

/** Ganti tool aktif (select / hand) dan sinkronkan UI */
export function setTool(tool) {
  state.tool = tool;
  document.getElementById('canvasScroll')
          ?.classList.toggle('tool-hand', tool === 'hand');
  bus.emit('status:update');
}

window.addEventListener('keydown', (e) => {
  const mod = e.ctrlKey || e.metaKey;

  /* ---- kombinasi dengan modifier ---- */
  if (mod) {
    const k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); bus.emit(EVENTS.HISTORY_PUSH); undo(); }
    else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
    else if (k === 'd') { e.preventDefault(); duplicateSelected(); }
    else if (k === 's') { e.preventDefault(); saveToLocalStorage(false); }
    else if (k === 'o') { e.preventDefault(); loadFromLocalStorage(false); }
    else if (k === 'e') { e.preventDefault(); exportHTML(); }
    else if (k === 'i') { e.preventDefault(); importJSON(); }
    else if (k === 'a' && !isTyping(e.target)) {
      e.preventDefault();
      state.selection = state.elements.filter(el => !el.hidden).map(el => el.id);
      bus.emit('layers:render');
      bus.emit('inspector:update');
      bus.emit('selection:box');
    }
    return;
  }

  /* ---- tombol tanpa modifier ---- */
  if (isTyping(e.target)) return;

  switch (e.key) {
    case 'Delete':
    case 'Backspace':
      e.preventDefault();
      deleteSelected();
      break;
    case 'Escape':
      bus.emit('escape');
      break;
    case 'v': case 'V':
      setTool('select');
      break;
    case 'h': case 'H':
      setTool('hand');
      break;
    case 'g': case 'G':
      $('#btnGrid')?.click();
      break;
    case '=': case '+':
      bus.emit('zoom:set', state.zoom + 0.1);
      break;
    case '-': case '_':
      bus.emit('zoom:set', state.zoom - 0.1);
      break;
    case '0':
      bus.emit('zoom:set', 1);
      break;
    case '1':
      bus.emit('zoom:fit');
      break;
  }
});

export function initKeyboard() { /* binding dilakukan saat module dimuat */ }
