<template>
  <nav :class="navClass">

    <!-- Logo -->
    <RouterLink to="/" class="nav-logo" v-bind="hoverAttrs">Jayx<span>Createz</span></RouterLink>

    <!-- Hamburger toggle (mobile only) -->
    <button class="nav-burger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>

    <!-- Public nav links -->
    <ul class="nav-links" :class="{ 'nav-open': menuOpen }" v-if="variant === 'public'">
      <li><RouterLink to="/"        :class="{ active: activePage === 'home'    }" v-bind="hoverAttrs" @click="menuOpen=false">Home</RouterLink></li>
      <li><RouterLink to="/gallery" :class="{ active: activePage === 'gallery' }" v-bind="hoverAttrs" @click="menuOpen=false">Gallery</RouterLink></li>
      <li><RouterLink to="/calendar":class="{ active: activePage === 'book'    }" v-bind="hoverAttrs" @click="menuOpen=false">Book</RouterLink></li>
      <li><a href="/#about"         :class="{ active: activePage === 'about'   }" v-bind="hoverAttrs" @click="menuOpen=false">About</a></li>
      <li><RouterLink to="/contact" :class="{ active: activePage === 'contact' }" v-bind="hoverAttrs" @click="menuOpen=false">Contact</RouterLink></li>
      <li class="nav-cta-mobile">
        <RouterLink to="/calendar" class="nav-cta" v-bind="hoverAttrs" @click="menuOpen=false">Book a Session</RouterLink>
      </li>
    </ul>

    <!-- Admin nav links -->
    <ul class="nav-links" :class="{ 'nav-open': menuOpen }" v-else-if="variant === 'admin'">
      <li><RouterLink to="/admindash"     :class="{ active: activePage === 'dash'         }" v-bind="hoverAttrs" @click="menuOpen=false">Dashboard</RouterLink></li>
      <li><RouterLink to="/deliverables"  :class="{ active: activePage === 'deliverables' }" v-bind="hoverAttrs" @click="menuOpen=false">Deliver</RouterLink></li>
      <li><RouterLink to="/adminsettings" :class="{ active: activePage === 'settings'     }" v-bind="hoverAttrs" @click="menuOpen=false">Settings</RouterLink></li>
    </ul>

    <!-- Right slot: CTA or badge (desktop only) -->
    <RouterLink to="/calendar" class="nav-cta nav-cta-desktop" v-if="variant === 'public'" v-bind="hoverAttrs">Book a Session</RouterLink>
    <span class="nav-admin-badge" v-else-if="variant === 'admin'">Admin</span>

  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  variant:    { type: String,  default: 'public' },
  activePage: { type: String,  default: ''       },
})

const emit = defineEmits(['hover-enter', 'hover-leave'])

const menuOpen = ref(false)

const navClass = computed(() => ({
  'nav-solid': props.variant === 'admin',
}))

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
  z-index: 102;
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

/* ── Hamburger ── */
.nav-burger {
  display: none;
  flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer;
  padding: 4px; z-index: 102;
}
.nav-burger span {
  display: block; width: 22px; height: 1.5px;
  background: var(--off-white, #f5f0eb);
  transition: transform 0.3s, opacity 0.3s;
}
.nav-burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.nav-burger.open span:nth-child(2) { opacity: 0; }
.nav-burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

.nav-cta-mobile { display: none; }

/* ── Mobile ── */
@media (max-width: 768px) {
  nav { padding: 1.2rem 1.5rem; }

  .nav-burger { display: flex; }
  .nav-cta-desktop { display: none; }
  .nav-cta-mobile { display: block; margin-top: 1rem; }

  .nav-links {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    flex-direction: column; align-items: center; justify-content: center;
    gap: 2rem;
    background: rgba(10,10,10,0.97);
    backdrop-filter: blur(20px);
    z-index: 101;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .nav-links.nav-open {
    opacity: 1; pointer-events: auto;
  }
  .nav-links a { font-size: 0.9rem; letter-spacing: 0.25em; }
}
</style>
