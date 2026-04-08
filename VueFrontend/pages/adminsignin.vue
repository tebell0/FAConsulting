<template>

  <!-- Cursor -->
  <AppCursor v-model="isHovering" :auto-hover="false" />

  <div class="signin-page">
    <div class="signin-card" ref="cardEl" :class="{ shake: isShaking }">

      <a href="/" class="signin-logo" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
        Jayx<span>Createz</span>
      </a>
      <div class="signin-eyebrow">Admin Portal</div>

      <h1 class="signin-title">Welcome back,<br /><em>Jalen.</em></h1>
      <p class="signin-sub">Sign in to access the admin dashboard.</p>

      <div class="signin-error" :class="{ visible: showError }">
        Incorrect username or password. Please try again.
      </div>

      <form novalidate @submit.prevent="handleSignIn">
        <div class="signin-field">
          <label class="signin-label" for="username">Username</label>
          <input
            id="username"
            class="signin-input"
            type="text"
            name="username"
            autocomplete="username"
            placeholder="Enter your username"
            v-model.trim="username"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
          />
        </div>
        <div class="signin-field">
          <label class="signin-label" for="password">Password</label>
          <input
            id="password"
            class="signin-input"
            type="password"
            name="password"
            autocomplete="current-password"
            placeholder="••••••••"
            v-model="password"
            ref="passwordEl"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
          />
        </div>

        <button
          class="signin-btn"
          type="submit"
          @mouseenter="isHovering = true"
          @mouseleave="isHovering = false"
        >
          {{ btnLabel }}
          <svg v-if="!signingIn" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </form>

      <a href="/" class="signin-back" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
        ← Back to site
      </a>

    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppCursor from '../components/AppCursor.vue'
import { useFonts } from '../composables/useFonts.js'
useFonts()

// ── Cursor state ──────────────────────────────────────────
const isHovering = ref(false)
const router = useRouter()

// ── Auth state ────────────────────────────────────────────
const ADMIN_USER = 'JayxCreatez'

const username   = ref('')
const password   = ref('')
const showError  = ref(false)
const isShaking  = ref(false)
const signingIn  = ref(false)
const btnLabel   = ref('Sign In')
const cardEl     = ref(null)
const passwordEl = ref(null)

function handleSignIn() {
  const adminPass = localStorage.getItem('adminPass') || 'password'

  if (username.value === ADMIN_USER && password.value === adminPass) {
    // ── Success ──
    showError.value = false
    signingIn.value = true
    btnLabel.value  = 'Signing in…'
    sessionStorage.setItem('adminAuth', '1')
    setTimeout(() => { router.push('/admindash') }, 600)
  } else {
    // ── Failure ──
    showError.value = true
    password.value  = ''

    // Restart shake animation via reflow trick
    isShaking.value = false
    // Use nextTick-equivalent: force reflow then re-add class
    requestAnimationFrame(() => {
      void cardEl.value?.offsetWidth
      isShaking.value = true
      // Remove class after animation completes so it can re-trigger next time
      setTimeout(() => { isShaking.value = false }, 450)
    })

    passwordEl.value?.focus()
  }
}

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => {
  // Already signed in — go straight to dashboard
  if (sessionStorage.getItem('adminAuth') === '1') {
    router.push('/admindash')
    return
  }
})

onBeforeUnmount(() => {
  // nothing to tear down
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

/* ── Page ── */
.signin-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}
.signin-page::before {
  content: '';
  position: fixed;
  top: -20%; left: 50%;
  transform: translateX(-50%);
  width: 700px; height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,169,126,0.06) 0%, transparent 65%);
  pointer-events: none;
}

/* ── Card ── */
.signin-card {
  width: 100%;
  max-width: 420px;
  background: var(--glass);
  border: 1px solid rgba(200,169,126,0.18);
  padding: 3rem 3rem 2.6rem;
  position: relative;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5);
}
.signin-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--warm), transparent 70%);
}

/* ── Logo ── */
.signin-logo {
  display: block;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem; font-weight: 300;
  color: var(--off-white);
  text-decoration: none;
  letter-spacing: 0.04em;
  margin-bottom: 0.4rem;
}
.signin-logo span { color: var(--warm); }

.signin-eyebrow {
  font-size: 0.6rem; letter-spacing: 0.28em; text-transform: uppercase;
  color: rgba(245,240,235,0.3); margin-bottom: 2.4rem;
}

/* ── Headings ── */
.signin-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem; font-weight: 300;
  color: var(--off-white); line-height: 1.15;
  margin: 0 0 0.4rem;
}
.signin-title em { font-style: italic; color: var(--warm); }
.signin-sub {
  font-size: 0.75rem; color: rgba(245,240,235,0.35);
  margin-bottom: 2.4rem; line-height: 1.6;
}

/* ── Fields ── */
.signin-field {
  display: flex; flex-direction: column; gap: 0.4rem;
  margin-bottom: 1.2rem;
}
.signin-label {
  font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: rgba(245,240,235,0.35);
}
.signin-input {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--glass-border);
  color: var(--cream);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  padding: 0.85rem 1rem;
  outline: none;
  transition: border-color 0.25s;
  width: 100%;
}
.signin-input:focus { border-color: rgba(200,169,126,0.45); }
.signin-input::placeholder { color: rgba(245,240,235,0.18); }

/* ── Error ── */
.signin-error {
  display: none;
  font-size: 0.72rem;
  color: #e07b7b;
  border: 1px solid rgba(224,123,123,0.25);
  background: rgba(224,123,123,0.06);
  padding: 0.7rem 1rem;
  margin-bottom: 1.2rem;
  letter-spacing: 0.02em;
  line-height: 1.5;
}
.signin-error.visible { display: block; }

/* ── Submit button ── */
.signin-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.9rem;
  width: 100%;
  background: var(--warm); color: var(--black);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.22em; text-transform: uppercase;
  border: none; padding: 1.1rem 2rem;
  cursor: none; margin-top: 0.6rem;
  transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
  box-shadow: 0 4px 20px rgba(200,169,126,0.2);
}
.signin-btn:hover {
  background: #dbbf94;
  transform: translateY(-2px);
  box-shadow: 0 10px 36px rgba(200,169,126,0.3);
}
.signin-btn svg { transition: transform 0.25s; }
.signin-btn:hover svg { transform: translateX(3px); }

/* ── Back link ── */
.signin-back {
  display: block; text-align: center; margin-top: 1.6rem;
  font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(245,240,235,0.25); text-decoration: none;
  transition: color 0.25s;
}
.signin-back:hover { color: var(--warm); }

/* ── Shake animation ── */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-5px); }
  80%       { transform: translateX(5px); }
}
.signin-card.shake { animation: shake 0.4s ease; }
</style>
