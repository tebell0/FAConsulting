<template>

  <!-- Cursor -->
  <AppCursor v-model="isHovering" :auto-hover="false" />

  <!-- Nav -->
  <AppNav variant="public" active-page="book" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />

  <div class="booking-layout">

    <!-- LEFT: Package Selection & Info -->
    <div class="left-panel">
      <div class="panel-eyebrow">Reserve Your Date</div>
      <h1 class="panel-title">Book a<br /><em>Session</em></h1>

      <div class="package-list">
        <div
          v-for="(svc, i) in services"
          :key="svc.id"
          class="pkg-card"
          :class="{ selected: selectedPackageIdx === i }"
          @click="selectPackage(i)"
          @mouseenter="isHovering = true"
          @mouseleave="isHovering = false"
        >
          <div class="pkg-header">
            <div class="pkg-name">{{ svc.name }}</div>
            <div class="pkg-price">${{ svc.price.toLocaleString() }}</div>
          </div>
          <div class="pkg-meta">{{ svc.duration }}</div>
          <div class="pkg-desc">{{ svc.desc }}</div>
          <div class="pkg-check"><div class="pkg-check-dot"></div></div>
        </div>
      </div>

      <div class="info-block">
        <div class="info-title">What to Expect</div>
        <div class="info-item" v-for="item in expectItems" :key="item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="var(--warm)" stroke-width="1.1"/>
            <path d="M4.5 7l2 2 3-3" stroke="var(--warm)" stroke-width="1.1" stroke-linecap="round"/>
          </svg>
          {{ item }}
        </div>
      </div>

      <div class="left-panel-footer">
        <div class="contact-line">Questions? <a href="mailto:jalen@jayxcreatez.com">jalen@jayxcreatez.com</a></div>
        <div class="contact-line">Based in <a href="#">Houston, TX</a></div>
      </div>
    </div>

    <!-- RIGHT: Booking Steps -->
    <div class="right-panel">

      <!-- Step Navigation -->
      <div class="steps-nav" v-if="!confirmed">
        <button
          v-for="n in 3"
          :key="n"
          class="step-btn"
          :class="{ active: currentStep === n, completed: currentStep > n }"
          @click="goToStep(n)"
          @mouseenter="isHovering = true"
          @mouseleave="isHovering = false"
        >
          <span class="step-num">{{ n }}</span>
          {{ ['Date &amp; Time', 'Your Details', 'Review'][n - 1] }}
        </button>
      </div>

      <!-- STEP 1: Calendar -->
      <div class="step-panel" :class="{ active: currentStep === 1 }" v-if="!confirmed">
        <div class="calendar-wrap fade-up visible">
          <div class="cal-header">
            <button
              class="cal-nav-btn"
              @click="changeMonth(-1)"
              @mouseenter="isHovering = true"
              @mouseleave="isHovering = false"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L3 7l6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </button>
            <div class="cal-month">{{ calMonthLabel }}</div>
            <button
              class="cal-nav-btn"
              @click="changeMonth(1)"
              @mouseenter="isHovering = true"
              @mouseleave="isHovering = false"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 1l6 6-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </button>
          </div>

          <div class="cal-grid">
            <!-- Day name headers -->
            <div class="cal-day-name" v-for="d in DAYS" :key="d">{{ d }}</div>
            <!-- Empty offset cells -->
            <div class="cal-day empty" v-for="n in calFirstDay" :key="'e' + n"></div>
            <!-- Day cells -->
            <div
              v-for="day in calDays"
              :key="day.num"
              class="cal-day"
              :class="day.classes"
              @click="day.selectable ? selectDate(day.date) : null"
              @mouseenter="day.selectable ? isHovering = true : null"
              @mouseleave="day.selectable ? isHovering = false : null"
            >{{ day.num }}</div>
          </div>

          <div class="availability-legend">
            <div class="legend-item"><div class="legend-dot avail"></div>Available</div>
            <div class="legend-item"><div class="legend-dot booked-d"></div>Booked</div>
            <div class="legend-item"><div class="legend-dot selected-d"></div>Selected</div>
          </div>
        </div>

        <!-- Time Slots -->
        <div class="time-section fade-up visible" v-if="selectedDate">
          <div class="time-section-label">Available times &mdash; {{ timeSectionLabel }}</div>
          <div class="time-slots">
            <div
              v-for="slot in timeSlots"
              :key="slot.time"
              class="time-slot"
              :class="{
                taken:        slot.taken,
                'blocked-time': slot.adminBlocked,
                selected:     selectedTime === slot.time,
                clicked:      clickedSlots.includes(slot.time)
              }"
              @click="slot.selectable ? selectTime(slot.time) : null"
              @mouseenter="slot.selectable ? isHovering = true : null"
              @mouseleave="slot.selectable ? isHovering = false : null"
            >{{ slot.time }}</div>
          </div>
        </div>

        <div class="step-actions">
          <button
            class="btn-next"
            :disabled="!selectedTime"
            :style="{ opacity: selectedTime ? '1' : '0.4' }"
            @click="goToStep(2)"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
          >
            Continue
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>

      <!-- STEP 2: Details Form -->
      <div class="step-panel" :class="{ active: currentStep === 2 }" v-if="!confirmed">
        <div class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name *</label>
              <input class="form-input" v-model="form.firstName" type="text" placeholder="Jordan" />
            </div>
            <div class="form-group">
              <label class="form-label">Last Name *</label>
              <input class="form-input" v-model="form.lastName" type="text" placeholder="Williams" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email Address *</label>
            <input class="form-input" v-model="form.email" type="email" placeholder="your@email.com" />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input class="form-input" v-model="form.phone" type="tel" placeholder="(713) 555-0100" />
          </div>
          <div class="form-group">
            <label class="form-label">Session Type</label>
            <div class="select-wrap">
              <select class="form-select form-input" v-model="form.sessionType">
                <option value="portrait">Portrait / Individual</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="brand">Brand / Business</option>
                <option value="graduation">Graduation</option>
                <option value="event">Event</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Location Preference</label>
            <div class="select-wrap">
              <select class="form-select form-input" v-model="form.location">
                <option value="studio">Studio (Houston, TX)</option>
                <option value="outdoor">Outdoor — Your Choice</option>
                <option value="client">Client's Location</option>
                <option value="tbd">TBD / Discuss with Photographer</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Notes / Special Requests</label>
            <textarea class="form-textarea form-input" v-model="form.notes" placeholder="Tell me about your vision, outfit ideas, or anything else I should know..."></textarea>
          </div>
          <div class="form-hint">* Required fields. You'll receive a confirmation email after booking.</div>
        </div>

        <div class="step-actions">
          <button class="btn-back" @click="goToStep(1)" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11 6H1M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            Back
          </button>
          <button class="btn-next" @click="goToStep(3)" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
            Review Booking
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>

      <!-- STEP 3: Review & Confirm -->
      <div class="step-panel" :class="{ active: currentStep === 3 }" v-if="!confirmed">
        <div class="review-section">
          <div class="review-card">
            <div class="review-card-title">Session Details</div>
            <div class="review-row"><span class="review-key">Package</span><span class="review-val">{{ review.packageName }}</span></div>
            <div class="review-row"><span class="review-key">Date</span><span class="review-val">{{ review.date }}</span></div>
            <div class="review-row"><span class="review-key">Time</span><span class="review-val">{{ review.time }}</span></div>
            <div class="review-row"><span class="review-key">Duration</span><span class="review-val">{{ review.duration }}</span></div>
            <div class="review-row"><span class="review-key">Session Type</span><span class="review-val">{{ review.sessionType }}</span></div>
            <div class="review-row"><span class="review-key">Location</span><span class="review-val">{{ review.location }}</span></div>
            <div class="review-total">
              <span class="review-total-label">Estimated Total</span>
              <span class="review-total-price">{{ review.price }}</span>
            </div>
          </div>

          <div class="review-card">
            <div class="review-card-title">Client Information</div>
            <div class="review-row"><span class="review-key">Name</span><span class="review-val">{{ review.name }}</span></div>
            <div class="review-row"><span class="review-key">Email</span><span class="review-val">{{ review.email }}</span></div>
            <div class="review-row"><span class="review-key">Phone</span><span class="review-val">{{ review.phone }}</span></div>
          </div>

          <div class="policy-note">
            <strong>Cancellation Policy:</strong> Free reschedule up to 48 hours before your session. Cancellations within 48 hours forfeit the deposit. Full payment details will be sent with your confirmation.
          </div>

          <div class="step-actions">
            <button class="btn-back" @click="goToStep(2)" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11 6H1M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              Back
            </button>
            <button class="btn-next" @click="submitBooking" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
              Confirm Booking
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation Screen -->
      <div class="confirmation show" v-if="confirmed">
        <div class="confirm-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l7 7 11-12" stroke="var(--warm)" stroke-width="1.8" stroke-linecap="round"/></svg>
        </div>
        <div class="confirm-ref">Booking #{{ confirmData.ref }}</div>
        <h2 class="confirm-title">You&apos;re <em>Booked</em></h2>
        <p class="confirm-sub">Your session request has been received. Expect a confirmation email within 24 hours with all the details.</p>
        <div class="confirm-details">
          <div class="confirm-detail"><span class="confirm-detail-key">Package</span><span>{{ confirmData.pkg }}</span></div>
          <div class="confirm-detail"><span class="confirm-detail-key">Date &amp; Time</span><span>{{ confirmData.dt }}</span></div>
          <div class="confirm-detail"><span class="confirm-detail-key">Email</span><span>{{ confirmData.email }}</span></div>
        </div>
        <a href="/" class="btn-home" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11 6H1M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          Back to Home
        </a>
      </div>

    </div><!-- end right-panel -->
  </div><!-- end booking-layout -->

</template>

<script setup>
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import AppCursor from '../components/AppCursor.vue'
import AppNav    from '../components/AppNav.vue'
import { useFonts } from '../composables/useFonts.js'
import api from '@/services/api.js'
useFonts()

// ── Cursor state ──────────────────────────────────────────
const isHovering = ref(false)

// ── Constants ─────────────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const ALL_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']

const SESSION_TYPE_LABELS = {
  portrait:   'Portrait / Individual',
  couple:     'Couple',
  family:     'Family',
  brand:      'Brand / Business',
  graduation: 'Graduation',
  event:      'Event',
}
const LOCATION_LABELS = {
  studio:  'Studio (Houston, TX)',
  outdoor: 'Outdoor — Your Choice',
  client:  "Client's Location",
  tbd:     'TBD / Discuss with Photographer',
}

const expectItems = [
  'Booking confirmation via email within 24 hours',
  'Session preparation guide sent beforehand',
  'Edited images delivered via secure private gallery',
  'Free reschedule up to 48 hours before session',
]

// ── Services (from localStorage, fallback to defaults) ────
const SVC_DEFAULTS = [
  { id: 'svc-1', name: 'The Essentials', duration: '30 min', price: 295,  desc: 'Focused 30-minute session. Clean, editorial portraits with a curated selection of final edited images delivered digitally.' },
  { id: 'svc-2', name: 'The Signature',  duration: '1 hr',   price: 345,  desc: 'Immersive 1-hour session with multiple outfit changes, varied setups, and an expanded gallery of polished deliverables.' },
  { id: 'svc-3', name: 'The Elite',      duration: '2 hr',   price: 427,  desc: 'Full 2-hour creative production — styling consultation, premium retouching, priority delivery, and an extensive final gallery.' },
  { id: 'svc-4', name: 'The Wedding',    duration: '5 hr',   price: 1500, desc: 'Comprehensive wedding coverage. Custom packages available. Contact us for a personalized quote.' },
]

function loadServices() {
  try {
    const raw = localStorage.getItem('services')
    const list = raw ? JSON.parse(raw) : SVC_DEFAULTS.map(s => ({ ...s }))
    // Apply individual price overrides from admin settings
    return list.map(s => {
      const priceKey = s.name.replace('The ', '').toLowerCase()
      const override = parseInt(localStorage.getItem('price-' + priceKey))
      return { ...s, price: isNaN(override) ? s.price : override }
    })
  } catch (e) {
    return SVC_DEFAULTS.map(s => ({ ...s }))
  }
}

const services = ref(loadServices())
const selectedPackageIdx = ref(0)
const selectedPackage = computed(() => services.value[selectedPackageIdx.value])

function selectPackage(i) { selectedPackageIdx.value = i }

// ── Calendar state ────────────────────────────────────────
const currentMonth = ref(new Date(2026, 3, 1)) // April 2026
const selectedDate = ref(null)
const selectedTime = ref(null)

// ── localStorage helpers ──────────────────────────────────
function getBlockedDates() {
  try { return JSON.parse(localStorage.getItem('blockedDates') || '[]') } catch { return [] }
}
function getBlockedTimes() {
  try { return JSON.parse(localStorage.getItem('blockedTimes') || '{}') } catch { return {} }
}
function getClientBookedMap() {
  try {
    const arr = JSON.parse(localStorage.getItem('appointments') || '[]')
    const map = {}
    arr.forEach(a => {
      if (a.isoDate && a.time && a.status !== 'cancelled') {
        if (!map[a.isoDate]) map[a.isoDate] = new Set()
        map[a.isoDate].add(a.time)
      }
    })
    return map
  } catch { return {} }
}

function toIso(date) {
  return date.getFullYear() + '-'
    + String(date.getMonth() + 1).padStart(2, '0') + '-'
    + String(date.getDate()).padStart(2, '0')
}

function isDateFullyBooked(isoStr, adminBlockedTimes, clientMap) {
  const clientTimes = clientMap[isoStr] ? [...clientMap[isoStr]] : []
  const adminTimes  = adminBlockedTimes[isoStr] || []
  return ALL_SLOTS.every(s => clientTimes.includes(s) || adminTimes.includes(s))
}

// ── Computed: calendar label ──────────────────────────────
const calMonthLabel = computed(() =>
  `${MONTH_NAMES[currentMonth.value.getMonth()]} ${currentMonth.value.getFullYear()}`
)

// ── Computed: first weekday offset ───────────────────────
const calFirstDay = computed(() =>
  new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1).getDay()
)

// ── Computed: day cells ───────────────────────────────────
const calDays = computed(() => {
  const d           = currentMonth.value
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  const today       = new Date()
  const blocked     = getBlockedDates()
  const bTimes      = getBlockedTimes()
  const cMap        = getClientBookedMap()

  return Array.from({ length: daysInMonth }, (_, idx) => {
    const num  = idx + 1
    const date = new Date(d.getFullYear(), d.getMonth(), num)
    const iso  = toIso(date)

    const isPast       = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const isToday      = date.toDateString() === today.toDateString()
    const isAdminBlock = blocked.includes(iso)
    const isFullBooked = !isAdminBlock && isDateFullyBooked(iso, bTimes, cMap)
    const isSelected   = selectedDate.value && toIso(selectedDate.value) === iso

    const selectable = !isPast && !isAdminBlock && !isFullBooked

    const classes = [
      isPast        ? 'past'      :
      isAdminBlock  ? 'blocked'   :
      isFullBooked  ? 'booked'    : 'available',
      isToday    ? 'today'    : '',
      isSelected ? 'selected' : '',
      selectable ? 'clickable' : '',
    ].filter(Boolean).join(' ')

    return { num, date, iso, selectable, classes }
  })
})

function changeMonth(dir) {
  const d = currentMonth.value
  currentMonth.value = new Date(d.getFullYear(), d.getMonth() + dir, 1)
  // Clear selection if it's no longer in this month view
  if (selectedDate.value) {
    const sd = selectedDate.value
    if (sd.getMonth() !== currentMonth.value.getMonth() || sd.getFullYear() !== currentMonth.value.getFullYear()) {
      selectedDate.value = null
      selectedTime.value = null
    }
  }
}

function selectDate(date) {
  selectedDate.value = date
  selectedTime.value = null
}

// ── Computed: time section label ──────────────────────────
const timeSectionLabel = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
})

// ── Computed: time slot objects ───────────────────────────
const timeSlots = computed(() => {
  if (!selectedDate.value) return []
  const iso         = toIso(selectedDate.value)
  const adminTimes  = getBlockedTimes()[iso] || []
  const clientTimes = getClientBookedMap()[iso] || new Set()

  return ALL_SLOTS.map(time => {
    const taken        = clientTimes.has ? clientTimes.has(time) : clientTimes.includes(time)
    const adminBlocked = adminTimes.includes(time)
    return { time, taken, adminBlocked, selectable: !taken && !adminBlocked }
  })
})

// ── Time slot click animation ─────────────────────────────
const clickedSlots = ref([])

function selectTime(time) {
  selectedTime.value = time
  if (!clickedSlots.value.includes(time)) clickedSlots.value.push(time)
  setTimeout(() => {
    clickedSlots.value = clickedSlots.value.filter(t => t !== time)
  }, 500)
}

// ── Form ──────────────────────────────────────────────────
const form = reactive({
  firstName:   '',
  lastName:    '',
  email:       '',
  phone:       '',
  sessionType: 'portrait',
  location:    'studio',
  notes:       '',
})

// ── Steps ─────────────────────────────────────────────────
const currentStep = ref(1)

function goToStep(n) {
  if (n > currentStep.value) {
    if (currentStep.value === 1 && !selectedTime.value) {
      alert('Please select a date and time.')
      return
    }
    if (currentStep.value === 2) {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
        alert('Please fill in your name and email.')
        return
      }
    }
  }
  currentStep.value = n
}

// ── Review (computed so it's always current when step 3 is shown) ──
const review = computed(() => ({
  packageName: selectedPackage.value.name,
  date:        selectedDate.value
    ? selectedDate.value.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '—',
  time:        selectedTime.value || '—',
  duration:    selectedPackage.value.duration,
  price:       '$' + selectedPackage.value.price.toLocaleString(),
  sessionType: SESSION_TYPE_LABELS[form.sessionType] || form.sessionType,
  location:    LOCATION_LABELS[form.location]        || form.location,
  name:        `${form.firstName} ${form.lastName}`.trim() || '—',
  email:       form.email  || '—',
  phone:       form.phone  || '—',
}))

// ── Confirmation ──────────────────────────────────────────
const confirmed    = ref(false)
const confirmData  = reactive({ ref: '', pkg: '', dt: '', email: '' })

function submitBooking() {
  const dateStr = selectedDate.value
    ? selectedDate.value.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'
  const refNum   = 'JXC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000)
  const isoDate  = selectedDate.value ? toIso(selectedDate.value) : ''
  const initials = (form.firstName.charAt(0) + form.lastName.charAt(0)).toUpperCase()

  const newBooking = {
    id:          refNum.toLowerCase(),
    name:        `${form.firstName} ${form.lastName}`,
    initials,
    package:     selectedPackage.value.name,
    isoDate,
    time:        selectedTime.value,
    location:    LOCATION_LABELS[form.location] || form.location,
    badge:       'Pending',
    status:      'upcoming',
    email:       form.email,
    phone:       form.phone || '—',
    sessionType: SESSION_TYPE_LABELS[form.sessionType] || form.sessionType,
    notes:       form.notes || '—',
    price:       '$' + selectedPackage.value.price.toLocaleString(),
    ref:         refNum,
    link:        null,
  }

  try {
    const arr = JSON.parse(localStorage.getItem('appointments') || '[]')
    arr.push(newBooking)
    localStorage.setItem('appointments', JSON.stringify(arr))
  } catch { /* fail silently */ }

  confirmData.ref   = refNum
  confirmData.pkg   = selectedPackage.value.name
  confirmData.dt    = `${dateStr} at ${selectedTime.value}`
  confirmData.email = form.email
  confirmed.value   = true
}

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => {
  // no cursor setup needed — handled by AppCursor
})

onBeforeUnmount(() => {
  // no cursor teardown needed
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

/* ── Booking Layout ── */
.booking-layout { display: grid; grid-template-columns: 420px 1fr; min-height: 100vh; padding-top: 72px; }

/* ── Left Panel ── */
.left-panel { background: #0d0c0a; border-right: 1px solid var(--glass-border); padding: 4rem 3rem; overflow-y: auto; position: sticky; top: 72px; height: calc(100vh - 72px); display: flex; flex-direction: column; }
.panel-eyebrow { font-size: 0.62rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--warm); margin-bottom: 1rem; }
.panel-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.8rem, 4vw, 3.8rem); font-weight: 300; line-height: 1.1; margin-bottom: 2.5rem; }
.panel-title em { font-style: italic; color: var(--warm); }

/* ── Package Cards ── */
.package-list { display: flex; flex-direction: column; gap: 1px; margin-bottom: 2.5rem; }
.pkg-card { padding: 1.4rem 1.6rem; background: var(--glass); border: 1px solid var(--glass-border); cursor: none; position: relative; transition: border-color 0.3s; }
.pkg-card:hover { border-color: rgba(200,169,126,0.4); }
.pkg-card.selected { border-color: var(--warm); background: rgba(200,169,126,0.08); }
.pkg-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.3rem; }
.pkg-name { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 300; }
.pkg-price { font-size: 0.78rem; letter-spacing: 0.1em; color: var(--warm); }
.pkg-meta { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,240,235,0.35); margin-bottom: 0.5rem; }
.pkg-desc { font-size: 0.78rem; line-height: 1.7; color: rgba(245,240,235,0.45); padding-right: 1.5rem; }
.pkg-check { position: absolute; top: 1.4rem; right: 1.2rem; width: 18px; height: 18px; border: 1px solid var(--glass-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: border-color 0.3s, background 0.3s; }
.pkg-card.selected .pkg-check { border-color: var(--warm); background: var(--warm); }
.pkg-check-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--black); opacity: 0; transition: opacity 0.2s; }
.pkg-card.selected .pkg-check-dot { opacity: 1; }

/* ── Info Block ── */
.info-block { border-top: 1px solid var(--glass-border); padding-top: 2rem; margin-bottom: 2rem; }
.info-title { font-size: 0.62rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--warm); margin-bottom: 1rem; }
.info-item { display: flex; align-items: flex-start; gap: 0.7rem; font-size: 0.8rem; color: rgba(245,240,235,0.5); margin-bottom: 0.75rem; line-height: 1.5; }
.info-item svg { flex-shrink: 0; margin-top: 1px; }
.left-panel-footer { margin-top: auto; border-top: 1px solid var(--glass-border); padding-top: 1.5rem; }
.contact-line { font-size: 0.78rem; color: rgba(245,240,235,0.35); margin-bottom: 0.4rem; }
.contact-line a { color: var(--warm); text-decoration: none; transition: opacity 0.2s; }
.contact-line a:hover { opacity: 0.7; }

/* ── Right Panel ── */
.right-panel { padding: 3.5rem 4rem; overflow-y: auto; }

/* ── Steps Nav ── */
.steps-nav { display: flex; gap: 0; margin-bottom: 3rem; border-bottom: 1px solid var(--glass-border); }
.step-btn { flex: 1; background: none; border: none; border-bottom: 2px solid transparent; cursor: none; padding: 1rem 0; display: flex; align-items: center; justify-content: center; gap: 0.7rem; font-family: 'DM Sans', sans-serif; font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,240,235,0.3); transition: color 0.3s, border-color 0.3s; margin-bottom: -1px; }
.step-btn:hover { color: rgba(245,240,235,0.6); }
.step-btn.active { color: var(--off-white); border-bottom-color: var(--warm); }
.step-btn.completed { color: var(--success); border-bottom-color: var(--success); }
.step-num { width: 22px; height: 22px; border: 1px solid currentColor; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; flex-shrink: 0; }

/* ── Step Panels ── */
.step-panel { display: none; }
.step-panel.active { display: block; }

/* ── Calendar ── */
.calendar-wrap { background: var(--glass); border: 1px solid var(--glass-border); padding: 2rem; margin-bottom: 1.5rem; }
.cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.cal-month { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 300; }
.cal-nav-btn { background: none; border: 1px solid var(--glass-border); width: 32px; height: 32px; cursor: none; color: var(--off-white); display: flex; align-items: center; justify-content: center; transition: border-color 0.3s; }
.cal-nav-btn:hover { border-color: var(--warm); }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-day-name { font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,240,235,0.3); text-align: center; padding: 0.5rem 0; }
.cal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; color: rgba(245,240,235,0.6); border: 1px solid transparent; cursor: none; position: relative; transition: border-color 0.2s, background 0.2s, color 0.2s; }
.cal-day:not(.empty):not(.past):hover { border-color: rgba(200,169,126,0.4); color: var(--off-white); }
.cal-day.empty { background: transparent; pointer-events: none; }
.cal-day.past { opacity: 0.2; pointer-events: none; }
.cal-day.available { border-color: rgba(200,169,126,0.15); color: var(--off-white); }
.cal-day.available.clickable:hover { background: rgba(200,169,126,0.15); cursor: none; }
.cal-day.booked { opacity: 0.2; pointer-events: none; text-decoration: line-through; }
.cal-day.blocked { background: rgba(245,240,235,0.03); color: rgba(245,240,235,0.15); pointer-events: none; }
.cal-day.today { color: var(--warm); }
.cal-day.today::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: var(--warm); border-radius: 50%; }
.cal-day.today.selected::after { background: var(--black); }
.cal-day.selected { background: var(--warm); color: var(--black) !important; font-weight: 500; }
.availability-legend { display: flex; gap: 1.5rem; margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid var(--glass-border); }
.legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,240,235,0.35); }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; }
.legend-dot.avail     { background: rgba(200,169,126,0.6); }
.legend-dot.booked-d  { background: rgba(245,240,235,0.15); }
.legend-dot.selected-d { background: var(--warm); }

/* ── Time Slots ── */
.time-section { background: var(--glass); border: 1px solid var(--glass-border); padding: 1.5rem 2rem; margin-bottom: 1.5rem; }
.time-section-label { font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--warm); margin-bottom: 1.2rem; }
.time-slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.time-slot { padding: 0.6rem; text-align: center; font-size: 0.75rem; border: 1px solid var(--glass-border); color: rgba(245,240,235,0.7); transition: background 0.2s, border-color 0.2s, color 0.2s; cursor: none; }
.time-slot:not(.taken):not(.blocked-time):hover { border-color: rgba(200,169,126,0.5); color: var(--off-white); }
.time-slot.selected { background: var(--warm); border-color: var(--warm); color: var(--black); font-weight: 500; }
.time-slot.taken { color: rgba(245,240,235,0.18); text-decoration: line-through; cursor: default; pointer-events: none; }
.time-slot.blocked-time { color: rgba(245,240,235,0.12); cursor: default; pointer-events: none; background: rgba(245,240,235,0.02); }
.time-slot.clicked { animation: slotPulse 0.45s ease forwards; }
@keyframes slotPulse {
  0%   { transform: scale(1);    box-shadow: 0 0 0 0   rgba(200,169,126,0.55); }
  40%  { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(200,169,126,0); }
  70%  { transform: scale(0.97); }
  100% { transform: scale(1);    box-shadow: 0 0 0 0   rgba(200,169,126,0); }
}

/* ── Step Actions ── */
.step-actions { display: flex; align-items: center; gap: 1rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--glass-border); }
.btn-next { display: inline-flex; align-items: center; gap: 0.7rem; background: var(--warm); color: var(--black); font-family: 'DM Sans', sans-serif; font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; border: none; padding: 0.9rem 2rem; cursor: none; font-weight: 500; transition: background 0.3s, transform 0.2s, opacity 0.3s; }
.btn-next:not(:disabled):hover { background: var(--warm-light); transform: translateY(-1px); }
.btn-back { display: inline-flex; align-items: center; gap: 0.6rem; background: none; border: 1px solid var(--glass-border); color: rgba(245,240,235,0.45); font-family: 'DM Sans', sans-serif; font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.9rem 1.5rem; cursor: none; transition: border-color 0.3s, color 0.3s; }
.btn-back:hover { border-color: rgba(200,169,126,0.4); color: var(--off-white); }

/* ── Form ── */
.form-section { display: flex; flex-direction: column; gap: 1.4rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(245,240,235,0.45); }
.form-input { background: var(--glass); border: 1px solid var(--glass-border); color: var(--off-white); font-family: 'DM Sans', sans-serif; font-size: 0.88rem; padding: 0.85rem 1rem; outline: none; transition: border-color 0.3s; width: 100%; }
.form-input:focus { border-color: rgba(200,169,126,0.6); }
.form-input::placeholder { color: rgba(245,240,235,0.2); }
.select-wrap { position: relative; }
.select-wrap::after { content: ''; position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); width: 8px; height: 5px; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid rgba(200,169,126,0.6); pointer-events: none; }
.form-select { appearance: none; -webkit-appearance: none; cursor: none; }
.form-select option { background: #1a1a1a; color: var(--off-white); }
.form-textarea { resize: vertical; min-height: 100px; }
.form-hint { font-size: 0.72rem; color: rgba(245,240,235,0.25); margin-top: -0.5rem; }

/* ── Review ── */
.review-section { display: flex; flex-direction: column; gap: 1.5rem; }
.review-card { background: var(--glass); border: 1px solid var(--glass-border); padding: 2rem; }
.review-card-title { font-size: 0.62rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--warm); margin-bottom: 1.2rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.6rem; }
.review-row { display: flex; justify-content: space-between; align-items: baseline; padding: 0.6rem 0; border-bottom: 1px solid rgba(200,169,126,0.06); }
.review-row:last-of-type { border-bottom: none; }
.review-key { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(245,240,235,0.35); }
.review-val { font-size: 0.88rem; color: var(--off-white); text-align: right; max-width: 60%; }
.review-total { display: flex; justify-content: space-between; align-items: baseline; margin-top: 1.2rem; padding-top: 1.2rem; border-top: 1px solid var(--glass-border); }
.review-total-label { font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,240,235,0.45); }
.review-total-price { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; color: var(--warm); }
.policy-note { font-size: 0.78rem; line-height: 1.7; color: rgba(245,240,235,0.35); padding: 1.2rem; background: rgba(200,169,126,0.04); border: 1px solid var(--glass-border); margin-bottom: 1.5rem; }

/* ── Confirmation ── */
.confirmation { display: none; text-align: center; padding: 5rem 2rem; }
.confirmation.show { display: block; }
.confirm-icon { width: 72px; height: 72px; border: 1px solid var(--warm); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; animation: pulseRing 1.5s ease-out; }
@keyframes pulseRing {
  0%   { transform: scale(0.5); opacity: 0; }
  60%  { transform: scale(1.1); }
  100% { transform: scale(1);   opacity: 1; }
}
.confirm-ref { font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--warm); margin-bottom: 2.5rem; }
.confirm-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 300; margin-bottom: 1rem; line-height: 1.15; }
.confirm-title em { font-style: italic; color: var(--warm); }
.confirm-sub { font-size: 0.88rem; color: rgba(245,240,235,0.5); max-width: 380px; line-height: 1.8; margin: 0 auto 3rem; }
.confirm-details { background: var(--glass); border: 1px solid var(--glass-border); padding: 1.8rem; max-width: 400px; margin: 0 auto 2rem; }
.confirm-detail { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 0.4rem 0; border-bottom: 1px solid rgba(200,169,126,0.06); }
.confirm-detail:last-child { border-bottom: none; }
.confirm-detail-key { color: rgba(245,240,235,0.4); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; }
.btn-home { display: inline-flex; align-items: center; gap: 0.7rem; border: 1px solid var(--glass-border); color: rgba(245,240,235,0.55); font-family: 'DM Sans', sans-serif; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; padding: 0.9rem 1.8rem; text-decoration: none; transition: border-color 0.3s, color 0.3s; }
.btn-home:hover { border-color: var(--warm); color: var(--warm); }

/* ── Fade Up ── */
.fade-up { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
.fade-up.visible { opacity: 1; transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 960px) {
  .booking-layout { grid-template-columns: 1fr; }
  .left-panel { position: static; height: auto; padding: 3rem 2rem; }
  .right-panel { padding: 2.5rem 2rem; }
  .nav-links { display: none; }
  .time-slots { grid-template-columns: repeat(3, 1fr); }
  .form-row { grid-template-columns: 1fr; }
}
</style>
