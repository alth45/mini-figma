/* ============================================================
   EXPORT JSON — unduh dokumen sebagai .json
   ============================================================ */

import { state, serializeState } from '../core/state.js';
import { bus } from '../core/bus.js';
import { safeFileName, download } from '../utils/math.js';

export function exportJSON() {
  download(safeFileName(state.docName) + '.json', serializeState(), 'application/json;charset=utf-8');
  bus.emit('toast', { msg: 'Exported JSON', type: 'ok' });
}
