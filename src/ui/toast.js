/* ============================================================
   TOAST — notifikasi kecil di bawah layar
   ============================================================ */

import { bus } from '../core/bus.js';
import { $, esc } from '../utils/dom.js';

export function toast(msg, type) {
  const wrap = $('toastWrap');
  const el = document.createElement('div');
  el.className = 'toast ' + (type || '');
  el.innerHTML = '<span class="tdot"></span>' + esc(msg);
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .25s, transform .25s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    setTimeout(() => el.remove(), 260);
  }, 1800);
}

export function initToast() {
  bus.on('toast', ({ msg, type }) => toast(msg, type));
}
