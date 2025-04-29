<template>
  <div class="bg-white p-4 rounded shadow">
    <canvas v-if="canvasReady" ref="lineChart"></canvas> <!-- 🆕 Only render if canvas is ready -->
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'LineChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartInstance: null,
      canvasReady: false  // 🆕
    }
  },
  mounted() {
    this.canvasReady = true  // 🆕 after mount
  },
  watch: {
    chartData: {
      handler() {
        if (this.canvasReady) {
          if (this.chartInstance) {
            this.chartInstance.data = this.chartData
            this.chartInstance.options = this.chartOptions
            this.chartInstance.update()
          } else {
            this.renderChart()
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }
  },
  methods: {
    renderChart() {
      if (this.$refs.lineChart) {
        this.chartInstance = new Chart(this.$refs.lineChart, {
          type: 'line',
          data: this.chartData,
          options: this.chartOptions
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
