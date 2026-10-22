/* ============================================================
   KONFIGURASI PUSAT — seluruh konstanta aplikasi ada di sini
   ============================================================ */

export const GRID_SIZE     = 8;    // ukuran snap grid (px)
export const MIN_SIZE      = 8;    // ukuran minimum elemen (px)
export const HISTORY_LIMIT = 50;   // maksimal langkah undo
export const STORAGE_KEY   = 'wireframe-studio.v1';
export const SAVE_DEBOUNCE = 600;  // ms
export const ZOOM_MIN = 0.1;
export const ZOOM_MAX = 3;

/** Preset bayangan yang bisa dipilih di inspector */
export const SHADOWS = {
  none: 'none',
  sm:   '0 1px 2px rgba(15,23,42,.10)',
  md:   '0 4px 10px rgba(15,23,42,.12)',
  lg:   '0 14px 34px rgba(15,23,42,.20)'
};

/** Preset device frame */
export const DEVICES = {
  iphone:  { name: 'iPhone',  w: 390,  h: 844,  notch: true  },
  android: { name: 'Android', w: 360,  h: 800,  notch: true  },
  tablet:  { name: 'Tablet',  w: 768,  h: 1024, notch: false },
  desktop: { name: 'Desktop', w: 1440, h: 900,  notch: false },
  custom:  { name: 'Custom',  w: 1000, h: 700,  notch: false }
};
