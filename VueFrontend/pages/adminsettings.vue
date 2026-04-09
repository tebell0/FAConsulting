<template>

  <!-- Cursor -->
  <AppCursor v-model="isHovering" :auto-hover="false" />

  <!-- Nav -->
  <AppNav variant="admin" active-page="settings" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />

  <div class="settings-layout">

    <!-- Page Header -->
    <div class="settings-header">
      <p class="section-label" style="margin-bottom:0.4rem;">Admin</p>
      <h1 class="settings-page-title">Settings</h1>
      <p class="settings-page-sub">Manage your account credentials and preferences.</p>
    </div>

    <div class="settings-body">

      <!-- ── Email Address ─────────────────────────── -->
      <div class="settings-card">
        <h2 class="settings-card-title">Email Address</h2>
        <p class="settings-card-desc">This is the address used for client communication and booking notifications.</p>

        <div class="settings-form-row">
          <label class="settings-label" for="newEmail">New Email Address</label>
          <input
            class="settings-input"
            type="email"
            id="newEmail"
            v-model="newEmail"
            placeholder="you@example.com"
            autocomplete="email"
            @mouseenter="isHovering=true" @mouseleave="isHovering=false"
          />
          <p class="settings-current">
            Current: <span>{{ adminEmail }}</span>
          </p>
        </div>

        <div class="settings-form-row">
          <label class="settings-label" for="confirmEmail">Confirm New Email</label>
          <input
            class="settings-input"
            type="email"
            id="confirmEmail"
            v-model="confirmEmail"
            placeholder="Repeat new email"
            autocomplete="email"
            @mouseenter="isHovering=true" @mouseleave="isHovering=false"
          />
        </div>

        <div class="settings-action-row">
          <button class="settings-btn" @click="saveEmail" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Save Email</button>
          <button class="settings-btn-ghost" @click="clearEmailForm" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Cancel</button>
          <span class="settings-feedback" :class="emailFeedback.type">{{ emailFeedback.msg }}</span>
        </div>
      </div>

      <!-- ── Password ──────────────────────────────── -->
      <div class="settings-card">
        <h2 class="settings-card-title">Admin Password</h2>
        <p class="settings-card-desc">Choose a strong password. You'll need it every time you access the admin portal.</p>

        <div class="settings-form-row">
          <label class="settings-label" for="currentPass">Current Password</label>
          <input
            class="settings-input"
            type="password"
            id="currentPass"
            v-model="currentPass"
            placeholder="Enter current password"
            autocomplete="current-password"
            @mouseenter="isHovering=true" @mouseleave="isHovering=false"
          />
        </div>

        <hr class="settings-divider" />

        <div class="settings-form-row">
          <label class="settings-label" for="newPass">New Password</label>
          <input
            class="settings-input"
            type="password"
            id="newPass"
            v-model="newPass"
            placeholder="Min. 8 characters"
            autocomplete="new-password"
            @mouseenter="isHovering=true" @mouseleave="isHovering=false"
          />
          <div class="pw-strength-wrap">
            <div class="pw-strength-bar">
              <div class="pw-strength-fill" :style="{ width: pwStrength.pct, background: pwStrength.color }"></div>
            </div>
            <span class="pw-strength-label" :style="{ color: pwStrength.labelColor }">{{ pwStrength.label }}</span>
          </div>
        </div>

        <div class="settings-form-row">
          <label class="settings-label" for="confirmPass">Confirm New Password</label>
          <input
            class="settings-input"
            type="password"
            id="confirmPass"
            v-model="confirmPass"
            placeholder="Repeat new password"
            autocomplete="new-password"
            @mouseenter="isHovering=true" @mouseleave="isHovering=false"
          />
        </div>

        <div class="settings-action-row">
          <button class="settings-btn" @click="savePassword" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Update Password</button>
          <button class="settings-btn-ghost" @click="clearPasswordForm" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Cancel</button>
          <span class="settings-feedback" :class="passwordFeedback.type">{{ passwordFeedback.msg }}</span>
        </div>
      </div>

      <!-- ── Services Manager ──────────────────────── -->
      <div class="settings-card">
        <h2 class="settings-card-title">Services</h2>
        <p class="settings-card-desc">Add, edit, or remove session packages. Changes reflect immediately on the booking page.</p>

        <!-- Live service list -->
        <div class="svc-list">
          <p v-if="!services.length" class="svc-empty">No services yet. Add one below.</p>
          <div v-for="(s, i) in services" :key="s.id" class="svc-row">
            <div class="svc-row-left">
              <span class="svc-row-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <div class="svc-row-info">
                <div class="svc-row-name">{{ s.name }}</div>
                <div class="svc-row-meta">{{ s.duration }} &nbsp;·&nbsp; from ${{ Number(s.price).toLocaleString() }}</div>
                <div v-if="s.desc" class="svc-row-desc">{{ s.desc }}</div>
              </div>
            </div>
            <div class="svc-row-actions">
              <button class="svc-action-btn svc-edit-btn" @click="startEditSvc(s.id)" title="Edit"
                @mouseenter="isHovering=true" @mouseleave="isHovering=false">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Edit
              </button>
              <button class="svc-action-btn svc-delete-btn" @click="deleteSvc(s.id)" title="Remove"
                @mouseenter="isHovering=true" @mouseleave="isHovering=false">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Add / Edit form -->
        <div class="svc-form">
          <div class="svc-form-title">{{ svcFormTitle }}</div>

          <div class="svc-form-grid">
            <div class="settings-form-row">
              <label class="settings-label" for="svcName">Package Name</label>
              <input class="settings-input" type="text" id="svcName" v-model="svcForm.name"
                     placeholder="e.g. The Signature"
                     @mouseenter="isHovering=true" @mouseleave="isHovering=false" />
            </div>
            <div class="settings-form-row">
              <label class="settings-label" for="svcDuration">Duration</label>
              <input class="settings-input" type="text" id="svcDuration" v-model="svcForm.duration"
                     placeholder="e.g. 1 hr"
                     @mouseenter="isHovering=true" @mouseleave="isHovering=false" />
            </div>
            <div class="settings-form-row">
              <label class="settings-label" for="svcPrice">Starting Price ($)</label>
              <div class="pricing-input-wrap" style="width:100%;">
                <span class="pricing-dollar">$</span>
                <input class="settings-input pricing-input" type="number" id="svcPrice"
                       v-model.number="svcForm.price"
                       min="1" step="1" placeholder="345" style="width:100%;text-align:left;"
                       @mouseenter="isHovering=true" @mouseleave="isHovering=false" />
              </div>
            </div>
            <div class="settings-form-row" style="grid-column:1/-1;">
              <label class="settings-label" for="svcDesc">Description</label>
              <textarea class="settings-input svc-textarea" id="svcDesc" v-model="svcForm.desc"
                        placeholder="A short description shown on the booking and home pages."
                        @mouseenter="isHovering=true" @mouseleave="isHovering=false"></textarea>
            </div>
          </div>

          <div class="settings-action-row">
            <button class="settings-btn" @click="saveSvc" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
              {{ svcSaveBtnLabel }}
            </button>
            <button class="settings-btn-ghost" @click="cancelSvcEdit" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Cancel</button>
            <span class="settings-feedback" :class="svcFeedback.type">{{ svcFeedback.msg }}</span>
          </div>
        </div>
      </div>

      <!-- ── Sign Out ───────────────────────────────── -->
      <div class="settings-signout-row">
        <button class="settings-signout-btn" @click="signOut" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>

    </div><!-- /.settings-body -->
  </div><!-- /.settings-layout -->

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppCursor from '../components/AppCursor.vue'
import AppNav    from '../components/AppNav.vue'
import { useFonts } from '../composables/useFonts.js'
import api from '@/services/api.js'
useFonts()

// ── Cursor state ──────────────────────────────────────────
const isHovering = ref(false)
const router = useRouter()

// ── Credentials ───────────────────────────────────────────
const adminPass  = ref(localStorage.getItem('adminPass')  || 'password')
const adminEmail = ref(localStorage.getItem('adminEmail') || 'jalen@jayxcreatez.com')

// ── Email form ────────────────────────────────────────────
const newEmail     = ref('')
const confirmEmail = ref('')
const emailFeedback = reactive({ msg: '', type: '' })
let emailFeedbackTimer = null

function showFeedback(target, msg, type) {
  target.msg  = msg
  target.type = type
  clearTimeout(target._timer)
  target._timer = setTimeout(() => { target.msg = ''; target.type = '' }, 4000)
}

function saveEmail() {
  const next = newEmail.value.trim()
  const conf = confirmEmail.value.trim()
  if (!next) { showFeedback(emailFeedback, 'Please enter a new email address.', 'error'); return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) { showFeedback(emailFeedback, "That doesn't look like a valid email.", 'error'); return }
  if (next !== conf) { showFeedback(emailFeedback, 'Emails do not match.', 'error'); return }
  if (next === adminEmail.value) { showFeedback(emailFeedback, "That's already your current email.", 'error'); return }
  adminEmail.value = next
  localStorage.setItem('adminEmail', adminEmail.value)
  clearEmailForm()
  showFeedback(emailFeedback, '✓ Email updated successfully.', 'success')
}

function clearEmailForm() {
  newEmail.value     = ''
  confirmEmail.value = ''
}

// ── Password form ─────────────────────────────────────────
const currentPass    = ref('')
const newPass        = ref('')
const confirmPass    = ref('')
const passwordFeedback = reactive({ msg: '', type: '' })

const PW_LEVELS = [
  { label: '—',          color: 'rgba(255,255,255,0.15)', pct: '0%'   },
  { label: 'Weak',       color: '#e07e7e',                pct: '25%'  },
  { label: 'Fair',       color: '#e0c07e',                pct: '50%'  },
  { label: 'Good',       color: '#c8a97e',                pct: '75%'  },
  { label: 'Strong',     color: '#7ec89e',                pct: '90%'  },
  { label: 'Very Strong', color: '#7ec89e',               pct: '100%' },
]

const pwStrength = computed(() => {
  const pw = newPass.value
  if (!pw.length) return { ...PW_LEVELS[0], labelColor: 'rgba(255,255,255,0.35)' }
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw))  score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const lvl = PW_LEVELS[Math.min(score, 5)]
  return { ...lvl, labelColor: lvl.color }
})

function savePassword() {
  const cur  = currentPass.value
  const next = newPass.value
  const conf = confirmPass.value
  if (!cur)  { showFeedback(passwordFeedback, 'Enter your current password.', 'error'); return }
  if (cur !== adminPass.value) {
    showFeedback(passwordFeedback, 'Current password is incorrect.', 'error')
    currentPass.value = ''
    return
  }
  if (next.length < 8) { showFeedback(passwordFeedback, 'New password must be at least 8 characters.', 'error'); return }
  if (next !== conf)   { showFeedback(passwordFeedback, 'New passwords do not match.', 'error'); return }
  if (next === adminPass.value) { showFeedback(passwordFeedback, 'New password must differ from current.', 'error'); return }
  adminPass.value = next
  localStorage.setItem('adminPass', adminPass.value)
  clearPasswordForm()
  showFeedback(passwordFeedback, '✓ Password updated successfully.', 'success')
}

function clearPasswordForm() {
  currentPass.value = ''
  newPass.value     = ''
  confirmPass.value = ''
}

// ── Services Manager ──────────────────────────────────────
const SVC_DEFAULTS = [
  { id: 'svc-1', name: 'The Essentials', duration: '30 min', price: 295, desc: 'A focused 30-minute session delivering clean, editorial portraits with a curated selection of final images.' },
  { id: 'svc-2', name: 'The Signature',  duration: '1 hr',   price: 345, desc: 'An immersive 1-hour session with multiple looks, locations, and an expanded gallery of polished deliverables.' },
  { id: 'svc-3', name: 'The Elite',      duration: '2 hr',   price: 427, desc: 'A full 2-hour creative session — wardrobe styling consultation, premium retouching, and an extensive final gallery.' },
  { id: 'svc-4', name: 'The Wedding',    duration: '5 hr',   price: 1500, desc: 'Full-day wedding coverage from preparation to reception, beautifully documented and delivered.' },
]

function loadServices() {
  try {
    const raw = localStorage.getItem('services')
    return raw ? JSON.parse(raw) : SVC_DEFAULTS.map(s => ({ ...s }))
  } catch { return SVC_DEFAULTS.map(s => ({ ...s })) }
}
function persistServices(arr) { localStorage.setItem('services', JSON.stringify(arr)) }

const services = ref(loadServices())

const svcForm = reactive({ name: '', duration: '', price: '', desc: '' })
const svcEditId = ref('')
const svcFeedback = reactive({ msg: '', type: '' })

const svcFormTitle    = computed(() => svcEditId.value ? 'Edit Service'   : 'Add New Service')
const svcSaveBtnLabel = computed(() => svcEditId.value ? 'Save Changes'   : 'Add Service')

function saveSvc() {
  const { name, duration, price, desc } = svcForm
  if (!name.trim())        { showFeedback(svcFeedback, 'Package name is required.', 'error'); return }
  if (!duration.trim())    { showFeedback(svcFeedback, 'Duration is required.', 'error'); return }
  if (!price || price < 1) { showFeedback(svcFeedback, 'Enter a valid price.', 'error'); return }

  if (svcEditId.value) {
    const svc = services.value.find(s => s.id === svcEditId.value)
    if (svc) { svc.name = name.trim(); svc.duration = duration.trim(); svc.price = price; svc.desc = desc.trim() }
    showFeedback(svcFeedback, '✓ Service updated.', 'success')
  } else {
    services.value.push({ id: 'svc-' + Date.now(), name: name.trim(), duration: duration.trim(), price, desc: desc.trim() })
    showFeedback(svcFeedback, '✓ Service added.', 'success')
  }

  // Sync price-{key} so calendar page stays in sync
  const priceKey = name.trim().replace(/^The\s+/i, '').toLowerCase()
  localStorage.setItem('price-' + priceKey, price)

  persistServices(services.value)
  cancelSvcEdit()
}

function startEditSvc(id) {
  const svc = services.value.find(s => s.id === id)
  if (!svc) return
  svcEditId.value  = svc.id
  svcForm.name     = svc.name
  svcForm.duration = svc.duration
  svcForm.price    = svc.price
  svcForm.desc     = svc.desc || ''
}

function cancelSvcEdit() {
  svcEditId.value  = ''
  svcForm.name     = ''
  svcForm.duration = ''
  svcForm.price    = ''
  svcForm.desc     = ''
}

function deleteSvc(id) {
  if (!confirm('Remove this service? This cannot be undone.')) return
  services.value = services.value.filter(s => s.id !== id)
  persistServices(services.value)
  showFeedback(svcFeedback, '✓ Service removed.', 'success')
}

// ── Sign Out ──────────────────────────────────────────────
function signOut() {
  sessionStorage.removeItem('adminAuth')
  router.push('/adminsignin')
}

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => {
  if (sessionStorage.getItem('adminAuth') !== '1') {
    router.push('/adminsignin')
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
body { background: var(--black); color: var(--off-white); font-family: 'DM Sans', sans-serif; overflow-x: hidden; cursor: none; }

/* ── Shared ── */
.section-label { font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--warm); margin-bottom: 0.4rem; }

/* ── Settings Layout ── */
.settings-layout { padding-top: 100px; min-height: 100vh; }
.settings-header { padding: 3rem 4rem 2.5rem; border-bottom: 1px solid var(--glass-border); }
.settings-page-title { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 300; color: var(--off-white); line-height: 1.1; margin: 0 0 0.3rem; }
.settings-page-sub { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: rgba(255,255,255,0.4); letter-spacing: 0.04em; }
.settings-body { max-width: 860px; margin: 0 auto; padding: 3.5rem 4rem 6rem; display: flex; flex-direction: column; gap: 2.5rem; }

/* ── Settings Card ── */
.settings-card { background: var(--glass); border: 1px solid var(--glass-border); padding: 2.4rem 2.8rem; position: relative; }
.settings-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, var(--warm), transparent 60%); }
.settings-card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 400; color: var(--warm); margin: 0 0 0.3rem; }
.settings-card-desc { font-family: 'DM Sans', sans-serif; font-size: 0.83rem; color: rgba(255,255,255,0.4); letter-spacing: 0.03em; margin: 0 0 2rem; }
.settings-divider { border: none; border-top: 1px solid var(--glass-border); margin: 1.8rem 0; }

/* ── Form elements ── */
.settings-form-row { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.4rem; }
.settings-form-row:last-of-type { margin-bottom: 0; }
.settings-label { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
.settings-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); color: var(--off-white); font-family: 'DM Sans', sans-serif; font-size: 0.95rem; padding: 0.75rem 1rem; width: 100%; box-sizing: border-box; outline: none; transition: border-color 0.25s, background 0.25s; cursor: none; }
.settings-input:focus { border-color: rgba(200,169,126,0.5); background: rgba(200,169,126,0.04); }
.settings-input::placeholder { color: rgba(255,255,255,0.2); }
.settings-current { font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: rgba(255,255,255,0.3); margin-top: 0.3rem; }
.settings-current span { color: rgba(200,169,126,0.7); font-style: italic; }

/* ── Actions ── */
.settings-action-row { display: flex; align-items: center; gap: 1.2rem; margin-top: 1.8rem; flex-wrap: wrap; }
.settings-btn { background: var(--warm); color: var(--black); font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 2rem; border: none; cursor: none; transition: background 0.25s, transform 0.2s, box-shadow 0.25s; white-space: nowrap; }
.settings-btn:hover { background: #dbbf94; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(200,169,126,0.3); }
.settings-btn:active { transform: translateY(0); }
.settings-btn-ghost { background: transparent; border: 1px solid rgba(200,169,126,0.35); color: var(--warm); font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.73rem 1.6rem; cursor: none; transition: border-color 0.25s, background 0.25s; }
.settings-btn-ghost:hover { border-color: var(--warm); background: rgba(200,169,126,0.06); }

/* ── Feedback ── */
.settings-feedback { font-family: 'DM Sans', sans-serif; font-size: 0.85rem; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
.settings-feedback.success { color: var(--success); opacity: 1; }
.settings-feedback.error   { color: #e07e7e; opacity: 1; }

/* ── Password Strength ── */
.pw-strength-wrap { margin-top: 0.6rem; display: flex; align-items: center; gap: 0.8rem; }
.pw-strength-bar { flex: 1; height: 3px; background: rgba(255,255,255,0.08); position: relative; overflow: hidden; }
.pw-strength-fill { height: 100%; width: 0%; transition: width 0.3s, background 0.3s; }
.pw-strength-label { font-family: 'DM Sans', sans-serif; font-size: 0.75rem; color: rgba(255,255,255,0.35); min-width: 52px; transition: color 0.3s; }

/* ── Sign Out ── */
.settings-signout-row { display: flex; justify-content: flex-end; padding-top: 0.5rem; }
.settings-signout-btn { background: transparent; border: 1px solid rgba(224,126,126,0.35); color: #e07e7e; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.65rem 1.6rem; cursor: none; transition: border-color 0.25s, background 0.25s; display: flex; align-items: center; gap: 0.5rem; }
.settings-signout-btn:hover { border-color: #e07e7e; background: rgba(224,126,126,0.06); }

/* ── Pricing input (used in services form) ── */
.pricing-input-wrap { display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); transition: border-color 0.25s, background 0.25s; flex-shrink: 0; }
.pricing-input-wrap:focus-within { border-color: rgba(200,169,126,0.5); background: rgba(200,169,126,0.04); }
.pricing-dollar { font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: rgba(200,169,126,0.6); padding: 0 0 0 0.85rem; pointer-events: none; user-select: none; }
.pricing-input { border: none !important; background: transparent !important; width: 90px; padding: 0.65rem 0.8rem 0.65rem 0.4rem !important; font-size: 0.95rem; text-align: right; -moz-appearance: textfield; appearance: textfield; }
.pricing-input::-webkit-outer-spin-button, .pricing-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.pricing-input:focus { border: none !important; background: transparent !important; }

/* ── Services Manager ── */
.svc-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 2rem; }
.svc-empty { font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.25); font-style: italic; padding: 1rem 0; }
.svc-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; padding: 1.2rem 0; border-bottom: 1px solid var(--glass-border); }
.svc-row:last-child { border-bottom: none; }
.svc-row-left { display: flex; align-items: flex-start; gap: 1.1rem; flex: 1; min-width: 0; }
.svc-row-num { font-family: 'Cormorant Garamond', serif; font-size: 0.85rem; color: rgba(200,169,126,0.45); letter-spacing: 0.05em; flex-shrink: 0; width: 1.6rem; padding-top: 0.1rem; }
.svc-row-info { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
.svc-row-name { font-family: 'DM Sans', sans-serif; font-size: 0.92rem; font-weight: 500; color: var(--off-white); }
.svc-row-meta { font-family: 'DM Sans', sans-serif; font-size: 0.76rem; color: rgba(200,169,126,0.55); letter-spacing: 0.03em; }
.svc-row-desc { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: rgba(255,255,255,0.3); line-height: 1.5; margin-top: 0.3rem; }
.svc-row-actions { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
.svc-action-btn { display: flex; align-items: center; gap: 0.35rem; font-family: 'DM Sans', sans-serif; font-size: 0.73rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.4rem 0.9rem; border: 1px solid transparent; background: transparent; cursor: none; transition: border-color 0.2s, background 0.2s, color 0.2s; }
.svc-edit-btn { color: rgba(200,169,126,0.7); border-color: rgba(200,169,126,0.25); }
.svc-edit-btn:hover { color: var(--warm); border-color: var(--warm); background: rgba(200,169,126,0.06); }
.svc-delete-btn { color: rgba(224,126,126,0.6); border-color: rgba(224,126,126,0.2); }
.svc-delete-btn:hover { color: #e07e7e; border-color: #e07e7e; background: rgba(224,126,126,0.06); }

/* ── Service form ── */
.svc-form { border-top: 1px solid var(--glass-border); padding-top: 2rem; margin-top: 0.5rem; }
.svc-form-title { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 400; color: var(--off-white); margin-bottom: 1.6rem; letter-spacing: 0.02em; }
.svc-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 2rem; }
.svc-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }

/* ── Responsive ── */
@media (max-width: 900px) {
  nav { padding: 1.2rem 2rem; }
  .nav-links { display: none; }
  .settings-header { padding: 2.5rem 2rem 2rem; }
  .settings-body   { padding: 2.5rem 2rem 5rem; }
  .settings-card   { padding: 2rem 1.5rem; }
  .settings-page-title { font-size: 2.2rem; }
}
@media (max-width: 640px) {
  .svc-form-grid { grid-template-columns: 1fr; gap: 0; }
  .svc-row { flex-direction: column; gap: 0.8rem; }
  .svc-row-actions { width: 100%; justify-content: flex-end; }
  .pricing-input-wrap { width: 100%; }
  .pricing-input { width: 100%; }
}
</style>
