<template>
  <AppCursor v-model="isHovering" :auto-hover="false" />
  <AppNav variant="public" active-page="" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />

  <div class="delivery-layout">

    <!-- Loading state -->
    <div v-if="loading" class="delivery-center">
      <div class="delivery-spinner"></div>
      <p class="delivery-loading-text">Loading your gallery…</p>
    </div>

    <!-- Password gate -->
    <div v-else-if="needsPassword" class="delivery-center">
      <div class="delivery-lock-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <h2 class="delivery-error-title">Protected Gallery</h2>
      <p class="delivery-error-sub">This gallery is password protected. Enter the password to view your photos.</p>
      <div class="delivery-pw-form">
        <input
          v-model="enteredPassword"
          type="password"
          class="delivery-pw-input"
          placeholder="Enter password"
          @keyup.enter="submitPassword"
          autofocus
        />
        <button class="delivery-pw-btn" @click="submitPassword" :disabled="!enteredPassword">
          View Gallery
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        </button>
        <p v-if="passwordError" class="delivery-pw-error">Incorrect password. Please try again.</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="delivery-center">
      <div class="delivery-error-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <h2 class="delivery-error-title">Gallery Not Found</h2>
      <p class="delivery-error-sub">This delivery link may have expired or the gallery hasn't been uploaded yet.</p>
      <RouterLink to="/" class="delivery-home-btn"
        @mouseenter="isHovering=true" @mouseleave="isHovering=false">
        ← Back to JayxCreatez
      </RouterLink>
    </div>

    <!-- Gallery content -->
    <div v-else class="delivery-content">
      <div class="delivery-header">
        <div class="delivery-eyebrow">Your Gallery</div>
        <h1 class="delivery-title">{{ clientName }}</h1>
        <p class="delivery-sub">{{ packageName }} · {{ files.length }} file{{ files.length !== 1 ? 's' : '' }}</p>
        <p class="delivery-note">Click any image to download. Right-click → "Save image as" for full resolution.</p>
      </div>

      <div class="delivery-grid">
        <a
          v-for="(f, i) in files"
          :key="f.key"
          :href="f.url"
          target="_blank"
          rel="noopener"
          class="delivery-card"
          @mouseenter="isHovering=true"
          @mouseleave="isHovering=false"
        >
          <img
            v-if="isImage(f.fileName)"
            :src="f.url"
            :alt="f.fileName"
            loading="lazy"
          />
          <div v-else class="delivery-file-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" stroke-width="1.3"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="delivery-card-info">
            <span class="delivery-card-name">{{ f.fileName }}</span>
            <span class="delivery-card-dl">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
              </svg>
              Download
            </span>
          </div>
        </a>
      </div>

      <div class="delivery-footer">
        <p>Photographed by <strong>JayxCreatez Productions</strong></p>
        <p class="delivery-footer-sub">For questions, reach out at <a href="mailto:jalen@jayxcreatez.com">jalen@jayxcreatez.com</a></p>
      </div>
    </div>

  </div>

  <AppFooter variant="public" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppCursor from '../components/AppCursor.vue'
import AppNav    from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import { useFonts } from '../composables/useFonts.js'
import api from '@/services/api.js'
useFonts()

const isHovering     = ref(false)
const route          = useRoute()

const loading        = ref(true)
const error          = ref(false)
const needsPassword  = ref(false)
const passwordError  = ref(false)
const enteredPassword = ref('')
const clientName     = ref('')
const packageName    = ref('')
const files          = ref([])

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'heic']

function isImage(fileName) {
  const ext = (fileName || '').split('.').pop().toLowerCase()
  return IMAGE_EXTS.includes(ext)
}

async function loadGallery(password = '') {
  const token = route.params.token
  if (!token) { error.value = true; loading.value = false; return }

  try {
    const data = await api.delivery.get(token, password)

    if (data?.passwordRequired) {
      needsPassword.value = true
      loading.value = false
      return
    }

    if (!data?.ok || !data.files?.length) {
      error.value = true
    } else {
      clientName.value  = data.client || 'Your Gallery'
      packageName.value = data.package || ''
      files.value       = data.files
      needsPassword.value = false
      passwordError.value = false
    }
  } catch (err) {
    // 401 = wrong password or password required
    if (err.status === 401) {
      if (password) {
        // Wrong password entered
        passwordError.value = true
        needsPassword.value = true
      } else {
        needsPassword.value = true
      }
    } else {
      error.value = true
    }
  } finally {
    loading.value = false
  }
}

async function submitPassword() {
  if (!enteredPassword.value) return
  loading.value = true
  passwordError.value = false
  await loadGallery(enteredPassword.value)
}

onMounted(() => loadGallery())
</script>

<style>
/* Delivery page inherits root vars from the site */
.delivery-layout {
  padding-top: 100px;
  min-height: 100vh;
  background: var(--black, #0a0a0a);
}

.delivery-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 4rem 2rem;
}

.delivery-spinner {
  width: 36px; height: 36px;
  border: 2px solid rgba(200,169,126,0.15);
  border-top-color: #c8a97e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.delivery-loading-text {
  margin-top: 1.5rem;
  font-size: 0.82rem;
  color: rgba(245,240,235,0.4);
  letter-spacing: 0.08em;
}

.delivery-lock-icon { color: rgba(200,169,126,0.6); margin-bottom: 1.5rem; }
.delivery-pw-form {
  display: flex; flex-direction: column; align-items: center;
  gap: 0.75rem; margin-top: 1.5rem; width: 100%; max-width: 320px;
}
.delivery-pw-input {
  width: 100%; padding: 0.85rem 1rem;
  background: rgba(245,240,235,0.04);
  border: 1px solid rgba(200,169,126,0.25);
  color: #f5f0eb; font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem; outline: none; text-align: center;
  letter-spacing: 0.1em; transition: border-color 0.2s;
  box-sizing: border-box;
}
.delivery-pw-input:focus { border-color: #c8a97e; }
.delivery-pw-input::placeholder { color: rgba(245,240,235,0.2); letter-spacing: 0.05em; }
.delivery-pw-btn {
  display: inline-flex; align-items: center; gap: 0.6rem;
  background: #c8a97e; color: #0a0a0a;
  font-family: 'DM Sans', sans-serif; font-size: 0.72rem;
  font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
  padding: 0.85rem 2rem; border: none; cursor: pointer;
  transition: background 0.2s; width: 100%; justify-content: center;
}
.delivery-pw-btn:hover:not(:disabled) { background: #dbbf94; }
.delivery-pw-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.delivery-pw-error { font-size: 0.75rem; color: #e07e7e; margin-top: 0.2rem; }

.delivery-error-icon { color: rgba(200,169,126,0.5); margin-bottom: 1.5rem; }
.delivery-error-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem; font-weight: 300;
  color: #f5f0eb; margin-bottom: 0.5rem;
}
.delivery-error-sub {
  font-size: 0.85rem; color: rgba(245,240,235,0.4);
  max-width: 360px; line-height: 1.7; margin-bottom: 2rem;
}
.delivery-home-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  border: 1px solid rgba(200,169,126,0.3); color: rgba(245,240,235,0.6);
  font-family: 'DM Sans', sans-serif; font-size: 0.72rem;
  letter-spacing: 0.15em; text-transform: uppercase;
  padding: 0.7rem 1.4rem; text-decoration: none;
  transition: border-color 0.3s, color 0.3s; cursor: none;
}
.delivery-home-btn:hover { border-color: #c8a97e; color: #c8a97e; }

/* ── Content ── */
.delivery-content { max-width: 1100px; margin: 0 auto; padding: 3rem 4rem 6rem; }

.delivery-header { margin-bottom: 3rem; }
.delivery-eyebrow {
  font-size: 0.62rem; letter-spacing: 0.35em; text-transform: uppercase;
  color: #c8a97e; margin-bottom: 0.5rem;
}
.delivery-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 5vw, 3.5rem); font-weight: 300;
  color: #f5f0eb; line-height: 1.1; margin-bottom: 0.5rem;
}
.delivery-sub {
  font-size: 0.82rem; color: rgba(245,240,235,0.4);
  letter-spacing: 0.06em; margin-bottom: 0.5rem;
}
.delivery-note {
  font-size: 0.72rem; color: rgba(245,240,235,0.25);
  font-style: italic;
}

/* ── Grid ── */
.delivery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.delivery-card {
  display: block; text-decoration: none;
  background: rgba(245,240,235,0.03);
  border: 1px solid rgba(200,169,126,0.12);
  overflow: hidden;
  transition: border-color 0.3s, transform 0.2s, box-shadow 0.3s;
  cursor: none;
}
.delivery-card:hover {
  border-color: rgba(200,169,126,0.4);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}
.delivery-card img {
  width: 100%; aspect-ratio: 4/3; object-fit: cover;
  display: block; filter: brightness(0.92);
  transition: filter 0.3s;
}
.delivery-card:hover img { filter: brightness(1); }

.delivery-file-icon {
  width: 100%; aspect-ratio: 4/3;
  display: flex; align-items: center; justify-content: center;
  color: rgba(200,169,126,0.4); background: rgba(200,169,126,0.04);
}

.delivery-card-info {
  padding: 0.8rem 1rem;
  display: flex; align-items: center; justify-content: space-between;
}
.delivery-card-name {
  font-size: 0.72rem; color: rgba(245,240,235,0.6);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  flex: 1; min-width: 0;
}
.delivery-card-dl {
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: #c8a97e; flex-shrink: 0; margin-left: 0.8rem;
}

/* ── Footer ── */
.delivery-footer {
  margin-top: 4rem; padding-top: 2rem;
  border-top: 1px solid rgba(200,169,126,0.12);
  text-align: center;
}
.delivery-footer p {
  font-size: 0.82rem; color: rgba(245,240,235,0.4); margin-bottom: 0.3rem;
}
.delivery-footer strong { color: #c8a97e; }
.delivery-footer-sub { font-size: 0.72rem; }
.delivery-footer-sub a { color: rgba(200,169,126,0.7); text-decoration: none; }
.delivery-footer-sub a:hover { color: #c8a97e; }

@media (max-width: 700px) {
  .delivery-content { padding: 2rem 1.5rem 5rem; }
  .delivery-grid { grid-template-columns: 1fr 1fr; gap: 0.6rem; }
}
@media (max-width: 420px) {
  .delivery-grid { grid-template-columns: 1fr; }
}
</style>
