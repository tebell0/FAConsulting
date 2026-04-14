<template>

  <!-- Cursor (auto-hover: wires all a/button elements) -->
  <AppCursor :auto-hover="true" />

  <!-- Nav -->
  <AppNav variant="public" active-page="home" />

  <!-- Hero -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-watermark">VISUALS</div>
    <div class="hero-images">
      <div class="hero-img-slot"></div>
      <div class="hero-img-slot"></div>
      <div class="hero-img-slot"></div>
      <div class="hero-img-slot"></div>
    </div>
    <div class="hero-content">
      <div class="hero-eyebrow">Houston, TX · Est. 2020</div>
      <h1 class="hero-headline">Where <em>Vision</em><br />Becomes Reality</h1>
      <p class="hero-sub">
        Premium photography experiences crafted for individuals, brands, and moments
        that deserve to be remembered forever.
      </p>
      <div class="hero-actions">
        <RouterLink to="/gallery" class="btn-primary">
          View Portfolio
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </RouterLink>
        <RouterLink to="/calendar" class="btn-secondary">
          Book a Session
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 6h14M9 1l5 5-5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
        </RouterLink>
      </div>
    </div>
    <div class="hero-scroll">
      Scroll
      <div class="scroll-line"></div>
    </div>
  </section>

  <!-- Services -->
  <section class="services-section">
    <div class="services-header fade-up">
      <div>
        <div class="section-label">What We Offer</div>
        <h2 class="section-title">Tailored <em>Experiences</em></h2>
      </div>
      <p class="services-header-right">Every session is thoughtfully designed to capture your authentic story through a lens of artistry.</p>
    </div>
    <div class="services-grid">
      <RouterLink to="/calendar" class="service-card fade-up" v-for="(service, i) in services" :key="service.key">
        <div class="service-num">{{ String(i + 1).padStart(2, '0') }}</div>
        <div class="service-name">{{ service.name }}</div>
        <p class="service-desc">{{ service.desc }}</p>
        <div class="service-price">From ${{ service.price.toLocaleString() }} · {{ service.duration }}</div>
        <div class="service-arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H1M11 1v10" stroke="rgba(200,169,126,0.7)" stroke-width="1.2" stroke-linecap="round"/></svg>
        </div>
      </RouterLink>
    </div>
  </section>

  <!-- About -->
  <div class="about-section" id="about">
    <div class="about-img-wrap fade-up">
      <div class="about-img-main"></div>
      <div class="about-img-accent"></div>
      <div class="about-tag">JayxCreatez Productions</div>
    </div>
    <div class="about-text fade-up">
      <div class="section-label">The Photographer</div>
      <h2 class="section-title">Jalen Anthony &mdash;<br /><em>Artist &amp; Storyteller</em></h2>
      <p class="about-body">
        My name is Jalen Anthony &mdash; a photographer and videographer based in Houston, Texas.
        I started shooting when I was in college at Prairie View A&amp;M University and have
        continued shooting after graduating in 2023.
      </p>
      <p class="about-body">
        I&apos;m well-rounded in shooting for events, sports, graduations, portraits, brands, and more.
        I hope to help create the vision you are looking for &mdash; if you have any questions,
        concerns, or would like to work, please don&apos;t hesitate to reach out!
      </p>
      <div class="about-stats">
        <div v-for="stat in stats" :key="stat.label">
          <div class="stat-num">{{ stat.num }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
      <a
        href="https://www.instagram.com/jayxcreatez?igsh=MXY4cHhzM2kzdzlkaA%3D%3D"
        target="_blank"
        rel="noopener"
        class="ig-link"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
        </svg>
        @jayxcreatez
      </a>
    </div>
  </div>

  <!-- Gallery Preview -->
  <section class="gallery-preview">
    <div class="gallery-preview-header fade-up">
      <div>
        <div class="section-label">Portfolio</div>
        <h2 class="section-title">Selected <em>Works</em></h2>
      </div>
      <RouterLink to="/gallery" class="btn-secondary">
        View Full Gallery
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 6h14M9 1l5 5-5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      </RouterLink>
    </div>
    <div class="gallery-masonry">
      <div class="gal-item fade-up" v-for="(img, i) in galleryImages" :key="i">
        <img :src="img.src" :alt="img.alt" :style="img.imgStyle" />
        <div class="gal-overlay">
          <div class="gal-overlay-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="var(--warm)" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="testimonials">
    <div class="testimonials-inner">
      <div class="testimonials-left fade-up">
        <div class="section-label">Client Love</div>
        <h2 class="section-title">Stories <em>Told</em><br />Well</h2>
        <p>Real words from real clients who trusted us to capture their most meaningful moments.</p>
      </div>
      <div class="testimonials-right">
        <div class="testimonial-card fade-up" v-for="(t, i) in testimonials" :key="i">
          <div class="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p class="testimonial-text">&ldquo;{{ t.text }}&rdquo;</p>
          <div class="testimonial-author">{{ t.author }}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section">
    <div class="cta-eyebrow">Ready When You Are</div>
    <h2 class="cta-title">Let&apos;s Create<br /><em>Something Beautiful</em></h2>
    <p class="cta-sub">Slots fill fast &mdash; secure your date today and let&apos;s bring your vision to life.</p>
    <div class="cta-actions">
      <RouterLink to="/calendar" class="btn-primary">
        Book Your Session
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </RouterLink>
      <RouterLink to="/gallery" class="btn-secondary">
        Browse Gallery
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 6h14M9 1l5 5-5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      </RouterLink>
    </div>
  </section>

  <!-- Footer -->
  <AppFooter variant="public" />

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppCursor from '../components/AppCursor.vue'
import AppNav    from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import { IMG }   from '../assets/index.js'
import { useFonts } from '../composables/useFonts.js'
import api from '@/services/api.js'
useFonts()

// ── Services ─────────────────────────────────────────────
const SVC_DEFAULTS = [
  { id: 'svc-1', name: 'The Essentials', duration: '30 min', price: 295, desc: 'A focused 30-minute session delivering clean, editorial portraits with a curated selection of final images.' },
  { id: 'svc-2', name: 'The Signature',  duration: '1 hr',   price: 345, desc: 'An immersive 1-hour session with multiple looks, locations, and an expanded gallery of polished deliverables.' },
  { id: 'svc-3', name: 'The Elite',      duration: '2 hr',   price: 427, desc: 'A full 2-hour creative session — wardrobe styling consultation, premium retouching, and an extensive final gallery.' },
]

const services = ref([])

// ── Stats ─────────────────────────────────────────────────
const stats = [
  { num: '200+', label: 'Sessions' },
  { num: '5★',   label: 'Rating'   },
  { num: '3+',   label: 'Years'    },
]

// ── Gallery images (sourced from assets) ─────────────────
const galleryImages = [
  { src: IMG.IMG_4047, alt: 'Golden Hour Graduation' },
  { src: IMG.IMG_4046, alt: 'Written in History'     },
  { src: IMG.IMG_4048, alt: 'City Standards'         },
  { src: IMG.IMG_4045, alt: 'The Final Chapter'      },
  { src: IMG.IMG_4049, alt: 'Suited Up'              },
  { src: IMG.IMG_4047, alt: 'Golden Hour', imgStyle: 'object-position:top' },
]

// ── Testimonials ──────────────────────────────────────────
const testimonials = [
  {
    text:   'Jalen made me feel completely at ease from the first minute. The photos came out beyond anything I imagined — editorial quality for a real person.',
    author: 'Aaliya M. · Portrait Session',
  },
  {
    text:   'Booked the Elite package for my brand shoot and the results were stunning. Delivered ahead of schedule and every single image was perfect.',
    author: 'Marcus T. · Brand Session',
  },
  {
    text:   "We hired JayxCreatez for our engagement session — can't say enough. Professional, creative, and the editing is flawless.",
    author: 'Keisha & Dre · Engagement',
  },
  {
    text:   'The booking experience was seamless and the photos are absolutely incredible. Already recommended to all my friends in Houston.',
    author: 'Brianna S. · Signature Session',
  },
]

// ── Scroll Reveal ─────────────────────────────────────────
let scrollObserver = null

// ── Lifecycle ─────────────────────────────────────────────
onMounted(async () => {
  scrollObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
    { threshold: 0.12 }
  )
  document.querySelectorAll('.fade-up').forEach(el => scrollObserver.observe(el))

  // Load services from API → hardcoded defaults
  try {
    const data = await api.services.list()
    const list = data?.services ?? data ?? []
    services.value = list.slice(0, 3).map(s => ({ ...s, desc: s.desc ?? s.description ?? '' }))
  } catch {
    // API unavailable — fall back to hardcoded defaults
    services.value = SVC_DEFAULTS.slice(0, 3)
  }
})

onBeforeUnmount(() => {
  if (scrollObserver) scrollObserver.disconnect()
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

body {
  background: var(--black);
  color: var(--off-white);
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
  cursor: none;
}

/* ── Hero ── */
.hero {
  position: relative; height: 100vh;
  display: flex; align-items: flex-end;
  padding: 0 4rem 6rem; overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 70% 80% at 65% 45%, rgba(200,169,126,0.08) 0%, transparent 65%),
    radial-gradient(ellipse 40% 50% at 30% 60%, rgba(200,169,126,0.04) 0%, transparent 60%);
}
.hero-watermark {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(8rem, 20vw, 20rem); font-weight: 300;
  color: transparent; -webkit-text-stroke: 1px rgba(200,169,126,0.07);
  white-space: nowrap; pointer-events: none; user-select: none;
}
.hero-images {
  position: absolute; top: 0; right: 0;
  width: 52%; height: 100%;
  display: grid; grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr; gap: 3px;
}
.hero-img-slot {
  background: linear-gradient(135deg, rgba(200,169,126,0.07) 0%, rgba(10,10,10,0.5) 100%);
  overflow: hidden; position: relative;
}
.hero-img-slot:nth-child(1) { grid-row: 1 / 3; }
.hero-img-slot:nth-child(3) { grid-row: 2 / 4; }
.hero-content { position: relative; z-index: 2; max-width: 520px; }
.hero-eyebrow {
  font-size: 0.68rem; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--warm); margin-bottom: 1.4rem;
  display: flex; align-items: center; gap: 1rem;
}
.hero-eyebrow::before { content: ''; width: 40px; height: 1px; background: var(--warm); }
.hero-headline {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.2rem, 6vw, 5.5rem);
  font-weight: 300; line-height: 1.08; letter-spacing: -0.01em;
  margin-bottom: 1.8rem;
}
.hero-headline em { font-style: italic; color: var(--warm); }
.hero-sub {
  font-size: 0.9rem; line-height: 1.8;
  color: rgba(245,240,235,0.55); max-width: 380px; margin-bottom: 3rem;
}
.hero-actions { display: flex; align-items: center; gap: 2rem; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 0.8rem;
  background: var(--warm); color: var(--black);
  font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
  text-decoration: none; padding: 1rem 2.2rem; font-weight: 500;
  transition: background 0.3s, transform 0.2s;
}
.btn-primary:hover { background: #dbbf94; transform: translateY(-2px); }
.btn-secondary {
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: rgba(245,240,235,0.6); text-decoration: none;
  display: flex; align-items: center; gap: 0.6rem; transition: color 0.3s;
}
.btn-secondary:hover { color: var(--off-white); }
.btn-secondary svg { transition: transform 0.3s; }
.btn-secondary:hover svg { transform: translateX(4px); }
.hero-scroll {
  position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase;
  color: rgba(245,240,235,0.35); z-index: 2;
}
.scroll-line {
  width: 1px; height: 50px;
  background: linear-gradient(to bottom, var(--warm), transparent);
  animation: scrollDrop 1.8s ease-in-out infinite;
}
@keyframes scrollDrop {
  0%   { transform: scaleY(0); transform-origin: top; }
  50%  { transform: scaleY(1); transform-origin: top; }
  51%  { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

/* ── Shared Section Styles ── */
section { padding: 7rem 4rem; }
.section-label {
  font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase;
  color: var(--warm); margin-bottom: 1rem;
}
.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 4vw, 3.8rem); font-weight: 300; line-height: 1.15;
}
.section-title em { font-style: italic; color: var(--warm); }

/* ── Services ── */
.services-section { background: linear-gradient(180deg, var(--black) 0%, #0e0d0b 100%); }
.services-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 4rem;
}
.services-header-right {
  font-size: 0.85rem; color: rgba(245,240,235,0.45);
  max-width: 260px; line-height: 1.7; text-align: right;
}
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
.service-card {
  position: relative; padding: 3rem 2.4rem;
  background: var(--glass); border: 1px solid var(--glass-border);
  overflow: hidden; transition: border-color 0.4s;
  text-decoration: none; display: block; color: inherit;
}
.service-card::before {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--warm), transparent);
  transform: scaleX(0); transform-origin: left; transition: transform 0.5s ease;
}
.service-card:hover { border-color: rgba(200,169,126,0.4); }
.service-card:hover::before { transform: scaleX(1); }
.service-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 4rem; font-weight: 300; color: rgba(200,169,126,0.12); line-height: 1;
  margin-bottom: 1.5rem;
}
.service-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.7rem; font-weight: 300; margin-bottom: 0.8rem;
}
.service-desc {
  font-size: 0.82rem; line-height: 1.75;
  color: rgba(245,240,235,0.5); margin-bottom: 2rem;
}
.service-price { font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--warm); }
.service-arrow {
  position: absolute; bottom: 2rem; right: 2rem;
  width: 36px; height: 36px; border: 1px solid var(--glass-border);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  transition: border-color 0.3s, background 0.3s, transform 0.3s;
}
.service-card:hover .service-arrow { border-color: var(--warm); background: var(--warm); transform: rotate(45deg); }
.service-card:hover .service-arrow svg path { stroke: var(--black); }

/* ── About ── */
.about-section {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 6rem; align-items: center;
  padding: 8rem 4rem; background: #0d0c0a;
}
.about-img-wrap { position: relative; aspect-ratio: 3/4; }
.about-img-main {
  width: 82%; height: 100%;
  background: linear-gradient(160deg, rgba(200,169,126,0.1) 0%, rgba(10,10,10,0.7) 100%);
  border: 1px solid var(--glass-border);
}
.about-img-accent {
  position: absolute; bottom: -2rem; right: 0;
  width: 45%; height: 45%;
  background: linear-gradient(160deg, rgba(200,169,126,0.15) 0%, rgba(10,10,10,0.5) 100%);
  border: 1px solid rgba(200,169,126,0.25);
}
.about-tag {
  position: absolute; top: 2rem; right: 1.5rem;
  background: var(--warm); color: var(--black);
  font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase;
  padding: 0.5rem 1rem; font-weight: 500;
}
.about-text { padding-right: 2rem; }
.about-text .section-title { margin-bottom: 1.8rem; }
.about-body {
  font-size: 0.88rem; line-height: 1.9;
  color: rgba(245,240,235,0.55); margin-bottom: 1.5rem;
}
.about-stats {
  display: flex; gap: 3rem;
  border-top: 1px solid var(--glass-border); padding-top: 2rem; margin-top: 1rem;
}
.stat-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.6rem; font-weight: 300; color: var(--warm); line-height: 1;
}
.stat-label {
  font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: rgba(245,240,235,0.4); margin-top: 0.3rem;
}
.ig-link {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 28px;
  font-family: 'DM Sans', sans-serif; font-size: 0.85rem; letter-spacing: 0.08em;
  color: var(--warm); text-decoration: none;
  border-bottom: 1px solid rgba(200,169,126,0.3); padding-bottom: 3px;
  transition: border-color 0.25s;
}
.ig-link:hover { border-color: rgba(200,169,126,0.8); }

/* ── Gallery Preview ── */
.gallery-preview { background: var(--black); padding: 7rem 4rem; }
.gallery-preview-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 3rem;
}
.gallery-masonry {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
}
.gal-item {
  overflow: hidden; position: relative;
  background: rgba(200,169,126,0.06);
}
.gal-item:nth-child(1) { grid-column: span 2; aspect-ratio: 16/10; }
.gal-item:nth-child(2) { aspect-ratio: 3/4; }
.gal-item:nth-child(3) { aspect-ratio: 3/4; }
.gal-item:nth-child(4) { aspect-ratio: 1; }
.gal-item:nth-child(5) { aspect-ratio: 1; }
.gal-item:nth-child(6) { grid-column: span 2; aspect-ratio: 16/9; }
.gal-item img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.7s ease, filter 0.5s ease;
  filter: brightness(0.88) saturate(0.9);
}
.gal-item:hover img { transform: scale(1.05); filter: brightness(0.98) saturate(1); }
.gal-overlay {
  position: absolute; inset: 0;
  background: rgba(10,10,10,0.55);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.4s;
}
.gal-item:hover .gal-overlay { opacity: 1; }
.gal-overlay-icon {
  width: 44px; height: 44px; border: 1px solid var(--warm); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transform: scale(0.6); transition: transform 0.4s;
}
.gal-item:hover .gal-overlay-icon { transform: scale(1); }

/* ── Testimonials ── */
.testimonials { background: #0d0c0a; padding: 7rem 4rem; }
.testimonials-inner { display: grid; grid-template-columns: 1fr 2fr; gap: 6rem; }
.testimonials-left .section-title { margin-bottom: 2rem; }
.testimonials-left p { font-size: 0.85rem; line-height: 1.8; color: rgba(245,240,235,0.45); }
.testimonials-right { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.testimonial-card {
  padding: 2.2rem; background: var(--glass);
  border: 1px solid var(--glass-border); position: relative;
}
.testimonial-card::before {
  content: '\201C'; font-family: 'Cormorant Garamond', serif;
  font-size: 5rem; color: var(--warm); opacity: 0.25;
  position: absolute; top: 0.5rem; left: 1.5rem; line-height: 1;
}
.testimonial-text {
  font-size: 0.84rem; line-height: 1.8;
  color: rgba(245,240,235,0.65); margin-bottom: 1.5rem; padding-top: 1.5rem;
}
.testimonial-author { font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--warm); }
.testimonial-stars { display: flex; gap: 3px; margin-bottom: 0.6rem; color: var(--warm); font-size: 0.7rem; }

/* ── CTA ── */
.cta-section {
  position: relative; background: var(--black); padding: 8rem 4rem;
  text-align: center; overflow: hidden;
}
.cta-section::before {
  content: ''; position: absolute;
  width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(200,169,126,0.08) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
}
.cta-eyebrow {
  font-size: 0.68rem; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--warm); margin-bottom: 1.5rem;
}
.cta-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.8rem, 5vw, 4.5rem); font-weight: 300; line-height: 1.15;
  margin-bottom: 1.5rem;
}
.cta-title em { font-style: italic; color: var(--warm); }
.cta-sub { font-size: 0.9rem; color: rgba(245,240,235,0.45); margin-bottom: 3rem; line-height: 1.8; }
.cta-actions { display: flex; justify-content: center; gap: 1.5rem; }

/* ── Fade Up ── */
.fade-up {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.fade-up.visible { opacity: 1; transform: translateY(0); }
.fade-up:nth-child(2) { transition-delay: 0.1s; }
.fade-up:nth-child(3) { transition-delay: 0.2s; }
.fade-up:nth-child(4) { transition-delay: 0.3s; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .nav-links { display: none; }
  section { padding: 5rem 2rem; }
  .hero { padding: 0 2rem 5rem; }
  .hero-images { display: none; }
  .services-grid { grid-template-columns: 1fr; }
  .about-section { grid-template-columns: 1fr; padding: 5rem 2rem; }
  .about-img-wrap { display: none; }
  .gallery-masonry { grid-template-columns: 1fr 1fr; }
  .gal-item:nth-child(1), .gal-item:nth-child(6) { grid-column: span 2; }
  .testimonials-inner { grid-template-columns: 1fr; }
  .testimonials-right { grid-template-columns: 1fr; }
  .gallery-preview { padding: 5rem 2rem; }
}
</style>
