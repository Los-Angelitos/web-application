<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script>
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

export default {
  name: 'LineChart',
  components: { Line },
  props: {
    incomes: Array,
    expenses: Array,
    labels: Array,
    t: Function
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.t('analytics.line-chart.incomes'),
            data: this.incomes,
            borderColor: '#ff9999',
            tension: 0.4,
            fill: false
          },
          {
            label: this.t('analytics.line-chart.expenses'),
            data: this.expenses,
            borderColor: '#0066cc',
            tension: 0.4,
            fill: false
          }
        ]
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };
    }
  }
};
</script>

<style scoped>
canvas {
  max-height: 100%;
  height: 100%;
}
</style>
