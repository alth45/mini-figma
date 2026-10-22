/* ============================================================
   LAYERS PANEL — pohon layer di tab kanan
   ============================================================ */

import { state } from '../core/state.js';
import { bus, EVENTS } from '../core/bus.js';
import { COMPONENTS } from '../components/registry.js';
import { $, esc } from '../utils/dom.js';
import { deleteSelected } from '../core/canvasService.js';
import { updateSelectionBox } from './selectionOverlay.js';

export function renderLayers() {
  const tree = $('layerTree');
  tree.innerHTML = '';

  if (!state.elements.length) {
    tree.innerHTML = '<div class="empty">No layers yet.<br />Drag a component onto the canvas.</div>';
    return;
  }

  const build = (parentId, depth) => {
    // urutan terbalik: elemen paling atas tampil paling atas
    state.elements
      .filter(e => (e.parentId || null) === parentId)
      .slice()
      .reverse()
      .forEach(el => {
        const def = COMPONENTS[el.type] || { icon:'?' };
        const row = document.createElement('div');
        row.className = 'layer-row' +
          (state.selection.includes(el.id) ? ' sel' : '') +
          (el.hidden ? ' hidden-el' : '') +
          (el.locked ? ' locked-el' : '');
        row.style.paddingLeft = (8 + depth * 13) + 'px';
        row.dataset.id = el.id;

        row.innerHTML =
          `<span class="ltype">${def.icon}</span>` +
          `<span class="lname">${esc(el.name)}</span>` +
          `<button class="lbtn" data-act="hide" title="Toggle visibility">${el.hidden ? '◌' : '◉'}</button>` +
          `<button class="lbtn" data-act="lock" title="Toggle lock">${el.locked ? '🔒' : '🔓'}</button>` +
          `<button class="lbtn" data-act="del" title="Delete">✕</button>`;

        row.addEventListener('click', (e) => {
          const act = e.target.closest('.lbtn');
          if (act) {
            e.stopPropagation();
            const a = act.dataset.act;
            if (a === 'hide') { el.hidden = !el.hidden; bus.emit('element:sync', el); renderLayers(); bus.emit(EVENTS.SAVE_SOON); bus.emit(EVENTS.HISTORY_SCHEDULE); }
            if (a === 'lock') { el.locked = !el.locked; renderLayers(); bus.emit(EVENTS.SAVE_SOON); }
            if (a === 'del')  { state.selection = [el.id]; deleteSelected(); }
            return;
          }
          if (e.shiftKey) {
            if (state.selection.includes(el.id)) state.selection = state.selection.filter(s => s !== el.id);
            else state.selection.push(el.id);
          } else {
            state.selection = [el.id];
          }
          renderLayers();
          bus.emit('inspector:update');
          updateSelectionBox();
        });

        // double click = rename
        row.addEventListener('dblclick', (e) => {
          if (e.target.closest('.lbtn')) return;
          const nameSpan = row.querySelector('.lname');
          const input = document.createElement('input');
          input.value = el.name;
          nameSpan.innerHTML = '';
          nameSpan.appendChild(input);
          input.focus();
          input.select();
          const commit = () => {
            el.name = input.value.trim() || 'Layer';
            renderLayers();
            bus.emit('inspector:update');
            bus.emit(EVENTS.HISTORY_PUSH);
            bus.emit(EVENTS.SAVE_SOON);
          };
          input.addEventListener('blur', commit);
          input.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
            if (ev.key === 'Escape') { renderLayers(); }
            ev.stopPropagation();
          });
        });

        tree.appendChild(row);
        build(el.id, depth + 1);
      });
  };

  build(null, 0);
}

/** Tab switching Design / Layers */
export function initLayersPanel() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const t = btn.dataset.tab;
      $('tab-design').style.display = t === 'design' ? 'block' : 'none';
      $('tab-layers').style.display = t === 'layers' ? 'block' : 'none';
      if (t === 'layers') renderLayers();
    });
  });

  bus.on('layers:render', renderLayers);
}
