<template>
  <nav class="bg-black text-white p-4 shadow">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-lg font-bold">CKD Early Warning System</h1>

      <div class="flex space-x-4">
        <router-link v-if="userRole === 'admin'" to="/admin/dashboard" class="hover:underline">Dashboard</router-link>
        <router-link v-if="userRole === 'admin'" to="/admin/patients" class="hover:underline">Patients</router-link>
        <router-link v-if="userRole === 'admin'" to="/admin/records" class="hover:underline">Records</router-link>
        <router-link v-if="userRole === 'admin'" to="/admin/model" class="hover:underline">Model</router-link>

        <router-link v-if="userRole === 'patient'" to="/patient/dashboard" class="hover:underline">Dashboard</router-link>
        <router-link v-if="userRole === 'patient'" to="/patient/predict" class="hover:underline">Predict</router-link>
        <router-link v-if="userRole === 'patient'" to="/patient/account" class="hover:underline">Account</router-link>

        <button v-if="userRole" @click="logout" class="hover:underline">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      userRole: null
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    if (!token) {
      return  // 🛑 No token = don't fetch user info
    }

    try {
      const res = await axios.get('http://localhost:8000/api/patient/me/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      this.userRole = res.data.role
    } catch (error) {
      console.error('Navbar failed to load user info:', error)
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.userRole = null
      this.$router.push('/patient/login')
    }
  }
}
</script>
