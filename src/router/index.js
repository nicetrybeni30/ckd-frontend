import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import AdminPanel from '../views/AdminPanel.vue'
import Edit from '../views/Edit.vue'
import Predict from '../views/Predict.vue'

// Admin Views
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminPatients from '../views/admin/AdminPatients.vue'
import AdminModel from '../views/admin/AdminModel.vue'
import AdminPatientRecords from '../views/admin/AdminPatientRecords.vue' // ✅ this line is important!

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/edit', component: Edit },
  { path: '/predict', component: Predict },

  // Admin routes
  { path: '/admin/dashboard', component: AdminDashboard },
  { path: '/admin/patients', component: AdminPatients },
  { path: '/admin/model', component: AdminModel },
  { path: '/admin/records', component: AdminPatientRecords } // ✅ fixed line
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
