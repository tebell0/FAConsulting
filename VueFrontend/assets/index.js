/**
 * assets/index.js
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for every static asset used across the
 * JayxCreatez Productions frontend.
 *
 * Usage in any Vue SFC:
 *   import { FONTS, IMG, PHOTOS } from '../assets/index.js'
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
import _4084 from './images/IMG_4084.jpg'
import _4085 from './images/IMG_4085.jpg'
import _4086 from './images/IMG_4086.jpg'
import _4087 from './images/IMG_4087.jpg'

// ── Fonts ─────────────────────────────────────────────────────────
export const FONTS = {
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
  IMG_4045: _4045,  // The Final Chapter         | Graduation
  IMG_4046: _4046,  // Written in History         | Portrait · Editorial
  IMG_4047: _4047,  // Golden Hour — Class of 2023| Graduation
  IMG_4048: _4048,  // City Standards             | Portrait · Lifestyle
  IMG_4049: _4049,  // Suited Up                  | Lifestyle
  IMG_4084: _4084,  // Game Day Locker Room       | Sports
  IMG_4085: _4085,  // Rider's Edge               | Portrait · Editorial
  IMG_4086: _4086,  // UH Grad on the Bench       | Graduation
  IMG_4087: _4087,  // Sigma Night                | Graduation · Greek
}

// ── Convenience array: gallery + homepage order ───────────────────
export const PHOTOS = [
  { src: IMG.IMG_4045, alt: 'The Final Chapter',            title: 'The Final Chapter',            cat: 'Graduation',            filter: 'graduation' },
  { src: IMG.IMG_4046, alt: 'Written in History',           title: 'Written in History',           cat: 'Portrait · Editorial',  filter: 'portrait'   },
  { src: IMG.IMG_4047, alt: 'Golden Hour — Class of 2023',  title: 'Golden Hour — Class of 2023',  cat: 'Graduation · 2023',     filter: 'graduation', imgStyle: 'object-position: top' },
  { src: IMG.IMG_4048, alt: 'City Standards',               title: 'City Standards',               cat: 'Portrait · Lifestyle',  filter: 'portrait'   },
  { src: IMG.IMG_4049, alt: 'Suited Up',                    title: 'Suited Up',                    cat: 'Lifestyle',             filter: 'lifestyle'  },
  { src: IMG.IMG_4084, alt: 'Game Day Locker Room',         title: 'Game Day Locker Room',         cat: 'Sports',                filter: 'sports'     },
  { src: IMG.IMG_4085, alt: "Rider's Edge",                 title: "Rider's Edge",                 cat: 'Portrait · Editorial',  filter: 'portrait'   },
  { src: IMG.IMG_4086, alt: 'UH Grad on the Bench',        title: 'UH Grad on the Bench',         cat: 'Graduation',            filter: 'graduation' },
  { src: IMG.IMG_4087, alt: 'Sigma Night',                  title: 'Sigma Night',                  cat: 'Graduation · Greek',    filter: 'graduation' },
]
