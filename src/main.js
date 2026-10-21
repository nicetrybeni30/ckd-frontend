import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import { getToken, getRole, clearSession, loginPathFor, isExpiredSessionError } from './auth'

import api from './axios'

// When a signed-in user's token expires (or becomes invalid), the API answers
// 401. Clear the stale session and send them back to their login page instead
// of leaving the page half-broken. Login requests themselves are skipped so a
// wrong password still shows the normal error.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isExpiredSessionError(error, getToken())) {
      const loginPath = loginPathFor(getRole())
      clearSession()
      router.push(loginPath)
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)

// para accessible sa buong app as this.$api
app.config.globalProperties.$api = api

app.use(router).mount('#app')
