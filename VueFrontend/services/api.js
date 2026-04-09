/**
 * services/api.js
 * ─────────────────────────────────────────────────────────────────
 * Central API service for JayxCreatez Productions.
 *
 * All communication with the backend goes through this file.
 * Base URL is read from the Vite env variable VITE_API_BASE_URL
 * (set in .env → http://localhost:3001 for local dev).
 *
 * Usage in any Vue SFC / composable:
 *   import api from '@/services/api.js'
 *
 *   // Public
 *   const health   = await api.health()
 *   const gallery  = await api.gallery.list()
 *   const slots    = await api.calendar.list()
 *   await api.contact.submit({ name, email, message, ... })
 *
 *   // Admin (token stored in sessionStorage after sign-in)
 *   const { token } = await api.admin.signIn({ username, password })
 *   const dash      = await api.admin.dash()
 *   const items     = await api.admin.deliverables()
 *   const settings  = await api.admin.getSettings()
 *   await api.admin.updateSettings({ ... })
 * ─────────────────────────────────────────────────────────────────
 */

// ── Base URL ──────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

// ── Token helpers ─────────────────────────────────────────────────
const TOKEN_KEY = 'adminToken'

export function getAdminToken()         { return sessionStorage.getItem(TOKEN_KEY) ?? '' }
export function setAdminToken(token)    { sessionStorage.setItem(TOKEN_KEY, token) }
export function clearAdminToken()       { sessionStorage.removeItem(TOKEN_KEY) }

// ── Core fetch wrapper ────────────────────────────────────────────
/**
 * @param {string} path        - e.g. '/api/gallery'
 * @param {RequestInit} [init] - standard fetch options (method, body, headers …)
 * @returns {Promise<any>}     - parsed JSON response body
 * @throws  {ApiError}         - structured error with { status, message, body }
 */
async function request(path, init = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...init.headers,
  }

  const token = getAdminToken()
  if (token) headers['x-admin-token'] = token

  const res = await fetch(`${BASE}${path}`, { ...init, headers })

  let body
  try {
    body = await res.json()
  } catch {
    body = null
  }

  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? res.statusText, body)
  }

  return body
}

// ── ApiError class ────────────────────────────────────────────────
export class ApiError extends Error {
  /**
   * @param {number} status  - HTTP status code
   * @param {string} message - Human-readable error string
   * @param {any}    body    - Full parsed JSON body (may be null)
   */
  constructor(status, message, body = null) {
    super(message)
    this.name   = 'ApiError'
    this.status = status
    this.body   = body
  }
}

// ── Convenience helpers ───────────────────────────────────────────
const get  = (path)         => request(path)
const post = (path, data)   => request(path, { method: 'POST',  body: JSON.stringify(data) })
const put  = (path, data)   => request(path, { method: 'PUT',   body: JSON.stringify(data) })
const del  = (path)         => request(path, { method: 'DELETE' })

// ── API surface ───────────────────────────────────────────────────
const api = {

  // ── Health ───────────────────────────────────────────────────
  /**
   * GET /api/health
   * @returns {{ ok: boolean, api: string, database: { ok: boolean, client: string, connectedAt: string } }}
   */
  health: () => get('/api/health'),

  // ── Gallery ──────────────────────────────────────────────────
  gallery: {
    /**
     * GET /api/gallery
     * @returns {{ ok: boolean, items: object[] }}
     */
    list: () => get('/api/gallery'),
  },

  // ── Calendar / Bookings ──────────────────────────────────────
  calendar: {
    /**
     * GET /api/calendar
     * @returns {{ ok: boolean, slots: object[] }}
     */
    list: () => get('/api/calendar'),
  },

  // ── Contact ──────────────────────────────────────────────────
  contact: {
    /**
     * POST /api/contact
     * @param {{ name: string, email: string, message: string, [key: string]: any }} payload
     * @returns {{ ok: boolean, message: string }}
     */
    submit: (payload) => post('/api/contact', payload),
  },

  // ── Admin ────────────────────────────────────────────────────
  admin: {
    /**
     * POST /api/admin/signin
     * Automatically stores the returned token in sessionStorage.
     * @param {{ username: string, password: string }} credentials
     * @returns {{ ok: boolean, token: string }}
     */
    signIn: async (credentials) => {
      const data = await post('/api/admin/signin', credentials)
      if (data?.token) setAdminToken(data.token)
      return data
    },

    /**
     * Sign out — clears the stored token and admin session flags.
     */
    signOut: () => {
      clearAdminToken()
      sessionStorage.removeItem('adminAuth')
    },

    /**
     * GET /api/admin/dash
     * @returns {{ ok: boolean, stats: object }}
     */
    dash: () => get('/api/admin/dash'),

    /**
     * GET /api/admin/deliverables
     * @returns {{ ok: boolean, deliverables: object[] }}
     */
    deliverables: () => get('/api/admin/deliverables'),

    /**
     * GET /api/admin/settings
     * @returns {{ ok: boolean, settings: object }}
     */
    getSettings: () => get('/api/admin/settings'),

    /**
     * PUT /api/admin/settings
     * @param {object} updates
     * @returns {{ ok: boolean, message: string }}
     */
    updateSettings: (updates) => put('/api/admin/settings', updates),
  },
}

export default api
