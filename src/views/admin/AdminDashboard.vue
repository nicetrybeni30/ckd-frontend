<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="mt-6 p-6 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <!-- Summary Cards -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-sm text-gray-500">Total Patients</p>
          <h2 class="text-2xl font-bold text-blue-600">{{ totalPatients }}</h2>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-sm text-gray-500">Model Accuracy</p>
          <h2 class="text-2xl font-bold text-green-600">{{ modelAccuracy }}%</h2>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-sm text-gray-500">Last Retrained</p>
          <h2 class="text-md font-semibold">{{ lastRetrained }}</h2>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold mb-2">CKD Stage Distribution</h3>
          <BarChart :chart-data="barChartData" :chart-options="barChartOptions" />
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold mb-2">Confidence Over Time</h3>
          <LineChart 
            :chart-data="lineChartData" 
            :chart-options="lineChartOptions"
          />
        </div>
      </div>

      <!-- Progression Forecast Chart -->
      <div class="mt-6 bg-white p-4 rounded shadow">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h3 class="text-lg font-semibold">CKD Progression Forecast (Next 5 Years)</h3>
          <div v-if="forecastPatients.length" class="flex items-center gap-2">
            <label for="forecast-patient" class="text-sm text-gray-600">Patient</label>
            <select
              id="forecast-patient"
              v-model="selectedForecastUser"
              @change="fetchForecast"
              class="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="p in forecastPatients" :key="p.id" :value="p.id">{{ p.username }}</option>
            </select>
          </div>
        </div>
        <p v-if="forecastMessage" class="text-sm text-gray-500 mb-2">{{ forecastMessage }}</p>

        <!-- Responsive chart container -->
        <div class="w-full">
          <LineChart 
            :chart-data="forecastChart" 
            :chart-options="forecastChartOptions"
            class="max-h-[260px] sm:max-h-[300px] md:max-h-[320px]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import BarChart from '@/components/BarChart.vue'
import LineChart from '@/components/LineChart.vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

export default {
  components: {
    Navbar,
    BarChart,
    LineChart
  },
  data() {
    return {
      totalPatients: 0,
      modelAccuracy: 'N/A',
      lastRetrained: 'N/A',
      lineChartData: {
        labels: [],
        datasets: [{
          label: 'Model Confidence (%)',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: '#93c5fd',
          tension: 0.4,
          fill: true
        }]
      },
      lineChartOptions: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          y: { min: 0, max: 100, ticks: { stepSize: 10 } }
        }
      },

      barChartData: {   
        labels: [],
        datasets: [{
          label: 'Patients Count',
          data: [],
          backgroundColor: ['#3b82f6', '#10b981']
        }]
      },

      barChartOptions: { 
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true }
        }
      },
      // Patients with a health record, for the forecast picker
      forecastPatients: [],
      selectedForecastUser: null,
      forecastMessage: '',
      // Forecast Chart (Missing before)
      forecastChart: {
        labels: [],
        datasets: [{
          label: "CKD Progression (%)",
          data: [],
          borderColor: "#ef4444",
          backgroundColor: "#fecaca",
          tension: 0.4,
          fill: true
        }]
      },
      // 🆕 ADD THIS
      forecastChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        tension: 0.3,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20 }
          }
        }
      },
    }
  },
  async mounted() {
    await this.fetchDashboardData()
    await this.fetchRetrainHistory()
    await this.fetchCKDDistribution()
    await this.fetchForecastPatients()
  },

  methods: {

    async fetchDashboardData() {
      const token = localStorage.getItem('token')
      try {
        const usersRes = await axios.get(`${API_BASE_URL}/api/users/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const patients = usersRes.data.filter(user => user.role === 'patient')
        this.totalPatients = patients.length

        const modelRes = await axios.get(`${API_BASE_URL}/api/model-info/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.modelAccuracy = modelRes.data.model_accuracy || 'N/A'
        this.lastRetrained = modelRes.data.retrained_at || 'N/A'
      } catch (err) {
        console.error(' Failed to fetch dashboard data:', err)
      }
    },

    async fetchRetrainHistory() {
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(`${API_BASE_URL}/api/retrain-history/`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const labels = res.data.map(item => item.date)
        const data = res.data.map(item => item.accuracy)

        this.lineChartData.labels = labels
        this.lineChartData.datasets[0].data = data
      } catch (err) {
        console.error(' Failed to fetch retrain history:', err)
      }
    },

    async fetchCKDDistribution() {   
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(`${API_BASE_URL}/api/ckd-distribution/`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const labels = res.data.map(item => item.classification)
        const counts = res.data.map(item => item.total)

        this.barChartData.labels = labels
        this.barChartData.datasets[0].data = counts
      } catch (err) {
        console.error(' Failed to fetch CKD distribution:', err)
      }
    },

    // 🆕 NEW METHOD
    // Previously the forecast was hardcoded to user id 1 (usually the admin,
    // who has no record). Let the admin pick a patient instead.
    async fetchForecastPatients() {
      const token = localStorage.getItem("token")
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users-with-records/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.forecastPatients = res.data.filter(p => p.record)
        if (this.forecastPatients.length) {
          this.selectedForecastUser = this.forecastPatients[0].id
          await this.fetchForecast()
        } else {
          this.forecastMessage = 'No patients with health records yet.'
        }
      } catch (err) {
        console.error(" Failed to fetch patients for forecast:", err)
        this.forecastMessage = 'Could not load patients for the forecast.'
      }
    },

    async fetchForecast() {
      if (!this.selectedForecastUser) return
      const token = localStorage.getItem("token")
      this.forecastMessage = ''
      try {
        const res = await axios.get(`${API_BASE_URL}/api/progression/${this.selectedForecastUser}/`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.forecastChart.labels = res.data.forecast.map(item => item.year)
        this.forecastChart.datasets[0].data = res.data.forecast.map(item => item.severity)

      } catch (err) {
        console.error(" Failed to fetch forecast:", err)
        this.forecastMessage = 'Could not load the forecast for this patient.'
      }
    }

  }
}
</script>

<style scoped>
</style>
