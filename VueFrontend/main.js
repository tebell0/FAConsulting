/**
 * main.js
 * ─────────────────────────────────────────────────────────────────
 * Application entry point.
 * Creates the Vue app, installs Vue Router, and mounts to #app.
 * ─────────────────────────────────────────────────────────────────
 */

import { createApp } from 'vue'
import App    from './App.vue'
import router from './router/index.js'

createApp(App)
  .use(router)
  .mount('#app')
