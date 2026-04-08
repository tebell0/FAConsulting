<template>
  <footer>
    <div class="footer-top">

      <div class="footer-brand">
        <RouterLink to="/" class="nav-logo" v-bind="hoverAttrs">Jayx<span>Createz</span></RouterLink>
        <p>Premium photography experiences based in Houston, TX. Capturing moments that live forever.</p>
        <RouterLink v-if="variant === 'public'" to="/adminsignin" class="footer-admin-btn" v-bind="hoverAttrs">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="5" width="10" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/>
            <path d="M4 5V3.5a2 2 0 014 0V5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          Admin Portal
        </RouterLink>
      </div>

      <div>
        <div class="footer-col-title">Navigate</div>
        <ul class="footer-links">
          <li><RouterLink to="/"        v-bind="hoverAttrs">Home</RouterLink></li>
          <li><RouterLink to="/gallery" v-bind="hoverAttrs">Gallery</RouterLink></li>
          <li><RouterLink to="/calendar"v-bind="hoverAttrs">Book a Session</RouterLink></li>
          <li v-if="variant === 'public'"><RouterLink to="/#about"    v-bind="hoverAttrs">About</RouterLink></li>
          <li v-if="variant === 'admin'" ><RouterLink to="/admindash" v-bind="hoverAttrs">Admin</RouterLink></li>
        </ul>
      </div>

      <div>
        <div class="footer-col-title">Services</div>
        <ul class="footer-links">
          <li><RouterLink to="/calendar" v-bind="hoverAttrs">The Essentials</RouterLink></li>
          <li><RouterLink to="/calendar" v-bind="hoverAttrs">The Signature</RouterLink></li>
          <li><RouterLink to="/calendar" v-bind="hoverAttrs">The Elite</RouterLink></li>
          <li><RouterLink to="/calendar" v-bind="hoverAttrs">Weddings</RouterLink></li>
        </ul>
      </div>

      <div>
        <div class="footer-col-title">Contact</div>
        <ul class="footer-links">
          <li><a href="mailto:jalen@jayxcreatez.com" v-bind="hoverAttrs">jalen@jayxcreatez.com</a></li>
          <li><a href="#" v-bind="hoverAttrs">Houston, TX</a></li>
          <li>
            <a href="https://www.instagram.com/jayxcreatez?igsh=MXY4cHhzM2kzdzlkaA%3D%3D"
               target="_blank" rel="noopener" v-bind="hoverAttrs">Instagram</a>
          </li>
          <li><a href="#" v-bind="hoverAttrs">Facebook</a></li>
        </ul>
      </div>

    </div>

    <div class="footer-bottom">
      <span class="footer-copy">&copy; 2026 JayxCreatez Productions. All rights reserved.</span>
      <div class="footer-socials">
        <a href="https://www.instagram.com/jayxcreatez?igsh=MXY4cHhzM2kzdzlkaA%3D%3D"
           target="_blank" rel="noopener" class="social-link" v-bind="hoverAttrs">
          <img :src="ICONS.INSTAGRAM" alt="Instagram" />
        </a>
        <a href="#" class="social-link" v-bind="hoverAttrs">
          <img :src="ICONS.FACEBOOK" alt="Facebook" />
        </a>
        <a href="#" class="social-link" v-bind="hoverAttrs">
          <img :src="ICONS.X" alt="X / TikTok" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { ICONS } from '../assets/index.js'

/**
 * Props
 * ─────
 * variant   'public' | 'admin'  (default: 'public')
 *   'public' → shows "Admin Portal" link, "About" in Navigate
 *   'admin'  → no "Admin Portal" link, "Admin" in Navigate
 */
const props = defineProps({
  variant: { type: String, default: 'public' },
})

const emit = defineEmits(['hover-enter', 'hover-leave'])

const hoverAttrs = computed(() => ({
  onMouseenter: () => emit('hover-enter'),
  onMouseleave: () => emit('hover-leave'),
}))
</script>

<style scoped>
footer {
  border-top: 1px solid var(--glass-border);
  padding: 5rem 4rem 2.5rem;
}
.footer-top {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3.5rem;
}
.footer-brand p {
  font-size: 0.82rem;
  line-height: 1.75;
  color: rgba(245,240,235,0.4);
  margin: 1rem 0 1.5rem;
  max-width: 260px;
}
.footer-admin-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(245,240,235,0.3); text-decoration: none;
  border: 1px solid rgba(245,240,235,0.1);
  padding: 0.45rem 1rem;
  transition: color 0.3s, border-color 0.3s;
  cursor: none;
}
.footer-admin-btn:hover { color: var(--warm); border-color: rgba(200,169,126,0.3); }

.footer-col-title {
  font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--warm); margin-bottom: 1.2rem;
}
.footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; }
.footer-links a {
  font-size: 0.82rem; color: rgba(245,240,235,0.45);
  text-decoration: none; transition: color 0.3s;
}
.footer-links a:hover { color: var(--off-white); }

.footer-bottom {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 2rem; border-top: 1px solid rgba(200,169,126,0.08);
}
.footer-copy {
  font-size: 0.72rem; letter-spacing: 0.1em;
  color: rgba(245,240,235,0.25);
}
.footer-socials { display: flex; gap: 1rem; }
.social-link {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px;
  border: 1px solid rgba(200,169,126,0.2);
  color: rgba(200,169,126,0.6);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: border-color 0.3s, color 0.3s;
}
.social-link img { display: block; width: 16px; height: 16px; object-fit: contain; }
.social-link:hover { border-color: var(--warm); color: var(--warm); }

/* ── Responsive ── */
@media (max-width: 768px) {
  footer { padding: 3.5rem 1.5rem 2rem; }
  .footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; }
  .footer-bottom { flex-direction: column; gap: 1.2rem; text-align: center; }
}
@media (max-width: 480px) {
  .footer-top { grid-template-columns: 1fr; }
}
</style>
