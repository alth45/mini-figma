/* ============================================================
   NODE STYLE — pemetaan style objek elemen → CSS node DOM
   ============================================================ */

import { SHADOWS } from '../config/constants.js';

/** Terapkan style kotak ke node elemen */
export function applyNodeStyle(n, el) {
  const s = el.style;
  n.style.position   = 'absolute';
  n.style.left       = s.x + 'px';
  n.style.top        = s.y + 'px';
  n.style.width      = s.w + 'px';
  n.style.height     = s.h + 'px';
  n.style.boxSizing  = 'border-box';
  n.style.background = (!s.fill || s.fill === 'none') ? 'transparent' : s.fill;
  n.style.border     = (s.borderWidth > 0) ? `${s.borderWidth}px solid ${s.borderColor}` : 'none';
  n.style.borderRadius = (s.radius || 0) + 'px';
  n.style.boxShadow  = SHADOWS[s.shadow] || 'none';
  n.style.opacity    = (s.opacity == null ? 1 : s.opacity);
  n.style.transform  = s.rotate ? `rotate(${s.rotate}deg)` : '';
  n.style.overflow   = 'hidden';
  n.style.fontFamily = s.fontFamily;
  n.style.fontSize   = s.fontSize + 'px';
  n.style.fontWeight = s.fontWeight;
  n.style.color      = s.color;
  n.style.textAlign  = s.textAlign;
  n.style.lineHeight = String(s.lineHeight);
}
