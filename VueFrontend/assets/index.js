/**
 * assets/index.js
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for every static asset used across the
 * JayxCreatez Productions frontend.
 *
 * Usage in any Vue SFC:
 *   import { FONTS, IMG } from '../assets/index.js'
 *   // or from a page inside pages/:
 *   import { FONTS, IMG } from '../assets/index.js'
 *
 * In <style> blocks the font import is already handled globally —
 * reference FONTS.GOOGLE_URL only if you need it at runtime (e.g.
 * to inject a <link> programmatically).
 * ─────────────────────────────────────────────────────────────────
 */

// ── Image imports — Vite resolves, fingerprints and copies these ──
import _ig   from './images/ig-icon-no-bg.png'
import _fb   from './images/fb-icon-no-bg.png'
import _x    from './images/x-icon-no-bg.png'
import _4045 from './images/IMG_4045.jpeg'
import _4046 from './images/IMG_4046.jpeg'
import _4047 from './images/IMG_4047.jpeg'
import _4048 from './images/IMG_4048.jpeg'
import _4049 from './images/IMG_4049.jpeg'

// ── Fonts ─────────────────────────────────────────────────────────
export const FONTS = {
  /**
   * Full Google Fonts URL covering every weight used site-wide:
   *   Cormorant Garamond — 300, 400, 600 (normal + italic)
   *   DM Sans            — 300, 400, 500
   */
  GOOGLE_URL:
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap',
}

// ── Social / UI icons ─────────────────────────────────────────────
export const ICONS = {
  INSTAGRAM: _ig,
  FACEBOOK:  _fb,
  X:         _x,
}

// ── Photography images ────────────────────────────────────────────
export const IMG = {
  IMG_4045: _4045,  // The Final Chapter       | Graduation
  IMG_4046: _4046,  // Written in History      | Portrait · Editorial
  IMG_4047: _4047,  // Golden Hour — Class of 2023 | Graduation
  IMG_4048: _4048,  // City Standards          | Portrait · Lifestyle  (also hero bg)
  IMG_4049: _4049,  // Suited Up               | Lifestyle
}

// ── Convenience array: gallery + homepage carousel order ──────────
export const PHOTOS = [
  { src: IMG.IMG_4045, alt: 'The Final Chapter',           title: 'The Final Chapter',           cat: 'Graduation',            filter: 'graduation' },
  { src: IMG.IMG_4046, alt: 'Written in History',          title: 'Written in History',          cat: 'Portrait · Editorial',  filter: 'portrait'   },
  { src: IMG.IMG_4047, alt: 'Golden Hour — Class of 2023', title: 'Golden Hour — Class of 2023', cat: 'Graduation · 2023',     filter: 'graduation', imgStyle: 'object-position: top' },
  { src: IMG.IMG_4048, alt: 'City Standards',              title: 'City Standards',              cat: 'Portrait · Lifestyle',  filter: 'portrait'   },
  { src: IMG.IMG_4049, alt: 'Suited Up',                   title: 'Suited Up',                   cat: 'Lifestyle',             filter: 'lifestyle'  },
]
