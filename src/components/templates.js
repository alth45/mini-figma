/* ============================================================
   RENDERER ISI KOMPONEN — mengubah state elemen menjadi
   innerHTML string (pure function, tanpa akses DOM global).
   ============================================================ */

import { esc } from '../utils/dom.js';

/**
 * Render konten internal sebuah elemen.
 * @param {object} el - objek elemen dari state
 * @returns {string} HTML string
 */
export function renderInner(el) {
  const c = el.content || {};
  const s = el.style;
  const font = `font-family:${s.fontFamily};font-size:${s.fontSize}px;font-weight:${s.fontWeight};` +
               `color:${s.color};text-align:${s.textAlign};line-height:${s.lineHeight}`;
  const T = (v, d) => esc(v === undefined || v === null || v === '' ? d : v);

  switch (el.type) {

    /* ---------- LAYOUT ---------- */
    case 'container':
    case 'section':
    case 'spacer':
    case 'divider':
      return '';

    /* ---------- NAVIGATION ---------- */
    case 'navbar':
      return `<div style="display:flex;align-items:center;justify-content:space-between;height:100%;padding:0 14px;${font}">
        <b style="font-size:15px">${T(c.text,'Brand')}</b>
        <div style="display:flex;gap:14px;opacity:.62;font-size:12px"><span>Home</span><span>Features</span><span>Pricing</span></div>
      </div>`;

    case 'sidebar':
      return `<div style="height:100%;padding:14px 10px;display:flex;flex-direction:column;gap:5px;${font}">
        <div style="font-weight:700;font-size:14px;margin-bottom:8px">Menu</div>
        ${['Dashboard','Projects','Team','Settings']
          .map((x,i)=>`<div style="padding:8px 10px;border-radius:6px;font-size:13px;
            background:${i===0?'rgba(59,130,246,.14)':'transparent'};
            color:${i===0?'#2563eb':'inherit'};font-weight:${i===0?'600':'400'}">${x}</div>`)
          .join('')}
      </div>`;

    case 'tabs':
      return `<div style="display:flex;height:100%;align-items:stretch;${font}">
        ${['Tab One','Tab Two','Tab Three']
          .map((x,i)=>`<div style="flex:1;display:flex;align-items:center;justify-content:center;
            font-size:13px;border-bottom:2px solid ${i===0?'#3b82f6':'transparent'};
            color:${i===0?'#111827':'#6b7280'};font-weight:${i===0?'600':'400'}">${x}</div>`)
          .join('')}
      </div>`;

    case 'breadcrumb':
      return `<div style="display:flex;align-items:center;height:100%;gap:6px;${font}">
        <span>Home</span><span style="opacity:.45">/</span>
        <span>Projects</span><span style="opacity:.45">/</span>
        <span style="color:#111827;font-weight:600">Current</span>
      </div>`;

    /* ---------- FORM ---------- */
    case 'input':
      return `<div style="display:flex;flex-direction:column;gap:5px;height:100%;justify-content:center;${font}">
        ${c.label ? `<span style="font-size:12px;font-weight:600">${esc(c.label)}</span>` : ''}
        <div style="display:flex;align-items:center;padding:0 10px;height:34px;flex:0 0 auto;
             border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#9ca3af;font-size:13px">
          ${T(c.placeholder,'Placeholder…')}
        </div>
        ${c.helper ? `<span style="font-size:11px;color:#6b7280">${esc(c.helper)}</span>` : ''}
      </div>`;

    case 'textarea':
      return `<div style="display:flex;flex-direction:column;gap:5px;height:100%;${font}">
        ${c.label ? `<span style="font-size:12px;font-weight:600;flex:0 0 auto">${esc(c.label)}</span>` : ''}
        <div style="flex:1;min-height:0;border:1px solid #d1d5db;border-radius:6px;background:#fff;
             padding:8px 10px;color:#9ca3af;font-size:13px;overflow:hidden">${T(c.placeholder,'Write something…')}</div>
      </div>`;

    case 'select':
      return `<div style="display:flex;flex-direction:column;gap:5px;height:100%;justify-content:center;${font}">
        ${c.label ? `<span style="font-size:12px;font-weight:600">${esc(c.label)}</span>` : ''}
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0 10px;
             height:34px;border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#9ca3af;font-size:13px">
          <span>${T(c.placeholder,'Select an option')}</span><span style="color:#9ca3af">▾</span>
        </div>
      </div>`;

    case 'checkbox':
      return `<div style="display:flex;align-items:center;gap:9px;height:100%;${font}">
        <div style="width:16px;height:16px;flex:0 0 auto;border-radius:4px;display:flex;align-items:center;
             justify-content:center;font-size:11px;color:#fff;
             border:1px solid ${c.checked?'#3b82f6':'#9ca3af'};background:${c.checked?'#3b82f6':'#fff'}">
          ${c.checked ? '✓' : ''}
        </div>
        <span style="font-size:13px">${T(c.text,'Checkbox label')}</span>
      </div>`;

    case 'radio':
      return `<div style="display:flex;align-items:center;gap:9px;height:100%;${font}">
        <div style="width:16px;height:16px;flex:0 0 auto;border-radius:50%;display:flex;align-items:center;
             justify-content:center;border:1px solid ${c.checked?'#3b82f6':'#9ca3af'};background:#fff">
          ${c.checked ? '<span style="width:8px;height:8px;border-radius:50%;background:#3b82f6"></span>' : ''}
        </div>
        <span style="font-size:13px">${T(c.text,'Radio option')}</span>
      </div>`;

    case 'button':
      return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;${font}">
        ${T(c.text,'Button')}
      </div>`;

    case 'toggle':
      return `<div style="display:flex;align-items:center;gap:10px;height:100%;${font}">
        <div style="width:38px;height:22px;flex:0 0 auto;border-radius:11px;position:relative;
             background:${c.checked?'#3b82f6':'#d1d5db'}">
          <div style="position:absolute;top:2px;left:${c.checked?'18px':'2px'};width:18px;height:18px;
               border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25)"></div>
        </div>
        <span style="font-size:13px">${T(c.text,'Toggle')}</span>
      </div>`;

    /* ---------- DISPLAY ---------- */
    case 'card':
      return `<div style="display:flex;flex-direction:column;height:100%;${font}">
        <div style="height:38%;flex:0 0 auto;background:#f1f5f9;border-bottom:1px solid #e5e7eb;
             display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:12px">Image</div>
        <div style="padding:12px;display:flex;flex-direction:column;gap:4px;overflow:hidden">
          <div style="font-weight:700;font-size:14px">${T(c.title,'Card title')}</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45">${T(c.desc,'Short description.')}</div>
        </div>
      </div>`;

    case 'avatar': {
      const fs = Math.max(9, Math.round((s.w || 48) * 0.36));
      return `<div style="width:100%;height:100%;border-radius:50%;background:${s.fill && s.fill!=='none'?s.fill:'#dbeafe'};
        color:${s.color};display:flex;align-items:center;justify-content:center;font-weight:700;
        font-size:${fs}px;letter-spacing:.5px">${esc((c.text || 'AB').slice(0,2).toUpperCase())}</div>`;
    }

    case 'badge':
      return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;${font}">
        ${T(c.text,'Badge')}
      </div>`;

    case 'chip':
      return `<div style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;
        height:100%;padding:0 10px;${font}">
        <span>${T(c.text,'Chip')}</span>
        <span style="opacity:.5;font-size:14px;line-height:1">×</span>
      </div>`;

    case 'image':
      return `<div style="position:relative;width:100%;height:100%;background:${s.fill && s.fill!=='none'?s.fill:'#f1f5f9'};overflow:hidden">
        <div style="position:absolute;inset:0;background-image:
          linear-gradient(to bottom right,transparent calc(50% - .5px),#cbd5e1 50%,transparent calc(50% + .5px)),
          linear-gradient(to top right,transparent calc(50% - .5px),#cbd5e1 50%,transparent calc(50% + .5px))"></div>
        <div style="position:absolute;left:0;right:0;bottom:6px;text-align:center;font-size:10px;
             color:#94a3b8;letter-spacing:.5px">IMAGE</div>
      </div>`;

    case 'icon':
      return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;
        font-size:${Math.max(10, Math.round((s.h || 34) * 0.6))}px;line-height:1">${T(c.text,'★')}</div>`;

    /* ---------- TYPOGRAPHY ---------- */
    case 'h1':
    case 'h2':
    case 'h3':
      return `<div style="display:flex;align-items:center;width:100%;height:100%;white-space:pre-wrap;${font}">
        ${T(c.text,'Heading')}
      </div>`;

    case 'paragraph':
      return `<div style="width:100%;height:100%;white-space:pre-wrap;overflow:hidden;${font}">
        ${T(c.text,'Lorem ipsum dolor sit amet.')}
      </div>`;

    case 'label':
      return `<div style="display:flex;align-items:center;width:100%;height:100%;${font}">
        ${T(c.text,'Label')}
      </div>`;

    case 'caption':
      return `<div style="display:flex;align-items:center;width:100%;height:100%;${font}">
        ${T(c.text,'Caption text')}
      </div>`;

    /* ---------- FEEDBACK ---------- */
    case 'alert':
      return `<div style="display:flex;gap:10px;align-items:flex-start;padding:12px;height:100%;${font}">
        <div style="width:18px;height:18px;flex:0 0 auto;border-radius:50%;background:#f59e0b;color:#fff;
             display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800">!</div>
        <div style="font-size:12px;line-height:1.45;min-width:0">
          <b style="display:block;margin-bottom:2px">${T(c.title,'Heads up')}</b>
          <span style="color:#6b7280">${T(c.text,'This is an informational alert message.')}</span>
        </div>
      </div>`;

    case 'toast':
      return `<div style="display:flex;align-items:center;gap:9px;height:100%;padding:0 14px;font-size:12px;${font}">
        <span style="width:8px;height:8px;flex:0 0 auto;border-radius:50%;background:#22c55e"></span>
        ${T(c.text,'Saved successfully')}
      </div>`;

    case 'modal':
      return `<div style="display:flex;flex-direction:column;height:100%;${font}">
        <div style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-weight:700;font-size:14px;flex:0 0 auto">
          ${T(c.title,'Modal title')}
        </div>
        <div style="padding:16px;flex:1;min-height:0;font-size:12px;color:#6b7280;line-height:1.5;overflow:hidden">
          ${T(c.text,'Modal body content goes here.')}
        </div>
        <div style="padding:12px 16px;display:flex;justify-content:flex-end;gap:8px;
             border-top:1px solid #e5e7eb;flex:0 0 auto">
          <div style="padding:7px 14px;border-radius:6px;background:#f3f4f6;font-size:12px">Cancel</div>
          <div style="padding:7px 14px;border-radius:6px;background:#3b82f6;color:#fff;font-size:12px">Confirm</div>
        </div>
      </div>`;

    default:
      return '';
  }
}
