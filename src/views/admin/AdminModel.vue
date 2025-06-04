<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Model Training</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-4 rounded shadow">
          <p class="text-sm text-gray-500">Model Accuracy</p>
          <h2 class="text-xl font-bold text-green-600">{{ modelAccuracy }}%</h2>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <p class="text-sm text-gray-500">Last Retrained</p>
          <h2 class="text-md">{{ retrainedAt }}</h2>
        </div>
        <div class="bg-white p-4 rounded shadow flex items-center justify-center">
          <button
            class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            @click="startRetrain"
            :disabled="isRetraining"
          >
            <svg
              v-if="isRetraining"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            {{ isRetraining ? 'Retraining...' : 'Retrain Model ' }}
          </button>
        </div>
      </div>

      <div v-if="isRetraining" id="progressBar" class="mt-4">
        <div class="w-full bg-gray-200 h-4 rounded">
          <div
            class="h-full bg-blue-500 rounded transition-all duration-300"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
        <p v-if="progressPercent > 0" class="text-sm text-gray-700 mt-2">
          {{ progressPercent.toFixed(1) }}% complete • ~{{ secondsLeft }}s left
        </p>
      </div>

      <div v-if="log" class="bg-white p-4 rounded shadow text-sm text-gray-700 mt-6">
        <p><strong>Log:</strong></p>
        <pre>{{ log }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      modelAccuracy: 'N/A',
      retrainedAt: 'Unknown',
      log: '',
      isRetraining: false,
      progressPercent: 0,
      secondsLeft: 0,
      interval: null,
      timeoutId: null,
      fakeFinalDelay: false
    }
  },
  async mounted() {
    await this.fetchModelInfo()
  },
  methods: {
    async fetchModelInfo() {
      try {
        const res = await fetch('http://localhost:8000/api/model-info/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await res.json()
        this.modelAccuracy = data.model_accuracy || 'N/A'
        this.retrainedAt = data.retrained_at || 'Unknown'
      } catch (e) {
        this.modelAccuracy = 'N/A'
        this.retrainedAt = 'Unknown'
        this.log += ' Failed to fetch model info.\n'
      }
    },
    async startRetrain() {
      if (this.isRetraining) return

      this.isRetraining = true
      this.progressPercent = 0
      this.secondsLeft = 0
      this.log = ' Starting model retraining...\n'

      this.$nextTick(() => {
        const el = document.getElementById('progressBar')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      })

      try {
        await fetch('http://localhost:8000/api/retrain/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        this.interval = setInterval(this.pollProgress, 1000)

        this.timeoutId = setTimeout(() => {
          if (this.isRetraining) {
            clearInterval(this.interval)
            this.isRetraining = false
            this.log += ' Training timed out after 10 minutes.\n'
            alert(' Training took too long and was auto-stopped.')
          }
        }, 600000) // 10 mins max
      } catch (err) {
        this.log += ' Failed to trigger retraining.\n'
        this.isRetraining = false
      }
    },
    async pollProgress() {
      try {
        const res = await fetch('http://localhost:8000/api/retrain_progress/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!res.ok) throw new Error(`Status ${res.status}`)

        const data = await res.json()

        // Only allow the frontend to increase gradually, not jump
        if (data.percent > this.progressPercent) {
          this.progressPercent = Math.min(data.percent, 99.9)
        }
        this.secondsLeft = data.seconds_left
        this.log = ` Training in progress... (${data.percent.toFixed(1)}%)\n`

        // Backend might already be done, so fake delay final jump
        if (data.percent >= 100 && !this.fakeFinalDelay) {
          this.fakeFinalDelay = true
          setTimeout(async () => {
            this.progressPercent = 100
            clearInterval(this.interval)
            clearTimeout(this.timeoutId)
            this.isRetraining = false
            this.fakeFinalDelay = false
            this.log = ` Model retraining complete at ${new Date().toLocaleString()}\n`
            await this.fetchModelInfo()
          }, 1500) // 1.5s realistic final delay
        }
      } catch (err) {
        clearInterval(this.interval)
        clearTimeout(this.timeoutId)
        this.isRetraining = false
        this.log += ` Error polling progress: ${err.message}\n`
      }
    }
  },
  beforeUnmount() {
    if (this.interval) clearInterval(this.interval)
    if (this.timeoutId) clearTimeout(this.timeoutId)
  }
}
</script>

<style scoped>
/* Add smooth transition to progress bar */
#progressBar .bg-blue-500 {
  transition: width 0.8s ease-in-out;
}
</style>
