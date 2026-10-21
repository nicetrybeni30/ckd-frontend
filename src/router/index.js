import { createRouter, createWebHistory } from 'vue-router'
import { getToken, getRole, guardRedirect } from '@/auth'

// Patient
import PatientLogin from '@/views/patient/PatientLogin.vue'
import PatientDashboard from '@/views/patient/PatientDashboard.vue'
import PatientViewStats from '@/views/patient/PatientViewStats.vue'
import PatientAccount from '@/views/patient/PatientAccount.vue'
import PatientPredict from '@/views/patient/PatientPredict.vue'
// import PatientCreateRecord from '@/views/patient/PatientCreateRecord.vue'
// import PatientEdit from '@/views/patient/PatientEdit.vue'
// import PatientSignup from '@/views/patient/PatientSignup.vue'
// import PatientCompleteProfile from '@/views/patient/PatientCompleteProfile.vue'


// Admin
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminPatients from '@/views/admin/AdminPatients.vue'
import AdminModel from '@/views/admin/AdminModel.vue'
import AdminPatientRecords from '@/views/admin/AdminPatientRecords.vue'
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminCreatePatient from '@/views/admin/AdminCreatePatient.vue'
const routes = [
  { path: '/', redirect: '/patient/login' },

  { path: '/patient/login', component: PatientLogin },
  { path: '/patient/dashboard', component: PatientDashboard, meta: { role: 'patient' } },
  { path: '/patient/predict', component: PatientPredict, meta: { role: 'patient' } },
  { path: '/patient/account', component: PatientAccount, meta: { role: 'patient' } },
  { path: '/patient/view-stats', component: PatientViewStats, meta: { role: 'patient' } },
  // { path: '/patient/create', component: PatientCreateRecord },
  // { path: '/patient/edit', component: PatientEdit },
  // { path: '/patient/signup', component: PatientSignup },
  // { path: '/patient/complete-profile', component: PatientCompleteProfile },

  { path: '/admin/login', component: AdminLogin },
  { path: '/admin/dashboard', component: AdminDashboard, meta: { role: 'admin' } },
  { path: '/admin/patients', component: AdminPatients, meta: { role: 'admin' } },
  { path: '/admin/model', component: AdminModel, meta: { role: 'admin' } },
  { path: '/admin/records', component: AdminPatientRecords, meta: { role: 'admin' } },
  { path: '/admin/create-patient', component: AdminCreatePatient, meta: { role: 'admin' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Send users to the right login page if they are not signed in, and keep
// patients out of admin pages (and vice versa).
router.beforeEach((to) => guardRedirect(to.meta.role, getToken(), getRole()))

export default router
