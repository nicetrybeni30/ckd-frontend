<template>
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h2 class="text-2xl font-bold text-blue-600 mb-4">CKD Prediction</h2>
  
        <div v-if="loading" class="text-gray-500">Loading prediction...</div>
  
        <div v-else>
          <div class="mb-6">
            <p><strong>Prediction:</strong> {{ result.prediction }}</p>
            <p><strong>CKD Stage:</strong> {{ result.ckd_stage }}</p>
            <p><strong>Recommendation:</strong> {{ result.recommendation }}</p>
          </div>
  
          <div class="bg-gray-50 p-4 rounded border mb-6">
            <p class="text-lg font-semibold text-gray-700 mb-1">🔍 Model Insights:</p>
            <p><strong>🧠 Model Accuracy:</strong> {{ result.model_accuracy }}%</p>
            <p><strong>🎯 Confidence:</strong> {{ result.confidence }}%</p>
            <p><strong>📅 Last Retrained:</strong> {{ result.retrained_at }}</p>
          </div>
  
          <div
            v-if="result.risk_flags && result.risk_flags.length"
            class="bg-red-50 p-4 rounded border border-red-300 mb-6"
          >
            <p class="text-lg font-semibold text-red-700 mb-1">🚨 Risk Flags:</p>
            <ul class="list-disc ml-6 text-red-600">
              <li v-for="(flag, index) in result.risk_flags" :key="index">{{ flag }}</li>
            </ul>
          </div>
  
          <router-link to="/dashboard" class="text-blue-600 hover:underline">
            ← Back to Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        result: {},
        loading: true
      }
    },
    async mounted() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:8000/api/predict/', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.result = response.data
      } catch (error) {
        console.error("Prediction failed:", error)
        this.result = { prediction: 'Error', recommendation: 'Something went wrong.' }
      } finally {
        this.loading = false
      }
    }
  }
  </script>
  
  <style scoped>
  p {
    margin-bottom: 0.5rem;
  }
  </style>
  