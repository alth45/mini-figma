/* ============================================================
   UTILITAS DOM
   ============================================================ */

/** Shortcut document.getElementById */
export const $ = (id) => document.getElementById(id);

/** Escape karakter HTML agar aman disisipkan ke innerHTML */
export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g,
  (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

/** Validasi string hex warna (#rgb / #rrggbb), selain itu → null */
export function hexOrNull(v) {
  if (!v) return null;
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : null;
}

/** Cek apakah target adalah elemen input yang sedang diketik */
export function isTyping(t) {
  if (!t) return false;
  const tag = (t.tagName || '').toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable;
}

/** Set nilai input tanpa mengganggu fokus pengguna */
export function setVal(id, v) {
  const inp = $(id);
  if (!inp) return;
  if (document.activeElement === inp) return;
  inp.value = v;
}
