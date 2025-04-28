<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="p-6 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <!-- Summary Cards -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-sm text-gray-500">Total Patients</p>
          <h2 class="text-2xl font-bold text-blue-600">120</h2> <!-- Dynamic later -->
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-sm text-gray-500">Model Accuracy</p>
          <h2 class="text-2xl font-bold text-green-600">94%</h2> <!-- Dynamic later -->
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-sm text-gray-500">Last Retrained</p>
          <h2 class="text-md font-semibold">April 18, 2025</h2> <!-- Dynamic later -->
        </div>
      </div>

      <!-- Charts -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold mb-2">CKD Stage Distribution</h3>
          <BarChart />
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold mb-2">Confidence Over Time</h3>
          <LineChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import BarChart from '@/components/BarChart.vue'
import LineChart from '@/components/LineChart.vue'

export default {
  components: {
    Navbar,
    BarChart,
    LineChart
  }
}
</script>

<style scoped>
</style>
