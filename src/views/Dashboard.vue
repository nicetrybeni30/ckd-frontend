<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <Navbar />

      <h1 class="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      <div v-if="userInfo" class="mb-6 bg-white p-4 rounded shadow text-sm text-gray-600">
        <p><strong>Username:</strong> {{ userInfo.username }}</p>
        <p><strong>Email:</strong> {{ userInfo.email }}</p>
        <p><strong>Role:</strong> {{ userInfo.role }}</p>
      </div>

      <!-- Admin Stats -->
      <div v-if="userInfo?.role === 'admin'" class="grid gap-6 md:grid-cols-3">
        <div class="bg-white shadow rounded-xl p-6 text-center">
          <p class="text-sm text-gray-500">Total Patients</p>
          <h2 class="text-2xl font-bold text-blue-600">120</h2>
        </div>
        <div class="bg-white shadow rounded-xl p-6 text-center">
          <p class="text-sm text-gray-500">High Risk Cases</p>
          <h2 class="text-2xl font-bold text-red-500">18</h2>
        </div>
        <div class="bg-white shadow rounded-xl p-6 text-center">
          <p class="text-sm text-gray-500">Model Accuracy</p>
          <h2 class="text-2xl font-bold text-green-600">94%</h2>
        </div>
      </div>

      <!-- Patient Stats -->
      <div v-else-if="userInfo?.role === 'patient'" class="grid gap-6 md:grid-cols-3">
        <div class="bg-white shadow rounded-xl p-6 text-center">
          <p class="text-sm text-gray-500">🕒 Last Predicted</p>
          <h2 class="text-md font-semibold text-gray-600">
            {{ patientData?.last_predicted_at ? formatDate(patientData.last_predicted_at) : 'N/A' }}
          </h2>
        </div>
        <div class="bg-white shadow rounded-xl p-6 text-center">
          <p class="text-sm text-gray-500">📋 Recommendation</p>
          <h2 class="text-md font-semibold text-gray-700">
            {{ patientData?.last_recommendation || 'No data yet' }}
          </h2>
        </div>
        <div class="bg-white shadow rounded-xl p-6 text-center">
          <p class="text-sm text-gray-500">🎯 Confidence</p>
          <h2 class="text-2xl font-bold text-green-600">
            {{ patientData?.last_confidence?.toFixed(2) || '0.00' }}%
          </h2>
        </div>
      </div>

      <div class="mt-10 flex flex-col md:flex-row gap-4">
        <router-link
          to="/predict"
          class="inline-block bg-black text-white py-2 px-4 rounded hover:bg-gray-800 text-center"
        >
          Run Prediction →
        </router-link>

        <router-link
          to="/edit"
          class="inline-block bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900 text-center"
        >
          Edit My Stats ✏️
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import axios from 'axios'

export default {
  components: {
    Navbar
  },
  data() {
    return {
      userInfo: null,
      patientData: null
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    try {
      const userRes = await axios.get('http://localhost:8000/api/patient/me/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.userInfo = userRes.data

      if (this.userInfo.role === 'patient') {
        const recordRes = await axios.get('http://localhost:8000/api/records/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.patientData = recordRes.data
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>
