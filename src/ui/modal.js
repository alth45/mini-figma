/* ============================================================
   MODAL — dialog serbaguna untuk export & import
   ============================================================ */

import { $ } from '../utils/dom.js';

const modalBackdrop = $('modalBackdrop');

export function openModal(title, bodyHTML, footHTML) {
  $('modalTitle').textContent = title;
  $('modalBody').innerHTML = bodyHTML;
  $('modalFoot').innerHTML = footHTML || '';
  modalBackdrop.classList.add('open');
}

export function closeModal() {
  modalBackdrop.classList.remove('open');
}

export function initModal() {
  $('modalClose').addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
}
