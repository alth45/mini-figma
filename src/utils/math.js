/* ============================================================
   UTILITAS MATEMATIKA & UMUM
   ============================================================ */

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export const uid = () => 'el_' + Math.random().toString(36).slice(2, 9);

export const clone = (o) => JSON.parse(JSON.stringify(o));

/** Nama file aman dari judul dokumen */
export function safeFileName(docName) {
  return (docName || 'design').replace(/[^\w\-]+/g, '_').toLowerCase();
}

/** Unduh konten sebagai file */
export function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
