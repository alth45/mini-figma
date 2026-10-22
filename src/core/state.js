/* ============================================================
   STATE PUSAT APLIKASI (single source of truth)
   ============================================================ */

import { DEVICES } from '../config/constants.js';

export const state = {
  docName  : 'Untitled Design',
  device   : 'iphone',
  customW  : 1000,
  customH  : 700,
  chrome   : true,
  grid     : true,
  zoom     : 1,
  tool     : 'select',
  elements : [],   // array flat, urutan = z-order (index 0 = paling bawah)
  selection: []
};

/** Cari elemen berdasarkan id */
export function getEl(id) {
  return state.elements.find(e => e.id === id) || null;
}

/** Daftar objek elemen yang sedang terpilih */
export function getSelected() {
  return state.selection.map(getEl).filter(Boolean);
}

/** Dimensi device aktif (termasuk custom) */
export function currentDevice() {
  if (state.device === 'custom') {
    return {
      name: 'Custom',
      w: Math.max(80, state.customW),
      h: Math.max(80, state.customH),
      notch: false
    };
  }
  return DEVICES[state.device];
}

/** Terapkan data dokumen ke state (dipakai load / import / undo-redo) */
export function assignDoc(data) {
  state.docName   = data.docName ?? 'Untitled Design';
  state.device    = data.device ?? 'iphone';
  state.customW   = data.customW ?? 1000;
  state.customH   = data.customH ?? 700;
  state.chrome    = data.chrome !== false;
  state.grid      = data.grid !== false;
  state.zoom      = data.zoom || 1;
  state.tool      = 'select';
  state.elements  = data.elements || [];
  state.selection = data.selection || [];
}

/** Serialisasi dokumen menjadi string JSON (untuk history / save / export) */
export function serializeState() {
  return JSON.stringify({
    docName  : state.docName,
    device   : state.device,
    customW  : state.customW,
    customH  : state.customH,
    chrome   : state.chrome,
    grid     : state.grid,
    zoom     : state.zoom,
    tool     : state.tool,
    elements : state.elements,
    selection: state.selection
  });
}
