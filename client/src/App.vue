<script setup>
import { onMounted, ref } from 'vue'

const status = ref('Checking backend...')
const details = ref(null)

async function loadStatus() {
  try {
    const response = await fetch('/api/health')
    const data = await response.json()
    details.value = data
    status.value = data.ok
      ? `Backend connected to ${data.database.client} RDS`
      : 'Backend is up, but the database connection failed'
  } catch (error) {
    status.value = 'Backend is unreachable'
    details.value = { error: error.message }
  }
}

onMounted(loadStatus)
</script>

<template>
  <main class="shell">
    <section class="panel">
      <p class="eyebrow">FA Consulting</p>
      <h1>Backend connection status</h1>
      <p class="summary">
        The frontend calls <code>/api/health</code>. The backend then checks the MySQL RDS
        connection and returns the current status.
      </p>

      <div class="status">
        <strong>Status:</strong>
        <span>{{ status }}</span>
      </div>

      <pre v-if="details">{{ JSON.stringify(details, null, 2) }}</pre>
    </section>
  </main>
</template>
