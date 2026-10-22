/* ============================================================
   MAIN ENTRY POINT — Wireframe Studio (modular Vite project)
   Mengimpor seluruh modul, menjalankan init(), lalu bootstrap
   dokumen (LocalStorage bila ada, snapshot awal bila kosong).
   ============================================================ */

import './styles/base.css';

/* ---- core ---- */
import { state } from './core/state.js';
import { bus, EVENTS } from './core/bus.js';

/* ---- rendering ---- */
import {
  initViewport, applyDevice, updateStatus, syncHeaderControls,
  setZoom, fitZoom
} from './rendering/viewport.js';
import { renderCanvas, initCanvasRenderer } from './rendering/canvasRenderer.js';
import { renderLayers, initLayersPanel } from './rendering/layersPanel.js';
import { updateSelectionBox, initSelectionOverlay } from './rendering/selectionOverlay.js';

/* ---- ui ---- */
import { initTopbar } from './ui/topbar.js';
import { initInspector, updateInspector } from './ui/inspector.js';
import { initLibraryPanel } from './ui/libraryPanel.js';
import { initModal } from './ui/modal.js';
import { initToast } from './ui/toast.js';

/* ---- interaction ---- */
import { initCanvasInteraction } from './interaction/canvasInteraction.js';
import { initKeyboard } from './interaction/keyboard.js';

/* ---- history & persistence ---- */
import { initHistory } from './history/history.js';
import { loadFromLocalStorage, initPersistence } from './persistence/storage.js';

/* ============================================================
   DOKUMEN AWAL (starter design) — dipakai bila LocalStorage kosong
   ============================================================ */
const STARTER_DOC = {
  docName: 'Wireframe Starter',
  device : 'iphone',
  chrome : true,
  grid   : true,
  zoom   : 1,
  elements: [
    { id: 's-nav', type: 'navbar', name: 'Navbar', parentId: null, hidden: false, locked: false,
      content: { text: 'Brand' }, style: { x: 0, y: 0, w: 390, h: 56 } },
    { id: 's-hero', type: 'image', name: 'Hero Image', parentId: null, hidden: false, locked: false,
      content: {}, style: { x: 16, y: 72, w: 358, h: 180 } },
    { id: 's-h2', type: 'h2', name: 'Heading H2', parentId: null, hidden: false, locked: false,
      content: { text: 'Design something great' }, style: { x: 16, y: 268, w: 358, h: 38 } },
    { id: 's-para', type: 'paragraph', name: 'Paragraph', parentId: null, hidden: false, locked: false,
      content: { text: 'Drag components from the library, tweak them in the inspector, then export to HTML, PNG, or JSON.' },
      style: { x: 16, y: 312, w: 358, h: 64 } },
    { id: 's-btn', type: 'button', name: 'Button', parentId: null, hidden: false, locked: false,
      content: { text: 'Get Started' }, style: { x: 16, y: 392, w: 160, h: 44 } },
    { id: 's-card', type: 'card', name: 'Card', parentId: null, hidden: false, locked: false,
      content: { title: 'Card title', desc: 'Short supporting description.' }, style: { x: 16, y: 456, w: 358, h: 140 } },
    { id: 's-alert', type: 'alert', name: 'Alert', parentId: null, hidden: false, locked: false,
      content: { title: 'Heads up', text: 'This is an informational alert message.' }, style: { x: 16, y: 616, w: 358, h: 74 } }
  ]
};

/* ============================================================
   WIRING EVENT BUS PUSAT
   ============================================================ */
function wireBus() {
  // rebuild penuh canvas + layers + inspector + selection
  bus.on(EVENTS.RENDER_ALL, () => {
    renderCanvas();
    renderLayers();
    updateInspector();
    updateStatus();
  });

  // pergantian dokumen (undo / redo / load / import) → sinkronkan header
  bus.on(EVENTS.DOC_CHANGED, syncHeaderControls);

  // terapkan ulang device frame
  bus.on('device:apply', applyDevice);

  // Escape → bersihkan seleksi
  bus.on('escape', () => {
    if (!state.selection.length) return;
    state.selection = [];
    bus.emit('layers:render');
    bus.emit('inspector:update');
    updateSelectionBox();
  });
}

/* ============================================================
   BOOTSTRAP
   ============================================================ */
function boot() {
  // 1) pasang semua listener & binding modul
  initToast();
  initModal();
  initViewport();
  initCanvasRenderer(); // registrasi listener 'element:sync'
  initCanvasInteraction();  // binding dilakukan saat module dimuat
  initKeyboard();
  initTopbar();
  initInspector();
  initLibraryPanel();
  initLayersPanel();
  initSelectionOverlay();
  initHistory();
  initPersistence();
  wireBus();

  // 2) muat dokumen: LocalStorage bila ada, kalau tidak pakai starter
  const loaded = loadFromLocalStorage(true);
  if (!loaded) {
    state.docName = STARTER_DOC.docName;
    state.device  = STARTER_DOC.device;
    state.elements = STARTER_DOC.elements.map(el => ({
      ...el,
      content: { ...(el.content || {}) },
      style: { ...(el.style || {}) }
    }));
    syncHeaderControls();
  }

  // 3) render pertama
  applyDevice();
  setZoom(state.zoom || fitZoom());
  bus.emit(EVENTS.RENDER_ALL);
  bus.emit(EVENTS.HISTORY_PUSH); // snapshot awal untuk undo
}

boot();
