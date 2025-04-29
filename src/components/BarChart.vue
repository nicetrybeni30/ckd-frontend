<template>
  <div class="bg-white p-4 rounded shadow">
    <canvas v-if="canvasReady" ref="barChart"></canvas>  <!-- 🆕 only render if canvas ready -->
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'BarChart',
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
      canvasReady: false  // 🆕 control when canvas exists
    }
  },
  mounted() {
    this.canvasReady = true;  // 🆕 only after mounted, the <canvas> is real
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
      if (this.$refs.barChart) { // 🆕 double check
        this.chartInstance = new Chart(this.$refs.barChart, {
          type: 'bar',
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
