<template>
  <nav class="bg-black text-white p-4 shadow">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-lg font-bold">CKD Early Warning System</h1>
      <div class="flex space-x-4">
        <!-- Admin Nav Links -->
        <router-link v-if="userRole === 'admin'" to="/admin/dashboard" class="hover:underline">Dashboard</router-link>
        <router-link v-if="userRole === 'admin'" to="/admin/patients" class="hover:underline">Patients</router-link>
        <router-link v-if="userRole === 'admin'" to="/admin/records" class="hover:underline">Patient Records</router-link>
        <router-link v-if="userRole === 'admin'" to="/admin/model" class="hover:underline">Model Training</router-link>

        <!-- Patient Nav Links -->
        <router-link v-if="userRole !== 'admin'" to="/patient/dashboard" class="hover:underline">Dashboard</router-link>
        <router-link v-if="userRole !== 'admin'" to="/patient/predict" class="hover:underline">Predict</router-link>

        <!-- Logout Button -->
        <button @click="logout" class="hover:underline">Logout</button>
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
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:8000/api/patient/me/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      this.userRole = res.data.role
    } catch (e) {
      this.userRole = null
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      const role = this.userRole
      this.userRole = null

      if (role === 'admin') {
        this.$router.push('/admin/login')
      } else {
        this.$router.push('/patient/login')
      }
    }
  }
}
</script>
