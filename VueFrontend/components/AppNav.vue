<template>
  <nav :class="navClass">

    <!-- Logo -->
    <RouterLink to="/" class="nav-logo" v-bind="hoverAttrs">Jayx<span>Createz</span></RouterLink>

    <!-- Public nav links -->
    <ul class="nav-links" v-if="variant === 'public'">
      <li><RouterLink to="/"        :class="{ active: activePage === 'home'    }" v-bind="hoverAttrs">Home</RouterLink></li>
      <li><RouterLink to="/gallery" :class="{ active: activePage === 'gallery' }" v-bind="hoverAttrs">Gallery</RouterLink></li>
      <li><RouterLink to="/calendar":class="{ active: activePage === 'book'    }" v-bind="hoverAttrs">Book</RouterLink></li>
      <li><a href="/#about"         :class="{ active: activePage === 'about'   }" v-bind="hoverAttrs">About</a></li>
      <li><RouterLink to="/contact" :class="{ active: activePage === 'contact' }" v-bind="hoverAttrs">Contact</RouterLink></li>
    </ul>

    <!-- Admin nav links -->
    <ul class="nav-links" v-else-if="variant === 'admin'">
      <li><RouterLink to="/admindash"     :class="{ active: activePage === 'dash'         }" v-bind="hoverAttrs">Dashboard</RouterLink></li>
      <li><RouterLink to="/deliverables"  :class="{ active: activePage === 'deliverables' }" v-bind="hoverAttrs">Deliver</RouterLink></li>
      <li><RouterLink to="/adminsettings" :class="{ active: activePage === 'settings'     }" v-bind="hoverAttrs">Settings</RouterLink></li>
    </ul>

    <!-- Right slot: CTA or badge -->
    <RouterLink to="/calendar" class="nav-cta" v-if="variant === 'public'" v-bind="hoverAttrs">Book a Session</RouterLink>
    <span class="nav-admin-badge" v-else-if="variant === 'admin'">Admin</span>

  </nav>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Props
 * ─────
 * variant    'public' | 'admin'   (default: 'public')
 *   'public' → transparent gradient nav + public links + Book CTA
 *   'admin'  → nav-solid + admin links + Admin badge
 *
 * activePage  string  — matches one of the link keys to apply .active
 *   public keys: 'home' | 'gallery' | 'book' | 'about' | 'contact'
 *   admin  keys: 'dash' | 'deliverables' | 'settings'
 *
 * isHovering  Boolean (v-model) — passed in from parent for cursor hover state.
 *   Only needed on pages that use :auto-hover="false" on AppCursor.
 *   If null / not passed, the nav won't emit hover events (autoHover pages).
 */
const props = defineProps({
  variant:    { type: String,  default: 'public' },
  activePage: { type: String,  default: ''       },
})

const emit = defineEmits(['hover-enter', 'hover-leave'])

const navClass = computed(() => ({
  'nav-solid': props.variant === 'admin',
}))

// Hover attrs — only wire up when parent wants manual hover tracking
const hoverAttrs = computed(() => ({
  onMouseenter: () => emit('hover-enter'),
  onMouseleave: () => emit('hover-leave'),
}))
</script>

<style scoped>
/* ── Nav ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.6rem 4rem;
  background: linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, transparent 100%);
  backdrop-filter: blur(2px);
}
nav.nav-solid {
  background: rgba(10,10,10,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(200,169,126,0.1);
}

.nav-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem; font-weight: 300;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--off-white); text-decoration: none;
}
.nav-logo span { color: var(--warm); }

.nav-links { display: flex; gap: 2.8rem; list-style: none; }
.nav-links a {
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: rgba(245,240,235,0.65); text-decoration: none; position: relative;
  transition: color 0.3s;
}
.nav-links a::after {
  content: ''; position: absolute; bottom: -3px; left: 0; right: 0;
  height: 1px; background: var(--warm);
  transform: scaleX(0); transform-origin: left; transition: transform 0.35s ease;
}
.nav-links a:hover       { color: var(--off-white); }
.nav-links a:hover::after { transform: scaleX(1); }
.nav-links a.active       { color: var(--off-white); }
.nav-links a.active::after { transform: scaleX(1); }

.nav-cta {
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
  padding: 0.65rem 1.6rem; border: 1px solid var(--warm);
  color: var(--warm); text-decoration: none;
  transition: background 0.3s, color 0.3s;
}
.nav-cta:hover { background: var(--warm); color: var(--black); }

.nav-admin-badge {
  font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--warm); border: 1px solid var(--warm);
  padding: 0.35rem 0.9rem; pointer-events: none;
}
</style>
