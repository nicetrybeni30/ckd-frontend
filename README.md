# Chronic Kidney Disease (CKD) Prediction System — Frontend

This project is composed of:

- **Frontend** (this repo): Vue 3 + Vue Router + Tailwind CSS, built with Vite
- **Backend** ([ckd-backend](https://github.com/nicetrybeni30/ckd-backend)): Django REST Framework

---

## 🛠 Requirements

- Node.js 18+ and npm
- The backend running (default `http://localhost:8000`)

---

## ⚙️ Local setup

```bash
git clone git@github.com:nicetrybeni30/ckd-frontend.git
cd ckd-frontend
cp .env.example .env     # point VITE_API_BASE_URL at the backend if not localhost:8000
npm install
npm run dev              # http://localhost:3000
```

The backend must allow this origin. Its default `CORS_ALLOWED_ORIGINS` already includes
`http://localhost:3000`.

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend base URL, no trailing slash |

Vite bakes `VITE_*` values in at **build time**, so set it before `npm run build`.

---

## 🧭 How it works

- **Login**: `/patient/login` and `/admin/login` both get a JWT from `/api/token/`, then check
  the user's role. A patient can't sign in on the admin page, and vice versa.
- **Session**: `src/auth.js` stores the token and role in `localStorage`. Routes have
  `meta.role`, and a guard in `src/router/index.js` redirects signed-out or wrong-role users.
  The role is only for UI routing; the backend checks permissions on every request.
- **Expiry**: access tokens last 60 minutes. A global interceptor in `src/main.js` sends the
  user back to their login page when the API returns 401.
- **API calls**: pages call `axios` with `${API_BASE_URL}` from `src/config.js`.
  `src/utils/apiError.js` turns backend errors into readable messages.

---

## ✅ Tests

```bash
npm test     # Node's built-in test runner, no extra dependencies
```

Covers `src/auth.js` (session storage, route-guard decisions incl. the tampered-role case,
session-expiry detection) and `src/utils/apiError.js` (error messages and safe logging).
Vue components are not covered yet (no component test tooling installed).

**Logging rule:** never `console.log`/`console.error` a raw axios error or response. They
contain the request body (passwords, lab values) and the `Authorization` header. Use
`logApiError(context, error)` from `src/utils/apiError.js`.

---

## 📦 Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the build locally to check it
```

Deploying (not yet tested on a real host): `dist/` is a static site (Vercel, Netlify,
GitHub Pages, Nginx). Because it uses HTML5 history routing, configure the host to serve
`index.html` for unknown paths, so refreshing `/admin/dashboard` doesn't 404.

---

## 🚧 Known gaps / next steps

- **No component tests or linter config yet.** `npm test` covers the auth and error helpers only.
  Suggested next: Vitest + Vue Test Utils for components, and ESLint with `eslint-plugin-vue`.
- **Pages use raw `axios`** with headers added by hand. `src/axios.js` (`this.$api`) has a
  shared instance with a JWT interceptor that pages could move to, one page at a time.
  Watch out: it sends `withCredentials` and redirects on 401.
- **No token refresh.** The backend issues refresh tokens, but the app only stores the
  access token, so users are logged out after 60 minutes.
- **Token in `localStorage`** is readable by any script on the page (XSS risk). An
  httpOnly-cookie flow would be safer but needs backend changes.
- **Accessibility**: login, account and patient-edit forms have linked labels. The
  record-editing forms built with `v-for` still need it.
- **Unused code**: `src/components/EditPatientModal.vue` is not used anywhere, and the
  signup / create-record / complete-profile routes are commented out in the router.
  Decide whether to restore or delete them.
- **Visual design** was not reworked in this pass. Changes were limited to what could be
  checked without running the app.
