<template>

  <!-- Cursor -->
  <AppCursor v-model="isHovering" :auto-hover="false" />

  <!-- Nav -->
  <AppNav variant="public" active-page="gallery" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />

  <!-- Hero -->
  <div class="gallery-hero">
    <img class="hero-bg-img" :src="IMG.IMG_4048" alt="Hero background" />
    <div class="hero-gradient"></div>
    <div class="hero-side-text">JayxCreatez Productions · Houston TX</div>
    <div class="hero-scroll-line"></div>
    <div class="hero-content">
      <div class="hero-eyebrow">Portfolio · Selected Works</div>
      <h1 class="hero-title">The <em>Gallery</em></h1>
      <div class="hero-meta">
        <div class="hero-meta-item">
          <span class="hero-meta-num">{{ visibleCount }}</span>
          <span class="hero-meta-label">Images</span>
        </div>
        <div class="hero-meta-item">
          <span class="hero-meta-num">3</span>
          <span class="hero-meta-label">Categories</span>
        </div>
        <div class="hero-meta-item">
          <span class="hero-meta-num">2023&ndash;</span>
          <span class="hero-meta-label">Active</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Filter Bar -->
  <div class="filter-wrap">
    <div class="filter-tabs">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        class="filter-tab"
        :class="{ active: activeFilter === tab.value }"
        @click="setFilter(tab.value)"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >{{ tab.label }}</button>
    </div>
    <span class="filter-count">{{ visibleCount }} image{{ visibleCount !== 1 ? 's' : '' }}</span>
  </div>

  <!-- Featured Row -->
  <div class="featured-row">
    <div
      v-for="item in featuredItems"
      :key="item.idx"
      class="featured-item reveal"
      :class="{ 'filtered-out': !isVisible(item.filter) }"
      :data-category="item.filter"
      @click="openLightbox(item.idx)"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <img :src="item.src" :alt="item.alt" />
      <div class="featured-num">{{ item.num }}</div>
      <div class="featured-overlay">
        <div class="featured-tag">{{ item.tag }}</div>
        <div class="featured-title" v-html="item.title"></div>
        <div class="featured-open">
          View full image
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12M7 1l5 4-5 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Photo Grid -->
  <div class="grid-section">
    <div class="grid-label-row">
      <span class="grid-label">More from the collection</span>
      <div class="grid-label-line"></div>
    </div>
    <div class="photo-grid">
      <div
        v-for="item in gridItems"
        :key="item.idx + '-' + item.title"
        class="grid-item reveal"
        :class="{ 'filtered-out': !isVisible(item.filter) }"
        :data-category="item.filter"
        @click="openLightbox(item.idx)"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <img :src="item.src" :alt="item.alt" :style="item.imgStyle" />
        <div class="grid-overlay">
          <div class="grid-zoom">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 12L12 1M12 1H1M12 1v11" stroke="var(--warm)" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <div class="grid-info">
          <div class="grid-info-cat">{{ item.cat }}</div>
          <div class="grid-info-title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA Strip -->
  <div class="cta-strip reveal">
    <div class="cta-left">
      <div class="cta-eyebrow">Like What You See?</div>
      <h2>Let&apos;s Create Your <em>Story</em></h2>
    </div>
    <div class="cta-right">
      <RouterLink
        to="/calendar"
        class="btn-book"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        Book a Session
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
          <path d="M1 6h12M7 1l6 5-6 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </RouterLink>
    </div>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <div class="lightbox" :class="{ open: lightboxOpen }" @click.self="closeLightbox">
      <div class="lb-inner" @click.self="closeLightbox">
        <button
          class="lb-close"
          @click="closeLightbox"
          @mouseenter="isHovering = true"
          @mouseleave="isHovering = false"
        >
          <div class="lb-close-x">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.2"/>
            </svg>
          </div>
          Close
        </button>

        <img class="lb-img" :src="currentPhoto.src" :alt="currentPhoto.title" />

        <button
          class="lb-nav lb-prev"
          @click="navLightbox(-1)"
          @mouseenter="isHovering = true"
          @mouseleave="isHovering = false"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 1L3 7l6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </button>
        <button
          class="lb-nav lb-next"
          @click="navLightbox(1)"
          @mouseenter="isHovering = true"
          @mouseleave="isHovering = false"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 1l6 6-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </button>

        <div class="lb-info">
          <div class="lb-counter">{{ currentIndex + 1 }} / {{ photos.length }}</div>
          <div class="lb-cat">{{ currentPhoto.cat }}</div>
          <div class="lb-title">{{ currentPhoto.title }}</div>
        </div>

        <div class="lb-thumbs">
          <img
            v-for="(p, i) in photos"
            :key="i"
            class="lb-thumb"
            :class="{ active: i === currentIndex }"
            :src="p.src"
            :alt="p.title"
            @click="openLightbox(i)"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
          />
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Footer -->
  <AppFooter variant="public" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />

</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppCursor from '../components/AppCursor.vue'
import AppNav    from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import { IMG, PHOTOS } from '../assets/index.js'
import { useFonts } from '../composables/useFonts.js'
useFonts()

// ── Cursor state (driven by this page via v-model) ────────
const isHovering = ref(false)

// ── Photo Data (sourced from assets) ─────────────────────
const photos = PHOTOS

// ── Featured & Grid Item Definitions ─────────────────────
const featuredItems = [
  { idx: 2, src: IMG.IMG_4047, alt: 'Golden Hour Graduation', num: '01', tag: 'Graduation · 2023',   title: 'Golden Hour —<br>Class of 2023', filter: 'graduation' },
  { idx: 4, src: IMG.IMG_4049, alt: 'Suited Up',              num: '02', tag: 'Lifestyle · Portrait', title: 'Suited Up',                      filter: 'lifestyle'  },
]

const gridItems = [
  { idx: 1, src: IMG.IMG_4046, alt: 'Written in History', cat: 'Portrait · Editorial', title: 'Written in History', filter: 'portrait'                                        },
  { idx: 3, src: IMG.IMG_4048, alt: 'City Standards',     cat: 'Portrait · Lifestyle', title: 'City Standards',     filter: 'portrait'                                        },
  { idx: 0, src: IMG.IMG_4045, alt: 'The Final Chapter',  cat: 'Graduation',           title: 'The Final Chapter',  filter: 'graduation'                                      },
  { idx: 2, src: IMG.IMG_4047, alt: 'Golden Hour',        cat: 'Graduation · 2023',    title: 'Golden Hour',        filter: 'graduation', imgStyle: 'object-position: top'   },
  { idx: 4, src: IMG.IMG_4049, alt: 'Suited Up',          cat: 'Lifestyle',            title: 'Suited Up',          filter: 'lifestyle'                                       },
]

// ── Filter ────────────────────────────────────────────────
const filterTabs = [
  { label: 'All Work',   value: 'all'        },
  { label: 'Portraits',  value: 'portrait'   },
  { label: 'Graduation', value: 'graduation' },
  { label: 'Lifestyle',  value: 'lifestyle'  },
]
const activeFilter = ref('all')

function setFilter(val) { activeFilter.value = val }
function isVisible(filter) { return activeFilter.value === 'all' || activeFilter.value === filter }

const visibleCount = computed(() =>
  activeFilter.value === 'all'
    ? photos.length
    : photos.filter(p => p.filter === activeFilter.value).length
)

// ── Lightbox ──────────────────────────────────────────────
const lightboxOpen = ref(false)
const currentIndex = ref(0)
const currentPhoto = computed(() => photos[currentIndex.value])

function openLightbox(idx) {
  currentIndex.value = idx
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function navLightbox(dir) {
  currentIndex.value = (currentIndex.value + dir + photos.length) % photos.length
}

function onKeyDown(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape')     closeLightbox()
  if (e.key === 'ArrowRight') navLightbox(1)
  if (e.key === 'ArrowLeft')  navLightbox(-1)
}

// ── Scroll Reveal ─────────────────────────────────────────
let scrollObserver = null

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => {
  document.addEventListener('keydown', onKeyDown)

  scrollObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
    { threshold: 0.08 }
  )
  document.querySelectorAll('.reveal').forEach(el => scrollObserver.observe(el))
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
  if (scrollObserver) scrollObserver.disconnect()
  document.body.style.overflow = ''
})
</script>

<style>
:root {
  --black:        #0a0a0a;
  --deep:         #0d0c0a;
  --off-white:    #f5f0eb;
  --cream:        #f2ede6;
  --warm:         #c8a97e;
  --warm-light:   #dbbf94;
  --warm-dim:     rgba(200,169,126,0.18);
  --glass:        rgba(245,240,235,0.06);
  --glass-border: rgba(200,169,126,0.2);
  --success:      #7ec89e;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: var(--black); color: var(--off-white); font-family: 'DM Sans', sans-serif; overflow-x: hidden; cursor: none; }

/* ── Gallery Hero ── */
.gallery-hero { height: 100vh; position: relative; overflow: hidden; display: flex; align-items: flex-end; }
.hero-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; filter: brightness(0.45) saturate(0.9); transform: scale(1.04); animation: heroZoom 12s ease-out forwards; }
@keyframes heroZoom { from { transform: scale(1.04); } to { transform: scale(1.00); } }
.hero-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.3) 45%, transparent 100%), linear-gradient(to right, rgba(8,8,8,0.3) 0%, transparent 60%); }
.hero-side-text { position: absolute; right: 3rem; top: 50%; transform: translateY(-50%) rotate(90deg); font-size: 0.58rem; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(200,169,126,0.4); white-space: nowrap; }
.hero-scroll-line { position: absolute; bottom: 0; left: 4rem; width: 1px; height: 80px; background: linear-gradient(to bottom, var(--warm), transparent); animation: lineGrow 1.8s ease-in-out infinite; }
@keyframes lineGrow { 0% { transform: scaleY(0); transform-origin: top; } 50% { transform: scaleY(1); transform-origin: top; } 51% { transform: scaleY(1); transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }
.hero-content { position: relative; z-index: 2; padding: 0 4rem 5rem; max-width: 700px; }
.hero-eyebrow { font-size: 0.62rem; letter-spacing: 0.38em; text-transform: uppercase; color: var(--warm); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 1rem; opacity: 0; animation: fadeSlideUp 1s 0.3s ease forwards; }
.hero-eyebrow::before { content: ''; width: 36px; height: 1px; background: var(--warm); }
@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
.hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(3.8rem, 8vw, 7rem); font-weight: 300; line-height: 1.0; letter-spacing: -0.01em; margin-bottom: 1.5rem; opacity: 0; animation: fadeSlideUp 1s 0.5s ease forwards; }
.hero-title em { font-style: italic; color: var(--warm); }
.hero-meta { display: flex; gap: 2.5rem; opacity: 0; animation: fadeSlideUp 1s 0.7s ease forwards; }
.hero-meta-item { display: flex; flex-direction: column; gap: 0.2rem; }
.hero-meta-num { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 300; color: var(--warm); line-height: 1; }
.hero-meta-label { font-size: 0.58rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(242,237,230,0.35); }

/* ── Filter Bar ── */
.filter-wrap { position: sticky; top: 72px; z-index: 50; background: rgba(8,8,8,0.96); backdrop-filter: blur(12px); border-bottom: 1px solid var(--warm-dim); padding: 0 4rem; display: flex; align-items: center; justify-content: space-between; }
.filter-tabs { display: flex; }
.filter-tab { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; padding: 1.1rem 1.6rem; background: none; border: none; border-bottom: 2px solid transparent; color: rgba(242,237,230,0.4); cursor: none; font-family: 'DM Sans', sans-serif; transition: color 0.3s, border-color 0.3s; margin-bottom: -1px; }
.filter-tab:hover { color: rgba(242,237,230,0.8); }
.filter-tab.active { color: var(--warm); border-bottom-color: var(--warm); }
.filter-count { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(200,169,126,0.4); }

/* ── Featured Row ── */
.featured-row { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3px; padding: 3px; }
.featured-item { position: relative; overflow: hidden; aspect-ratio: 3/4; cursor: none; }
.featured-item:first-child { aspect-ratio: 2/3; }
.featured-item.filtered-out { opacity: 0.1; pointer-events: none; }
.featured-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.6s ease; filter: brightness(0.88) saturate(0.95); }
.featured-item:hover img { transform: scale(1.05); filter: brightness(0.95) saturate(1.05); }
.featured-num { position: absolute; top: 1.5rem; left: 1.5rem; font-family: 'Cormorant Garamond', serif; font-size: 4.5rem; font-weight: 300; line-height: 1; color: transparent; -webkit-text-stroke: 1px rgba(200,169,126,0.2); pointer-events: none; transition: -webkit-text-stroke-color 0.4s; }
.featured-item:hover .featured-num { -webkit-text-stroke-color: rgba(200,169,126,0.45); }
.featured-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.1) 50%, transparent 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 2.5rem; opacity: 0; transition: opacity 0.4s; }
.featured-item:hover .featured-overlay { opacity: 1; }
.featured-tag { font-size: 0.58rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--warm); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.6rem; }
.featured-tag::before { content: ''; width: 20px; height: 1px; background: var(--warm); }
.featured-title { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 300; line-height: 1.1; margin-bottom: 1rem; }
.featured-open { display: inline-flex; align-items: center; gap: 0.6rem; font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(242,237,230,0.6); transition: color 0.3s; }
.featured-item:hover .featured-open { color: var(--warm); }

/* ── Grid Section ── */
.grid-section { padding: 3px; padding-top: 0; }
.grid-label-row { display: flex; align-items: center; gap: 2rem; padding: 3rem 1rem 1.5rem; }
.grid-label { font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(200,169,126,0.5); white-space: nowrap; }
.grid-label-line { flex: 1; height: 1px; background: var(--warm-dim); }
.photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; }
.grid-item { position: relative; overflow: hidden; cursor: none; }
.grid-item:nth-child(1) { grid-column: span 2; aspect-ratio: 16/9; }
.grid-item:nth-child(2) { aspect-ratio: 3/4; grid-row: span 2; }
.grid-item:nth-child(3) { aspect-ratio: 4/3; }
.grid-item:nth-child(4) { aspect-ratio: 1; }
.grid-item:nth-child(5) { aspect-ratio: 3/4; }
.grid-item.filtered-out { opacity: 0.1; pointer-events: none; }
.grid-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease; filter: brightness(0.85) saturate(0.9); }
.grid-item:hover img { transform: scale(1.06); filter: brightness(0.95) saturate(1.0); }
.grid-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, transparent 50%, rgba(8,8,8,0.8) 100%); opacity: 0; transition: opacity 0.4s; display: flex; align-items: flex-end; justify-content: flex-end; padding: 1.5rem; }
.grid-item:hover .grid-overlay { opacity: 1; }
.grid-zoom { width: 40px; height: 40px; border: 1px solid var(--warm); border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: scale(0) rotate(-30deg); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1); }
.grid-item:hover .grid-zoom { transform: scale(1) rotate(0deg); }
.grid-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.2rem 1.4rem; background: linear-gradient(to top, rgba(8,8,8,0.92), transparent); opacity: 0; transform: translateY(6px); transition: opacity 0.4s, transform 0.4s; }
.grid-item:hover .grid-info { opacity: 1; transform: translateY(0); }
.grid-info-cat { font-size: 0.56rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--warm); margin-bottom: 0.2rem; }
.grid-info-title { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 300; }

/* ── CTA Strip ── */
.cta-strip { margin: 3px; margin-top: 0; background: var(--deep); border: 1px solid var(--warm-dim); padding: 5rem 4rem; display: flex; align-items: center; justify-content: space-between; gap: 3rem; }
.cta-left .cta-eyebrow { font-size: 0.6rem; letter-spacing: 0.32em; text-transform: uppercase; color: var(--warm); margin-bottom: 0.8rem; }
.cta-left h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 300; line-height: 1.2; }
.cta-left h2 em { font-style: italic; color: var(--warm); }
.btn-book { display: inline-flex; align-items: center; gap: 0.9rem; background: var(--warm); color: var(--black); font-size: 0.7rem; letter-spacing: 0.24em; text-transform: uppercase; text-decoration: none; padding: 1.1rem 2.4rem; font-weight: 500; transition: background 0.3s, transform 0.2s; }
.btn-book:hover { background: var(--warm-light); transform: translateY(-2px); }

/* ── Lightbox ── */
.lightbox { position: fixed; inset: 0; z-index: 1000; background: rgba(5,5,5,0.98); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.4s; }
.lightbox.open { opacity: 1; pointer-events: all; }
.lb-inner { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 5rem 6rem; }
.lb-close { position: absolute; top: 2rem; right: 2.5rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(242,237,230,0.4); background: none; border: none; cursor: none; font-family: 'DM Sans', sans-serif; transition: color 0.3s; }
.lb-close:hover { color: var(--warm); }
.lb-close-x { width: 28px; height: 28px; border: 1px solid rgba(200,169,126,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: border-color 0.3s; }
.lb-close:hover .lb-close-x { border-color: var(--warm); }
.lb-img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; border: 1px solid rgba(200,169,126,0.12); box-shadow: 0 0 80px rgba(0,0,0,0.8); }
.lb-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border: 1px solid rgba(200,169,126,0.2); background: rgba(8,8,8,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; cursor: none; color: var(--off-white); transition: border-color 0.3s, background 0.3s; }
.lb-nav:hover { border-color: var(--warm); background: rgba(200,169,126,0.1); }
.lb-prev { left: 2rem; }
.lb-next { right: 2rem; }
.lb-info { position: absolute; right: 3rem; bottom: 3rem; text-align: right; }
.lb-counter { font-size: 0.58rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(200,169,126,0.45); margin-bottom: 0.5rem; }
.lb-cat { font-size: 0.6rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--warm); margin-bottom: 0.3rem; }
.lb-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; }
.lb-thumbs { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
.lb-thumb { width: 50px; height: 50px; object-fit: cover; border: 1px solid rgba(200,169,126,0.15); opacity: 0.4; cursor: none; transition: opacity 0.3s, border-color 0.3s; }
.lb-thumb.active, .lb-thumb:hover { opacity: 1; border-color: var(--warm); }

/* ── Scroll Reveal ── */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal:nth-child(2) { transition-delay: 0.1s; }
.reveal:nth-child(3) { transition-delay: 0.18s; }
.reveal:nth-child(4) { transition-delay: 0.26s; }
.reveal:nth-child(5) { transition-delay: 0.34s; }

/* ── Responsive ── */
@media (max-width: 860px) {
  nav { padding: 1.2rem 2rem; }
  .nav-links { display: none; }
  .hero-content { padding: 0 1.5rem 4rem; }
  .hero-side-text { display: none; }
  .filter-wrap { padding: 0 1rem; overflow-x: auto; }
  .filter-tab { padding: 1rem; font-size: 0.6rem; }
  .featured-row { grid-template-columns: 1fr; }
  .featured-item:first-child { aspect-ratio: 4/5; }
  .photo-grid { grid-template-columns: 1fr 1fr; }
  .grid-item:nth-child(1) { grid-column: span 2; aspect-ratio: 16/10; }
  .grid-item:nth-child(2) { grid-row: span 1; aspect-ratio: 1; }
  .cta-strip { flex-direction: column; padding: 3rem 1.5rem; text-align: center; }
  .lb-thumbs { display: none; }
  .lb-inner { padding: 4rem 1rem; }
}
</style>
