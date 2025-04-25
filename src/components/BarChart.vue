<template>
    <div class="bg-white p-4 rounded shadow">
      <canvas ref="barChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables)
  
  export default {
    name: 'BarChart',
    data() {
      return {
        chartInstance: null
      }
    },
    mounted() {
      this.renderChart()
    },
    beforeUnmount() {
      if (this.chartInstance) {
        this.chartInstance.destroy()
      }
    },
    methods: {
      renderChart() {
        this.chartInstance = new Chart(this.$refs.barChart, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
              label: 'Predictions',
              data: [30, 42, 18, 56, 33],
              backgroundColor: '#3b82f6'
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        })
      }
    }
  }
  </script>
  