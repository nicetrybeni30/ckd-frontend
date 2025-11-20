import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

import api from './axios'

const app = createApp(App)

// para accessible sa buong app as this.$api
app.config.globalProperties.$api = api 

app.use(router).mount('#app')