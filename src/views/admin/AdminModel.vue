<template>
    <div class="min-h-screen p-6 bg-gray-100">
      <div class="max-w-4xl mx-auto">
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
              class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              @click="retrainModel"
            >
              Retrain Model 🔁
            </button>
          </div>
        </div>
  
        <div v-if="log" class="bg-white p-4 rounded shadow text-sm text-gray-700">
          <p><strong>Log:</strong></p>
          <pre>{{ log }}</pre>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        modelAccuracy: 'N/A',
        retrainedAt: 'Unknown',
        log: ''
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
        }
      },
      async retrainModel() {
        try {
          const res = await fetch('http://localhost:8000/api/retrain/', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          const data = await res.text()
          this.log = data
          await this.fetchModelInfo() // refresh info after retraining
        } catch (e) {
          this.log = 'Failed to retrain model.'
        }
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  