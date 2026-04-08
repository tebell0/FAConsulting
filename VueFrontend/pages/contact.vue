<template>

  <!-- Cursor -->
  <AppCursor v-model="isHovering" :auto-hover="false" />

  <!-- Nav -->
  <AppNav variant="public" active-page="contact" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />

  <!-- Confirmation Popup -->
  <Teleport to="body">
    <div
      class="confirm-backdrop"
      :class="{ show: confirmed }"
      @click.self="confirmed = false"
    >
      <div class="confirm-modal">
        <div class="confirm-modal-bar"></div>
        <div class="confirm-modal-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4.5 4.5L16 6" stroke="var(--warm)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="confirm-modal-eyebrow">Message Sent</div>
        <h2 class="confirm-modal-title">We&apos;ll Be In Touch</h2>
        <p class="confirm-modal-body">
          Thanks, <strong>{{ confirmedName }}</strong>! Your message has been received and will appear in the admin inbox shortly.
          We&apos;ll follow up at <strong>{{ confirmedEmail }}</strong>.
        </p>
        <div class="confirm-modal-actions">
          <RouterLink to="/" class="btn-primary" style="font-size:0.75rem;" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
            Back to Home
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </RouterLink>
          <RouterLink to="/calendar" class="btn-secondary" style="font-size:0.75rem;" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
            Book a Session
            <svg width="14" height="10" viewBox="0 0 16 12" fill="none"><path d="M1 6h14M9 1l5 5-5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          </RouterLink>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Contact Section -->
  <section class="contact-section">
    <div class="contact-wrapper fade-up" ref="wrapperEl">
      <div class="contact-intro">
        <div class="section-label">Get In Touch</div>
        <h1 class="section-title">Contact <em>JayxCreatez</em></h1>
        <p>Please fill out the form below with as much detail as possible so we can better assist with your booking, questions, or updates.</p>
      </div>

      <form class="contact-form" novalidate @submit.prevent="submitForm" @reset="resetForm">
        <h3>Personal &amp; Contact Information</h3>
        <div class="form-grid">

          <div class="form-group">
            <label>First Name</label>
            <input
              v-model.trim="form.firstName"
              type="text"
              placeholder="First Name"
              :class="{ invalid: errors.firstName }"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false"
            />
            <small class="error">{{ errors.firstName }}</small>
          </div>

          <div class="form-group">
            <label>Last Name</label>
            <input
              v-model.trim="form.lastName"
              type="text"
              placeholder="Last Name"
              :class="{ invalid: errors.lastName }"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false"
            />
            <small class="error">{{ errors.lastName }}</small>
          </div>

          <div class="form-group">
            <label>Date of Birth</label>
            <input
              v-model.trim="form.dob"
              type="text"
              placeholder="MM/DD/YYYY"
              :class="{ invalid: errors.dob }"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false"
            />
            <small class="error">{{ errors.dob }}</small>
          </div>

          <div class="form-group">
            <label>Phone</label>
            <input
              v-model.trim="form.phone"
              type="text"
              placeholder="XXX-XXX-XXXX"
              :class="{ invalid: errors.phone }"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false"
            />
            <small class="error">{{ errors.phone }}</small>
          </div>

          <div class="form-group full">
            <label>Email</label>
            <input
              v-model.trim="form.email"
              type="text"
              placeholder="Email Address"
              :class="{ invalid: errors.email }"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false"
            />
            <small class="error">{{ errors.email }}</small>
          </div>
        </div>

        <h3>Inquiry Details</h3>
        <div class="form-grid">

          <div class="form-group full">
            <label>Type of Inquiry</label>
            <select
              v-model="form.inquiryType"
              :class="{ invalid: errors.inquiryType }"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false"
            >
              <option value="">Select an option</option>
              <option value="reschedule">Reschedule appointment</option>
              <option value="billing">Billing question</option>
              <option value="additional">Additional info</option>
              <option value="location">Change location</option>
              <option value="delivery">Haven&apos;t received product</option>
              <option value="other">Other</option>
            </select>
            <small class="error">{{ errors.inquiryType }}</small>
          </div>

          <div class="form-group full">
            <label>Message</label>
            <textarea
              v-model.trim="form.message"
              placeholder="Enter your message"
              :class="{ invalid: errors.message }"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false"
            ></textarea>
            <small class="error">{{ errors.message }}</small>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Submit</button>
          <button type="reset"  class="form-reset"  @mouseenter="isHovering=true" @mouseleave="isHovering=false">Reset</button>
        </div>
      </form>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section">
    <div class="cta-eyebrow">Need To Book Instead?</div>
    <h2 class="cta-title">Reserve Your<br /><em>Session Today</em></h2>
    <p class="cta-sub">Ready to move forward? Head to the booking page and lock in your date.</p>
    <div class="cta-actions">
      <RouterLink to="/calendar" class="btn-primary" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
        Book Your Session
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </RouterLink>
      <RouterLink to="/gallery" class="btn-secondary" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
        Browse Gallery
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 6h14M9 1l5 5-5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      </RouterLink>
    </div>
  </section>

  <!-- Footer -->
  <AppFooter variant="public" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />

</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import AppCursor from '../components/AppCursor.vue'
import AppNav    from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import { useFonts } from '../composables/useFonts.js'
useFonts()

// ── Cursor state ──────────────────────────────────────────
const isHovering = ref(false)

// ── Scroll Reveal ─────────────────────────────────────────
const wrapperEl = ref(null)
let scrollObserver = null

// ── Form state ────────────────────────────────────────────
const form = reactive({
  firstName:   '',
  lastName:    '',
  dob:         '',
  phone:       '',
  email:       '',
  inquiryType: '',
  message:     '',
})

const errors = reactive({
  firstName:   '',
  lastName:    '',
  dob:         '',
  phone:       '',
  email:       '',
  inquiryType: '',
  message:     '',
})

// ── Confirmation state ────────────────────────────────────
const confirmed     = ref(false)
const confirmedName  = ref('')
const confirmedEmail = ref('')

// ── Inquiry tag mapping (for admin dashboard) ─────────────
const INQUIRY_TAG_MAP = {
  reschedule: { label: 'Reschedule',     cls: 'msg-tag--reschedule' },
  billing:    { label: 'Billing',         cls: 'msg-tag--billing'    },
  additional: { label: 'Additional Info', cls: 'msg-tag--info'       },
  location:   { label: 'Location Change', cls: 'msg-tag--location'   },
  delivery:   { label: 'Delivery',        cls: 'msg-tag--delivery'   },
  other:      { label: 'Other',           cls: 'msg-tag--other'      },
}

// ── Validation ────────────────────────────────────────────
const DOB_PATTERN   = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/
const PHONE_PATTERN = /^\d{3}-\d{3}-\d{4}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clearErrors() {
  Object.keys(errors).forEach(k => { errors[k] = '' })
}

function validate() {
  clearErrors()
  let valid = true

  if (!form.firstName)                         { errors.firstName   = 'First name is required.';    valid = false }
  if (!form.lastName)                          { errors.lastName    = 'Last name is required.';     valid = false }

  if (!form.dob)                               { errors.dob         = 'DOB is required.';           valid = false }
  else if (!DOB_PATTERN.test(form.dob))        { errors.dob         = 'Use MM/DD/YYYY format.';     valid = false }

  if (!form.phone)                             { errors.phone       = 'Phone is required.';         valid = false }
  else if (!PHONE_PATTERN.test(form.phone))    { errors.phone       = 'Use XXX-XXX-XXXX.';          valid = false }

  if (!form.email)                             { errors.email       = 'Email is required.';         valid = false }
  else if (!EMAIL_PATTERN.test(form.email))    { errors.email       = 'Invalid email.';             valid = false }

  if (!form.inquiryType)                       { errors.inquiryType = 'Select an inquiry type.';    valid = false }

  if (!form.message)                           { errors.message     = 'Message is required.';       valid = false }
  else if (form.message.length < 10)           { errors.message     = 'At least 10 characters.';   valid = false }

  return valid
}

// ── Submit ────────────────────────────────────────────────
function submitForm() {
  if (!validate()) return

  const tagInfo  = INQUIRY_TAG_MAP[form.inquiryType] || INQUIRY_TAG_MAP.other
  const fullName = `${form.firstName} ${form.lastName}`
  const initials = (form.firstName[0] + form.lastName[0]).toUpperCase()
  const now      = new Date()
  const dateStr  = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr  = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const newMsg = {
    id:       'contact-' + Date.now(),
    initials,
    name:     fullName,
    tag:      tagInfo.label,
    tagClass: tagInfo.cls,
    meta:     `${tagInfo.label} &nbsp;·&nbsp; ${dateStr} &nbsp;·&nbsp; ${timeStr}`,
    body:     form.message,
    email:    form.email,
    phone:    form.phone.replace(/-/g, ''),
    dob:      form.dob,
  }

  try {
    const existing = JSON.parse(localStorage.getItem('contactMessages') || '[]')
    existing.unshift(newMsg)
    localStorage.setItem('contactMessages', JSON.stringify(existing))
  } catch { /* fail silently */ }

  // Show confirmation popup
  confirmedName.value  = form.firstName
  confirmedEmail.value = form.email
  confirmed.value      = true

  // Reset form fields and errors
  Object.keys(form).forEach(k => { form[k] = '' })
  clearErrors()
}

function resetForm() {
  Object.keys(form).forEach(k => { form[k] = '' })
  clearErrors()
}

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => {
  scrollObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
    { threshold: 0.12 }
  )
  if (wrapperEl.value) scrollObserver.observe(wrapperEl.value)
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
body { background: var(--black); color: var(--off-white); font-family: 'DM Sans', sans-serif; overflow-x: hidden; cursor: none; }

/* ── Confirmation Popup ── */
.confirm-backdrop { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.35s ease; }
.confirm-backdrop.show { opacity: 1; pointer-events: all; }
.confirm-modal { background: #0f0e0c; border: 1px solid rgba(200,169,126,0.3); padding: 3rem 3.5rem; max-width: 480px; width: 90%; position: relative; text-align: center; }
.confirm-modal-bar { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, var(--warm), transparent 60%); }
.confirm-modal-icon { width: 52px; height: 52px; border-radius: 50%; border: 1px solid rgba(200,169,126,0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.6rem; }
.confirm-modal-eyebrow { font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--warm); margin-bottom: 0.8rem; }
.confirm-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 300; color: var(--off-white); margin: 0 0 0.8rem; }
.confirm-modal-body { font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: rgba(245,240,235,0.5); line-height: 1.7; margin: 0 0 2rem; }
.confirm-modal-body strong { color: var(--off-white); }
.confirm-modal-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

/* ── Shared Section Styles ── */
.section-label { font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--warm); margin-bottom: 1rem; }
.section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem, 4vw, 3.8rem); font-weight: 300; line-height: 1.15; }
.section-title em { font-style: italic; color: var(--warm); }

/* ── Buttons ── */
.btn-primary { display: inline-flex; align-items: center; gap: 0.8rem; background: var(--warm); color: var(--black); font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; text-decoration: none; padding: 1rem 2.2rem; font-weight: 500; border: none; cursor: none; transition: background 0.3s, transform 0.2s; }
.btn-primary:hover { background: var(--warm-light); transform: translateY(-2px); }
.btn-secondary { font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,240,235,0.6); text-decoration: none; display: inline-flex; align-items: center; gap: 0.6rem; transition: color 0.3s; background: none; border: none; cursor: none; }
.btn-secondary:hover { color: var(--off-white); }

/* ── Contact Section ── */
.contact-section { padding: 9rem 4rem 7rem; background: linear-gradient(180deg, var(--black) 0%, #0d0c0a 100%); min-height: 100vh; }
.contact-wrapper { max-width: 900px; margin: 0 auto; background: var(--glass); border: 1px solid var(--glass-border); padding: 3rem; }
.contact-intro { margin-bottom: 2.5rem; text-align: center; }
.contact-intro p { font-size: 0.9rem; line-height: 1.8; color: rgba(245,240,235,0.6); max-width: 600px; margin: 1rem auto 0; }

/* ── Contact Form ── */
.contact-form h3 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; margin: 2rem 0 1.5rem; color: var(--off-white); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; }
.form-group.full { grid-column: 1 / -1; }
.contact-form label { font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--warm); margin-bottom: 0.7rem; }
.contact-form input,
.contact-form select,
.contact-form textarea { width: 100%; background: rgba(245,240,235,0.03); border: 1px solid var(--glass-border); color: var(--off-white); padding: 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none; transition: border-color 0.3s, background 0.3s; cursor: none; }
.contact-form input:focus,
.contact-form select:focus,
.contact-form textarea:focus { border-color: var(--warm); background: rgba(245,240,235,0.05); }
.contact-form input.invalid,
.contact-form select.invalid,
.contact-form textarea.invalid { border-color: #ff8e8e; }
.contact-form select option { background: #1a1a1a; color: var(--off-white); }
.contact-form textarea { min-height: 160px; resize: vertical; }
.form-actions { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
.form-reset { display: inline-flex; align-items: center; justify-content: center; background: transparent; color: var(--off-white); border: 1px solid var(--glass-border); font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; padding: 1rem 2rem; font-weight: 500; cursor: none; transition: border-color 0.3s, color 0.3s, transform 0.2s; }
.form-reset:hover { border-color: var(--warm); color: var(--warm); transform: translateY(-2px); }
.error { color: #ff8e8e; font-size: 0.85rem; display: block; margin-top: 0.45rem; min-height: 1.1rem; }

/* ── CTA Section ── */
.cta-section { position: relative; background: var(--black); padding: 8rem 4rem; text-align: center; overflow: hidden; }
.cta-section::before { content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(200,169,126,0.08) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }
.cta-eyebrow { font-size: 0.68rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--warm); margin-bottom: 1.5rem; }
.cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.8rem, 5vw, 4.5rem); font-weight: 300; line-height: 1.15; margin-bottom: 1.5rem; }
.cta-title em { font-style: italic; color: var(--warm); }
.cta-sub { font-size: 0.9rem; color: rgba(245,240,235,0.45); margin-bottom: 3rem; line-height: 1.8; }
.cta-actions { display: flex; justify-content: center; gap: 1.5rem; }

/* ── Fade Up ── */
.fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
.fade-up.visible { opacity: 1; transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .nav-links { display: none; }
  .contact-section { padding: 7rem 2rem 5rem; }
  .contact-wrapper { padding: 2rem; }
  .form-grid { grid-template-columns: 1fr; }
  .cta-section { padding: 5rem 2rem; }
}
</style>
