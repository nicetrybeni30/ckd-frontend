import { createRouter, createWebHistory } from 'vue-router'

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
  { path: '/patient/dashboard', component: PatientDashboard },
  { path: '/patient/predict', component: PatientPredict },
  { path: '/patient/account', component: PatientAccount },
  { path: '/patient/view-stats', component: PatientViewStats },
  // { path: '/patient/create', component: PatientCreateRecord },
  // { path: '/patient/edit', component: PatientEdit },
  // { path: '/patient/signup', component: PatientSignup },
  // { path: '/patient/complete-profile', component: PatientCompleteProfile },

  { path: '/admin/login', component: AdminLogin },
  { path: '/admin/dashboard', component: AdminDashboard },
  { path: '/admin/patients', component: AdminPatients },
  { path: '/admin/model', component: AdminModel },
  { path: '/admin/records', component: AdminPatientRecords },
  { path: '/admin/create-patient', component: AdminCreatePatient },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
