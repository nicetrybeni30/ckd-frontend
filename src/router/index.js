import { createRouter, createWebHistory } from 'vue-router'

// Admin Views
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminPatients from '@/views/admin/AdminPatients.vue'
import AdminModel from '@/views/admin/AdminModel.vue'
import AdminPatientRecords from '@/views/admin/AdminPatientRecords.vue'

// Patient Views
import PatientLogin from '@/views/patient/PatientLogin.vue'
import PatientDashboard from '@/views/patient/PatientDashboard.vue'
import PatientEdit from '@/views/patient/PatientEdit.vue'
import PatientPredict from '@/views/patient/PatientPredict.vue'

const routes = [
  { path: '/', redirect: '/patient/login' },  // Default to patient login

  // Patient routes
  { path: '/patient/login', component: PatientLogin },
  { path: '/patient/dashboard', component: PatientDashboard },
  { path: '/patient/edit', component: PatientEdit },
  { path: '/patient/predict', component: PatientPredict },

  // Admin routes
  { path: '/admin/login', component: AdminLogin },
  { path: '/admin/dashboard', component: AdminDashboard },
  { path: '/admin/patients', component: AdminPatients },
  { path: '/admin/model', component: AdminModel },
  { path: '/admin/records', component: AdminPatientRecords }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
