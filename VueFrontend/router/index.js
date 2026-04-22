/**
 * router/index.js
 * ─────────────────────────────────────────────────────────────────
 * Vue Router route table for JayxCreatez Productions.
 *
 * Public routes  →  /  /gallery  /calendar  /contact  /delivery/:id
 * Admin routes   →  /adminsignin  /admindash  /deliverables  /adminsettings
 *
 * Admin guard: any /admin* route redirects to /adminsignin when
 * sessionStorage.adminAuth !== '1' (each admin page also guards
 * itself on mount, but this gives a router-level first line).
 * ─────────────────────────────────────────────────────────────────
 */

import { createRouter, createWebHistory } from 'vue-router'

// ── Page imports (lazy-loaded for faster initial paint) ───────────
const Homepage      = () => import('../pages/homepage.vue')
const Gallery       = () => import('../pages/gallery.vue')
const Calendar      = () => import('../pages/calendar.vue')
const Contact       = () => import('../pages/contact.vue')
const Delivery      = () => import('../pages/delivery.vue')
const AdminSignIn   = () => import('../pages/adminsignin.vue')
const AdminDash     = () => import('../pages/admindash.vue')
const Deliverables  = () => import('../pages/deliverables.vue')
const AdminSettings = () => import('../pages/adminsettings.vue')

// ── Route definitions ─────────────────────────────────────────────
const routes = [
  // Public
  { path: '/',              component: Homepage,      meta: { title: 'JayxCreatez Productions'         } },
  { path: '/gallery',       component: Gallery,       meta: { title: 'Gallery · JayxCreatez'           } },
  { path: '/calendar',      component: Calendar,      meta: { title: 'Book a Session · JayxCreatez'    } },
  { path: '/contact',       component: Contact,       meta: { title: 'Contact · JayxCreatez'           } },
  { path: '/delivery/:token',  component: Delivery,      meta: { title: 'Your Gallery · JayxCreatez'      } },

  // Admin
  { path: '/adminsignin',   component: AdminSignIn,   meta: { title: 'Admin Sign In · JayxCreatez'     } },
  { path: '/admindash',     component: AdminDash,     meta: { title: 'Dashboard · JayxCreatez Admin',   requiresAuth: true } },
  { path: '/deliverables',  component: Deliverables,  meta: { title: 'Deliverables · JayxCreatez Admin', requiresAuth: true } },
  { path: '/adminsettings', component: AdminSettings, meta: { title: 'Settings · JayxCreatez Admin',    requiresAuth: true } },

  // Catch-all → home
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

// ── Router instance ───────────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Restore scroll position on navigation
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash)       return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// ── Navigation guard — admin auth ─────────────────────────────────
router.beforeEach((to, _from, next) => {
  // Update document title
  if (to.meta?.title) document.title = to.meta.title

  // Protect admin routes
  if (to.meta?.requiresAuth && sessionStorage.getItem('adminAuth') !== '1') {
    next({ path: '/adminsignin' })
  } else {
    next()
  }
})

export default router
