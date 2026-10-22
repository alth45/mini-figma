/* ============================================================
   EVENT BUS — komunikasi antar modul secara longgar (pub/sub)
   Dipakai untuk aksi lintas-modul tanpa circular dependency,
   misalnya: keyboard → "request:delete", inspector → "history:push"
   ============================================================ */

const listeners = new Map();

export const bus = {
  on(event, fn) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(fn);
    return () => bus.off(event, fn);
  },

  off(event, fn) {
    listeners.get(event)?.delete(fn);
  },

  emit(event, payload) {
    listeners.get(event)?.forEach(fn => fn(payload));
  }
};

/** Nama-nama event resmi aplikasi */
export const EVENTS = {
  HISTORY_PUSH    : 'history:push',     // push snapshot baru
  HISTORY_SCHEDULE: 'history:schedule', // debounce push (input kontinu)
  SAVE_SOON       : 'save:soon',        // autosave debounced
  DOC_CHANGED     : 'doc:changed',      // state dokumen diganti (undo/load/import)
  RENDER_ALL      : 'render:all',       // rebuild canvas + layers + inspector
  SELECTION_CHANGED: 'selection:changed'
};
