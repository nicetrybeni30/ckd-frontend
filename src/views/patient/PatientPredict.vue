<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="p-6 max-w-3xl mx-auto">

      <div class="bg-white p-8 rounded-xl shadow-lg mt-8">
        <h2 class="text-2xl font-bold text-blue-600 mb-6 text-center">CKD Prediction Results</h2>

        <div v-if="loading" class="text-gray-500 text-center text-lg">Loading prediction...</div>

        <div v-else>
          <div class="space-y-4 mb-8">
            <div>
              <p class="text-sm text-gray-500">Prediction</p>
              <h2 class="text-lg font-semibold">{{ result.prediction }}</h2>
            </div>
            <div>
              <p class="text-sm text-gray-500">CKD Stage</p>
              <h2 class="text-lg font-semibold">{{ result.ckd_stage }}</h2>
            </div>
            <div>
              <p class="text-sm text-gray-500">Recommendation</p>
              <h2 class="text-md font-medium text-gray-700">{{ result.recommendation }}</h2>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded border mb-8">
            <p class="text-lg font-semibold text-gray-700 mb-2">🔍 Model Insights:</p>
            <p class="text-sm"><strong>🧠 Model Accuracy:</strong> {{ result.model_accuracy }}%</p>
            <p class="text-sm"><strong>🎯 Confidence:</strong> {{ result.confidence }}%</p>
            <p class="text-sm"><strong>📅 Last Retrained:</strong> {{ result.retrained_at }}</p>
          </div>

          <div v-if="result.risk_flags && result.risk_flags.length" class="bg-red-50 p-6 rounded border border-red-300 mb-6">
            <p class="text-lg font-semibold text-red-700 mb-2">🚨 Risk Flags:</p>
            <ul class="list-disc ml-6 text-red-600 text-sm">
              <li v-for="(flag, index) in result.risk_flags" :key="index">{{ flag }}</li>
            </ul>
          </div>

          <div class="flex justify-center gap-4 mt-8">
            <BackButton />
            <button @click="refreshPrediction" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              🔄 Run Again
            </button>
          </div>
        </div>

        <div v-if="showToast" class="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-bounce">
          ✅ Prediction Updated!
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import BackButton from '@/components/BackButton.vue'
import axios from 'axios'

export default {
  components: { Navbar, BackButton },
  data() {
    return {
      result: {},
      loading: true,
      showToast: false
    }
  },
  async mounted() {
    this.fetchPrediction()
  },
  methods: {
    async fetchPrediction() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:8000/api/predict/', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.result = response.data
        this.showSuccessToast()
      } catch (error) {
        console.error("Prediction failed:", error)
        this.result = { prediction: 'No Record Found', recommendation: 'Please complete your health profile first.' }
      } finally {
        this.loading = false
      }
    },
    refreshPrediction() {
      this.fetchPrediction()
    },
    showSuccessToast() {
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 2000)
    }
  }
}
</script>

<style scoped>
p {
  margin-bottom: 0.5rem;
}
</style>
