<template>

  <!-- Cursor -->
  <AppCursor v-model="isHovering" :auto-hover="false" />

  <!-- Nav -->
  <AppNav variant="admin" active-page="deliverables" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />

  <div class="dlv-layout">

    <!-- Page Header -->
    <div class="dlv-header">
      <div class="dlv-header-left">
        <div class="section-label">Admin · Final Step</div>
        <h1 class="dlv-page-title">Build &amp; Send Package</h1>
        <p class="dlv-header-meta">Upload media · generate secure link · deliver to client</p>
      </div>
      <!-- Client selector -->
      <div class="dlv-client-select">
        <label for="clientSelect">Client</label>
        <select id="clientSelect" v-model="selectedApptId" @change="onClientChange"
          @mouseenter="isHovering=true" @mouseleave="isHovering=false">
          <option v-if="!upcomingAppts.length" value="">No upcoming appointments</option>
          <option v-for="a in upcomingAppts" :key="a.id" :value="a.id">
            {{ a.name }} — {{ fmtDateShort(a.isoDate) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="dlv-grid">

      <!-- LEFT: Upload + Notes -->
      <div>

        <!-- Drop Zone Card -->
        <div class="dlv-card">
          <h2 class="dlv-card-title">Media Upload</h2>
          <p class="dlv-card-sub">Drag files here or click to browse. Photos &amp; videos accepted.</p>

          <div
            class="drop-zone"
            :class="{ 'drag-over': isDragOver }"
            @dragover.prevent="isDragOver = true"
            @dragleave="isDragOver = false"
            @drop.prevent="onDrop"
            @mouseenter="isHovering=true" @mouseleave="isHovering=false"
          >
            <input type="file" multiple accept="image/*,video/*" ref="fileInputEl" @change="onFileInputChange" />
            <div class="drop-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 13V4M6 7l4-4 4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="drop-title">Drop photos &amp; videos here</p>
            <p class="drop-hint">or <span>browse files</span> &nbsp;·&nbsp; JPG, PNG, MP4, MOV</p>
          </div>

          <!-- File list -->
          <ul class="file-list" v-if="selectedFiles.length">
            <li v-for="(f, i) in selectedFiles" :key="f.name + f.size" class="file-item">
              <div class="file-icon">{{ ext(f.name) }}</div>
              <div class="file-info">
                <div class="file-name">{{ f.name }}</div>
                <div class="file-size">{{ formatBytes(f.size) }}</div>
              </div>
              <button class="file-remove" @click="removeFile(i)" aria-label="Remove"
                @mouseenter="isHovering=true" @mouseleave="isHovering=false">×</button>
            </li>
          </ul>

          <!-- Upload progress -->
          <div class="upload-progress" :class="{ visible: uploadVisible }">
            <div class="progress-label">
              <span>{{ uploadStatus || 'Uploading…' }}</span>
              <span>{{ uploadPct }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: uploadPct + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Notes Card -->
        <div class="dlv-card" style="margin-top:2rem;">
          <h2 class="dlv-card-title">Delivery Note</h2>
          <p class="dlv-card-sub">Optional message included with the package link.</p>
          <textarea
            class="dlv-notes"
            v-model="deliveryNote"
            placeholder="Hi [Client], your gallery is ready! Click the link below to view and download your full edited collection. Let me know if you have any questions — it was a pleasure working with you!"
            @mouseenter="isHovering=true" @mouseleave="isHovering=false"
          ></textarea>
        </div>
      </div>

      <!-- RIGHT: Link + Summary + Send -->
      <div class="dlv-sidebar">

        <!-- Secure Link Card -->
        <div class="dlv-card">
          <h2 class="dlv-card-title">Secure Link</h2>
          <p class="dlv-card-sub">Generate a private link to share with the client.</p>

          <div class="link-row">
            <input
              type="text"
              class="link-input"
              v-model="secureLink"
              placeholder="Upload files above — link auto-generates"
              readonly
              @mouseenter="isHovering=true" @mouseleave="isHovering=false"
            />
            <button
              class="link-copy-btn"
              :class="{ copied: linkCopied }"
              @click="copyLink"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false"
            >{{ linkCopied ? 'Copied!' : 'Copy' }}</button>
          </div>

          <div style="margin-top:0.8rem;">
            <button class="btn-back" style="font-size:0.65rem;padding:0.65rem 1.4rem;" @click="generateLink"
              :disabled="!folderUrl"
              :title="folderUrl ? 'Use S3 delivery link' : 'Upload files first to generate link'"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false">
              {{ folderUrl ? 'Use Upload Link' : 'Upload Files First' }}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v4l3 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.3"/></svg>
            </button>
          </div>

          <div class="link-options">
            <div>
              <span class="link-option-label">Expires</span>
              <input type="date" class="link-option-input" v-model="linkExpiry"
                @mouseenter="isHovering=true" @mouseleave="isHovering=false" />
            </div>
            <div>
              <span class="link-option-label">Password (optional)</span>
              <input type="password" class="link-option-input" v-model="linkPassword" placeholder="••••••"
                @mouseenter="isHovering=true" @mouseleave="isHovering=false" />
            </div>
          </div>
        </div>

        <!-- Delivery Summary + Send -->
        <div class="dlv-card">
          <h2 class="dlv-card-title">Delivery Summary</h2>
          <p class="dlv-card-sub">Review before sending.</p>

          <div class="dlv-summary">
            <div class="dlv-summary-row">
              <span class="dlv-summary-key">Client</span>
              <span class="dlv-summary-val">{{ summary.client }}</span>
            </div>
            <div class="dlv-summary-row">
              <span class="dlv-summary-key">Session</span>
              <span class="dlv-summary-val">{{ summary.session }}</span>
            </div>
            <div class="dlv-summary-row">
              <span class="dlv-summary-key">Location</span>
              <span class="dlv-summary-val">{{ summary.location }}</span>
            </div>
            <div class="dlv-summary-row">
              <span class="dlv-summary-key">Email</span>
              <a v-if="summary.email" :href="'mailto:' + summary.email" class="dlv-summary-val dlv-summary-link"
                @mouseenter="isHovering=true" @mouseleave="isHovering=false">{{ summary.email }}</a>
              <span v-else class="dlv-summary-val">—</span>
            </div>
            <div class="dlv-summary-row">
              <span class="dlv-summary-key">Phone</span>
              <a v-if="summary.phone && summary.phone !== '—'" :href="'tel:' + summary.phone" class="dlv-summary-val dlv-summary-link"
                @mouseenter="isHovering=true" @mouseleave="isHovering=false">{{ summary.phone }}</a>
              <span v-else class="dlv-summary-val">—</span>
            </div>
            <div class="dlv-summary-row">
              <span class="dlv-summary-key">Files</span>
              <span class="dlv-summary-val">{{ summaryFilesLabel }}</span>
            </div>
            <div class="dlv-summary-row">
              <span class="dlv-summary-key">Total size</span>
              <span class="dlv-summary-val">{{ summarySize }}</span>
            </div>
            <div class="dlv-summary-row">
              <span class="dlv-summary-key">Secure link</span>
              <span class="dlv-summary-val" :class="secureLink ? 'status-ok' : 'status-warn'">
                {{ secureLink ? 'Generated ✓' : 'Generated after upload' }}
              </span>
            </div>

          </div>

          <!-- Send button -->
          <div v-if="!sent">
            <button
              class="dlv-send-btn"
              :disabled="sendDisabled"
              @click="sendPackage"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false"
            >
              Send to Client
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Success state -->
          <div class="dlv-success" :class="{ visible: sent }">
            <div class="dlv-success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="dlv-success-title">Package Sent</div>
            <p class="dlv-success-sub">The client has been notified and their gallery link is now active.</p>
            <RouterLink to="/admindash" class="btn-back" style="margin-top:0.5rem;font-size:0.65rem;padding:0.65rem 1.4rem;"
              @mouseenter="isHovering=true" @mouseleave="isHovering=false">
              ← Back to Dashboard
            </RouterLink>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <AppFooter variant="admin" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppCursor from '../components/AppCursor.vue'
import AppNav    from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import { useFonts } from '../composables/useFonts.js'
import api from '@/services/api.js'
useFonts()

// ── Cursor state ──────────────────────────────────────────
const isHovering = ref(false)
const router = useRouter()

// ── Appointment store (API + seed fallback) ───────────────
const SEED_APPOINTMENTS = [
  { id:'jxc-001', name:'Aaliya Montgomery', package:'The Signature',  isoDate:'2026-04-10', time:'2:00 PM',  location:'Hermann Park, Houston, TX',  status:'upcoming', email:'aaliya@email.com',   phone:'8325550101' },
  { id:'jxc-002', name:'Marcus Thompson',   package:'The Elite',      isoDate:'2026-04-17', time:'11:00 AM', location:'Downtown Houston, TX',        status:'upcoming', email:'marcus@email.com',   phone:'7135550202' },
  { id:'jxc-003', name:'Brianna Sanders',   package:'The Essentials', isoDate:'2026-04-24', time:'4:30 PM',  location:'Memorial Park, Houston, TX',  status:'upcoming', email:'brianna@email.com',  phone:'2815550303' },
]

const upcomingAppts = ref([])

function fmtDateShort(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function normaliseAppt(a) {
  return {
    id:       String(a.id),
    name:     a.client_name  || a.name  || 'Unknown',
    package:  a.package_name || a.package || '',
    isoDate:  (a.appointment_date || a.isoDate || '').slice(0, 10),
    time:     a.appointment_time || a.time || '',
    location: a.location || '—',
    status:   a.status || 'upcoming',
    email:    a.client_email || a.email || '',
    phone:    a.client_phone || a.phone || '—',
  }
}

// ── Client selector ───────────────────────────────────────
const selectedApptId = ref('')

const summary = reactive({
  client:   '—',
  session:  '—',
  location: '—',
  email:    '',
  phone:    '',
})

function syncSummary() {
  const appt = upcomingAppts.value.find(a => a.id === selectedApptId.value)
  if (!appt) return
  summary.client   = appt.name
  summary.session  = appt.package + ' · ' + fmtDateShort(appt.isoDate) + ' · ' + appt.time
  summary.location = appt.location || '—'
  summary.email    = appt.email || ''
  summary.phone    = appt.phone && appt.phone !== '—' ? appt.phone : ''
  secureLink.value = ''
  uploadedKeys.value = []
  folderUrl.value  = ''
}

function onClientChange() { syncSummary() }

// ── File handling ─────────────────────────────────────────
const fileInputEl   = ref(null)
const selectedFiles = ref([])
const isDragOver    = ref(false)

function addFiles(newFiles) {
  newFiles.forEach(f => {
    if (!selectedFiles.value.find(x => x.name === f.name && x.size === f.size)) {
      selectedFiles.value.push(f)
    }
  })
}

function onDrop(e) {
  isDragOver.value = false
  addFiles([...e.dataTransfer.files])
}

function onFileInputChange() {
  if (fileInputEl.value) addFiles([...fileInputEl.value.files])
}

function removeFile(idx) { selectedFiles.value.splice(idx, 1) }

function formatBytes(b) {
  if (b < 1024)    return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(1) + ' MB'
}

function ext(name) { return name.split('.').pop().toUpperCase().slice(0, 4) }

const summaryFilesLabel = computed(() => {
  const n = selectedFiles.value.length
  return n ? n + ' file' + (n > 1 ? 's' : '') + ' selected' : '0 files selected'
})

const summarySize = computed(() => {
  if (!selectedFiles.value.length) return '—'
  return formatBytes(selectedFiles.value.reduce((s, f) => s + f.size, 0))
})

// ── Secure link ───────────────────────────────────────────
const secureLink   = ref('')
const linkCopied   = ref(false)
const linkExpiry   = ref('')
const linkPassword = ref('')

// S3 tracking
const uploadedKeys = ref([])   // S3 keys of successfully uploaded files
const folderUrl    = ref('')   // S3 folder URL set after first upload

function generateLink() {
  // Only use the real S3 folder URL set after upload
  if (folderUrl.value) {
    secureLink.value = folderUrl.value
    return
  }
  // No files uploaded yet — prompt admin to upload first
  alert('Please upload files first. The secure link is generated automatically after upload completes.')
}

function copyLink() {
  if (!secureLink.value) return
  navigator.clipboard.writeText(secureLink.value).then(() => {
    linkCopied.value = true
    setTimeout(() => { linkCopied.value = false }, 2000)
  })
}

// ── Delivery note ─────────────────────────────────────────
const deliveryNote = ref('')

// ── Upload progress ───────────────────────────────────────
const uploadVisible  = ref(false)
const uploadPct      = ref(0)
const uploadStatus   = ref('')   // status label shown above the bar
const sent           = ref(false)
const sendDisabled   = computed(() => !selectedFiles.value.length || sent.value || uploading.value)
const uploading      = ref(false)

/**
 * Upload one File via a presigned S3 PUT URL.
 * Uses XMLHttpRequest so we get upload progress events.
 *
 * @param {string} uploadUrl  – presigned PUT URL from backend
 * @param {File}   file       – File object
 * @param {(pct: number) => void} onProgress – called 0-100
 */
function uploadFileToS3(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload  = () => (xhr.status >= 200 && xhr.status < 300) ? resolve() : reject(new Error(`S3 upload failed: HTTP ${xhr.status}`))
    xhr.onerror = () => reject(new Error('Network error during S3 upload.'))
    xhr.send(file)
  })
}

async function sendPackage() {
  if (!selectedApptId.value) {
    alert('Please select a client appointment.')
    return
  }
  if (!selectedFiles.value.length) {
    alert('Please add at least one file to upload.')
    return
  }

  uploading.value     = true
  uploadVisible.value = true
  uploadPct.value     = 0
  uploadStatus.value  = 'Preparing upload…'
  sent.value          = false

  const files = selectedFiles.value

  try {
    if (files.length > 0) {
      // ── Upload each file via presigned PUT ────────────────
      let completedBytes = 0
      const totalBytes   = files.reduce((s, f) => s + f.size, 0)
      const keys = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        uploadStatus.value = `Uploading ${i + 1} of ${files.length}: ${file.name}`

        // Get a presigned URL from the backend
        const { uploadUrl, key, folderUrl: fUrl } = await api.admin.getUploadUrl({
          appointmentId: selectedApptId.value,
          fileName:      file.name,
          contentType:   file.type || 'application/octet-stream',
        })

        // Track the folder URL from the first file (used as fallback)
        if (!folderUrl.value && fUrl) {
          folderUrl.value = fUrl
        }

        const fileBytes = file.size
        await uploadFileToS3(uploadUrl, file, (filePct) => {
          // Blend per-file progress into overall progress
          const doneBytes = completedBytes + (fileBytes * filePct / 100)
          uploadPct.value = Math.round((doneBytes / totalBytes) * 100)
        })

        keys.push(key)
        completedBytes += fileBytes
        uploadedKeys.value = keys
      }

      uploadPct.value    = 100
      uploadStatus.value = 'Generating secure link…'

      // Generate a presigned GET URL for the first uploaded file
      // This gives the client a real, working link they can open directly
      try {
        const firstKey = uploadedKeys.value[0]
        const { url } = await api.admin.getDownloadUrl(firstKey)
        secureLink.value = url
        folderUrl.value  = url  // keep folderUrl in sync so button stays active
      } catch (e) {
        // Fallback to folder URL if download URL generation fails
        secureLink.value = folderUrl.value
        console.warn('Could not generate presigned GET URL, using folder URL:', e.message)
      }

      uploadStatus.value = 'Saving delivery link…'
    } else {
      // No files — just record the manual link
      uploadPct.value    = 80
      uploadStatus.value = 'Saving delivery link…'
    }

    // ── Persist the delivery link in the DB ───────────────
    await api.admin.setDeliveryLink(selectedApptId.value, secureLink.value)

    uploadPct.value    = 100
    uploadStatus.value = 'Complete!'

    setTimeout(() => {
      uploadVisible.value = false
      uploading.value     = false
      sent.value          = true
    }, 500)

  } catch (err) {
    uploadStatus.value  = `Error: ${err.message}`
    uploadPct.value     = 0
    uploading.value     = false
    console.error('Upload error:', err)
  }
}

// ── Lifecycle ─────────────────────────────────────────────
onMounted(async () => {
  if (sessionStorage.getItem('adminAuth') !== '1') {
    router.push('/adminsignin')
    return
  }

  // Load upcoming appointments from API, fall back to seeds
  try {
    const dash = await api.admin.dash()
    const raw  = (dash?.appointments ?? []).filter(a => (a.status || 'upcoming') === 'upcoming')
    if (raw.length > 0) {
      upcomingAppts.value = raw.map(normaliseAppt).sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate))
    } else {
      upcomingAppts.value = SEED_APPOINTMENTS
    }
  } catch {
    upcomingAppts.value = SEED_APPOINTMENTS
  }

  if (upcomingAppts.value.length) {
    selectedApptId.value = upcomingAppts.value[0].id
    syncSummary()
  }
})

onBeforeUnmount(() => { /* nothing to tear down */ })
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
.btn-back { display: inline-flex; align-items: center; gap: 0.5rem; background: none; border: 1px solid var(--glass-border); color: rgba(245,240,235,0.6); font-family: 'DM Sans', sans-serif; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.7rem 1.2rem; cursor: none; transition: border-color 0.3s, color 0.3s; text-decoration: none; }
.btn-back:hover { border-color: var(--warm); color: var(--warm); }

/* ── Deliverables Layout ── */
.dlv-layout { padding-top: 100px; min-height: 100vh; }

.dlv-header {
  padding: 3rem 4rem 2.5rem;
  border-bottom: 1px solid var(--glass-border);
  display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem;
}
.dlv-header-left .section-label { margin-bottom: 0.4rem; }
.dlv-page-title { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 300; color: var(--off-white); line-height: 1.1; margin: 0; }
.dlv-header-meta { font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,240,235,0.3); margin-top: 0.6rem; }

/* Client selector */
.dlv-client-select { display: flex; align-items: center; gap: 1rem; background: var(--glass); border: 1px solid var(--glass-border); padding: 0.9rem 1.4rem; min-width: 260px; }
.dlv-client-select label { font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(245,240,235,0.35); white-space: nowrap; }
.dlv-client-select select { background: none; border: none; outline: none; color: var(--cream); font-family: 'DM Sans', sans-serif; font-size: 0.82rem; cursor: none; flex: 1; }
.dlv-client-select select option { background: #111; }

/* Main grid */
.dlv-grid { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; padding: 3rem 4rem 6rem; align-items: start; }

/* Card */
.dlv-card { background: var(--glass); border: 1px solid var(--glass-border); padding: 2.4rem 2.4rem 2rem; position: relative; }
.dlv-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--warm), transparent 60%); }
.dlv-card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; margin: 0 0 0.3rem; }
.dlv-card-sub { font-size: 0.72rem; color: rgba(245,240,235,0.35); letter-spacing: 0.04em; margin-bottom: 1.8rem; }

/* Drop zone */
.drop-zone { border: 1px dashed rgba(200,169,126,0.3); padding: 3.5rem 2rem; text-align: center; transition: border-color 0.25s, background 0.25s; cursor: none; position: relative; }
.drop-zone.drag-over { border-color: var(--warm); background: rgba(200,169,126,0.04); }
.drop-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: none; width: 100%; height: 100%; }
.drop-icon { width: 44px; height: 44px; border: 1px solid rgba(200,169,126,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; color: var(--warm); }
.drop-title { font-size: 0.82rem; color: var(--cream); margin-bottom: 0.4rem; }
.drop-hint { font-size: 0.68rem; color: rgba(245,240,235,0.3); letter-spacing: 0.06em; }
.drop-hint span { color: var(--warm); text-decoration: underline; }

/* File list */
.file-list { list-style: none; margin: 1.8rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; }
.file-item { display: flex; align-items: center; gap: 0.9rem; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); }
.file-icon { flex-shrink: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: rgba(200,169,126,0.08); font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--warm); }
.file-info { flex: 1; min-width: 0; }
.file-name { font-size: 0.78rem; color: var(--cream); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-size { font-size: 0.62rem; color: rgba(245,240,235,0.3); margin-top: 0.15rem; }
.file-remove { background: none; border: none; color: rgba(245,240,235,0.25); font-size: 1rem; cursor: none; line-height: 1; transition: color 0.2s; padding: 0.2rem 0.3rem; }
.file-remove:hover { color: rgba(245,240,235,0.7); }

/* Upload progress */
.upload-progress { margin-top: 1.8rem; display: none; }
.upload-progress.visible { display: block; }
.progress-label { display: flex; justify-content: space-between; font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(245,240,235,0.35); margin-bottom: 0.5rem; }
.progress-bar { height: 2px; background: rgba(200,169,126,0.15); position: relative; overflow: hidden; }
.progress-fill { height: 100%; background: var(--warm); width: 0%; transition: width 0.4s ease; }

/* Sidebar */
.dlv-sidebar { display: flex; flex-direction: column; gap: 2rem; }

/* Link */
.link-row { display: flex; gap: 0.6rem; align-items: stretch; margin-top: 1rem; }
.link-input { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); color: var(--cream); font-family: 'DM Sans', sans-serif; font-size: 0.75rem; padding: 0.8rem 1rem; outline: none; transition: border-color 0.2s; letter-spacing: 0.02em; }
.link-input:focus { border-color: rgba(200,169,126,0.4); }
.link-input::placeholder { color: rgba(245,240,235,0.2); }
.link-copy-btn { background: rgba(200,169,126,0.1); border: 1px solid rgba(200,169,126,0.25); color: var(--warm); font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; padding: 0 1.2rem; cursor: none; transition: background 0.2s, border-color 0.2s; font-family: 'DM Sans', sans-serif; white-space: nowrap; }
.link-copy-btn:hover { background: rgba(200,169,126,0.18); border-color: var(--warm); }
.link-copy-btn.copied { color: var(--success); border-color: var(--success); background: rgba(126,200,158,0.08); }
.link-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-top: 0.8rem; }
.link-option-label { font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,240,235,0.35); margin-bottom: 0.35rem; display: block; }
.link-option-input { width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); color: var(--cream); font-family: 'DM Sans', sans-serif; font-size: 0.75rem; padding: 0.65rem 0.8rem; outline: none; transition: border-color 0.2s; }
.link-option-input:focus { border-color: rgba(200,169,126,0.4); }

/* Notes */
.dlv-notes { width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); color: var(--cream); font-family: 'DM Sans', sans-serif; font-size: 0.78rem; line-height: 1.65; padding: 1rem; outline: none; resize: vertical; min-height: 120px; margin-top: 1rem; transition: border-color 0.2s; }
.dlv-notes:focus { border-color: rgba(200,169,126,0.4); }
.dlv-notes::placeholder { color: rgba(245,240,235,0.2); }

/* Summary */
.dlv-summary { border-top: 1px solid var(--glass-border); padding-top: 1.4rem; margin-top: 0.4rem; display: flex; flex-direction: column; gap: 0.55rem; }
.dlv-summary-row { display: flex; justify-content: space-between; align-items: center; }
.dlv-summary-key { font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(245,240,235,0.3); }
.dlv-summary-val { font-size: 0.78rem; color: var(--cream); }
.dlv-summary-val.status-ok   { color: var(--success); }
.dlv-summary-val.status-warn { color: var(--warm); }
a.dlv-summary-link { color: rgba(200,169,126,0.7); text-decoration: none; font-size: 0.78rem; transition: color 0.2s; }
a.dlv-summary-link:hover { color: var(--warm); }

/* Send button */
.dlv-send-btn { display: flex; align-items: center; justify-content: center; gap: 1rem; width: 100%; background: var(--warm); color: var(--black); font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; border: none; padding: 1.3rem 2rem; cursor: none; margin-top: 1.6rem; transition: background 0.3s, transform 0.25s, box-shadow 0.3s; box-shadow: 0 4px 24px rgba(200,169,126,0.2); }
.dlv-send-btn:hover { background: #dbbf94; transform: translateY(-2px); box-shadow: 0 10px 40px rgba(200,169,126,0.3); }
.dlv-send-btn:disabled { opacity: 0.35; pointer-events: none; }
.dlv-send-btn svg { transition: transform 0.25s; }
.dlv-send-btn:hover svg { transform: translateX(4px); }

/* Success state */
.dlv-success { display: none; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem 2rem; gap: 1rem; }
.dlv-success.visible { display: flex; }
.dlv-success-icon { width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--success); display: flex; align-items: center; justify-content: center; color: var(--success); }
.dlv-success-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 300; color: var(--off-white); }
.dlv-success-sub { font-size: 0.78rem; color: rgba(245,240,235,0.4); line-height: 1.6; max-width: 300px; }

/* ── Responsive ── */
@media (max-width: 960px) {
  .dlv-grid    { grid-template-columns: 1fr; padding: 2rem 2rem 5rem; }
  .dlv-header  { flex-direction: column; align-items: flex-start; padding: 2.5rem 2rem 2rem; }
  .dlv-client-select { width: 100%; min-width: unset; }
}
@media (max-width: 600px) {
  .nav-links { display: none; }
}
</style>
