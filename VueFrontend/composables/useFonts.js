/**
 * composables/useFonts.js
 * ─────────────────────────────────────────────────────────────────
 * Injects the Google Fonts <link> tag into <head> exactly once,
 * no matter how many pages/components call this composable.
 *
 * Usage — call inside <script setup> (runs at component setup time):
 *   import { useFonts } from '../composables/useFonts.js'
 *   useFonts()
 * ─────────────────────────────────────────────────────────────────
 */

import { FONTS } from '../assets/index.js'

const LINK_ID = 'jayx-google-fonts'

export function useFonts() {
  // Skip if already injected (SSR-safe guard too)
  if (typeof document === 'undefined') return
  if (document.getElementById(LINK_ID)) return

  // Preconnect hints for faster font load
  const preconnect1 = document.createElement('link')
  preconnect1.rel  = 'preconnect'
  preconnect1.href = 'https://fonts.googleapis.com'

  const preconnect2 = document.createElement('link')
  preconnect2.rel         = 'preconnect'
  preconnect2.href        = 'https://fonts.gstatic.com'
  preconnect2.crossOrigin = 'anonymous'

  const link    = document.createElement('link')
  link.id       = LINK_ID
  link.rel      = 'stylesheet'
  link.href     = FONTS.GOOGLE_URL

  document.head.append(preconnect1, preconnect2, link)
}
