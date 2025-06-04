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
          <LineChart :chart-data="lineChartData" :chart-options="lineChartOptions" />
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
      barChartData: {   // 🆕
        labels: [],
        datasets: [{
          label: 'Patients Count',
          data: [],
          backgroundColor: ['#3b82f6', '#10b981']  // Blue and Green
        }]
      },
      barChartOptions: { // 🆕
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    }
  },
  async mounted() {
    await this.fetchDashboardData()
    await this.fetchRetrainHistory()
    await this.fetchCKDDistribution()
  },
  methods: {
    async fetchDashboardData() {
      const token = localStorage.getItem('token')
      try {
        const usersRes = await axios.get('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const patients = usersRes.data.filter(user => user.role === 'patient')
        this.totalPatients = patients.length

        const modelRes = await axios.get('http://localhost:8000/api/model-info/', {
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
        const res = await axios.get('http://localhost:8000/api/retrain-history/', {
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
    async fetchCKDDistribution() {   // 🆕
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get('http://localhost:8000/api/ckd-distribution/', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const labels = res.data.map(item => item.classification)
        const counts = res.data.map(item => item.total)

        this.barChartData.labels = labels
        this.barChartData.datasets[0].data = counts
      } catch (err) {
        console.error(' Failed to fetch CKD distribution:', err)
      }
    }
  }
}
</script>

<style scoped>
</style>
