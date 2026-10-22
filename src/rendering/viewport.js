/* ============================================================
   VIEWPORT — pengaturan device frame, zoom, dan status bar.
   Modul ini menjadi pemilik elemen DOM area canvas.
   ============================================================ */

import { state, currentDevice } from '../core/state.js';
import { bus, EVENTS } from '../core/bus.js';
import { clamp } from '../utils/math.js';
import { $ } from '../utils/dom.js';
import { ZOOM_MIN, ZOOM_MAX } from '../config/constants.js';

export const dom = {
  deviceFrame : $('deviceFrame'),
  frameContent: $('frameContent'),
  overlay     : $('overlay'),
  canvasScroll: $('canvasScroll'),
  frameWrapper: $('frameWrapper'),
  frameHolder : $('frameHolder')
};

/** Terapkan ukuran & chrome device frame */
export function applyDevice() {
  const d = currentDevice();
  dom.deviceFrame.style.width  = d.w + 'px';
  dom.deviceFrame.style.height = d.h + 'px';
  dom.frameWrapper.style.width  = d.w + 'px';
  dom.frameWrapper.style.height = d.h + 'px';

  dom.deviceFrame.classList.toggle('chrome', state.chrome);
  const showNotch = state.chrome && d.notch;
  $('notch').style.display = showNotch ? 'block' : 'none';

  $('gridOverlay').style.display = state.grid ? 'block' : 'none';
  $('btnGrid').classList.toggle('active', state.grid);

  updateZoomSize();
  updateStatus();
}

export function updateZoomSize() {
  const d = currentDevice();
  dom.frameHolder.style.width  = (d.w * state.zoom) + 'px';
  dom.frameHolder.style.height = (d.h * state.zoom) + 'px';
  dom.frameWrapper.style.transform = `scale(${state.zoom})`;
  requestAnimationFrame(() => bus.emit('selection:box'));
}

export function setZoom(z) {
  state.zoom = clamp(z, ZOOM_MIN, ZOOM_MAX);
  updateZoomSize();
  updateStatus();
  bus.emit('selection:box');
}

export function fitZoom() {
  const d = currentDevice();
  const r = dom.canvasScroll.getBoundingClientRect();
  const z = Math.min((r.width - 110) / d.w, (r.height - 110) / d.h);
  return clamp(z, ZOOM_MIN, 1.6);
}

/** Perbarui isi status bar */
export function updateStatus() {
  const d = currentDevice();
  $('statDevice').textContent = `${d.name} ${d.w} × ${d.h}`;
  $('statZoom').textContent   = Math.round(state.zoom * 100) + '%';
  $('statCount').textContent  = state.elements.length;
  $('zoomLabel').textContent  = Math.round(state.zoom * 100) + '%';
  $('statHint').textContent   = state.tool === 'hand'
    ? 'Hand tool — drag untuk pan · V untuk select'
    : 'V — select · H — hand · Space+drag — pan';
}

/** Sinkronkan kontrol header dengan state (dipakai undo/load/import) */
export function syncHeaderControls() {
  $('docName').value = state.docName;
  $('deviceSelect').value = state.device;
  $('customW').value = state.customW;
  $('customH').value = state.customH;
  $('customSizeWrap').style.display = state.device === 'custom' ? 'flex' : 'none';
  $('chromeToggle').checked = state.chrome;
}

export function initViewport() {
  bus.on('status:update', updateStatus);
}
