# JayxCreatez Productions — Admin Frontend

A photography business admin frontend built with **Vue 3** + **Vite** + **Vue Router**. Includes a public-facing website and a password-protected admin dashboard.

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/gallery` | Photo gallery with filters |
| `/calendar` | Client booking flow (3-step) |
| `/contact` | Contact / inquiry form |
| `/adminsignin` | Admin login |
| `/admindash` | Admin dashboard — appointments, messages, analytics |
| `/deliverables` | Build & send client packages |
| `/adminsettings` | Manage credentials and services |

---

## Prerequisites

Make sure you have these installed before getting started:

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

---

## Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/tebell0/FAConsulting.git
cd FAConsulting
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the dev server**
```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Other Commands

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Admin Access

The admin area is protected. Use these default credentials on the sign-in page (`/adminsignin`):

- **Email:** `jalen@jayxcreatez.com`
- **Password:** `password`

> Credentials can be changed from the Settings page once logged in. They are stored in `localStorage` and are specific to your browser.

---

## Tech Stack

- [Vue 3](https://vuejs.org/) — Composition API (`<script setup>`)
- [Vue Router 4](https://router.vuejs.org/) — client-side routing
- [Vite](https://vitejs.dev/) — build tool and dev server
- Google Fonts — Cormorant Garamond + DM Sans
- `localStorage` / `sessionStorage` — auth and data persistence (no backend)
