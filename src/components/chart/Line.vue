<template>
    <Line
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </template>
  
  <script>
  import { Line } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)
  
  export default {
    name: 'LineChart',
    props: {
        labels: {
            type: Object,
            default: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agus', 'Sep', 'Okt', 'Nov', 'Des']
        },
        datasets: {
            type: Array,
            default: []
        }
    },
    components: { Line },
    data() {
      return {
        chartData: {
          labels: this.labels,
          datasets: [
                {
                    label: 'Cubic interpolation (monotone)',
                    data: this.datasets,
                    borderColor: '#091c48',
                    backgroundColor: '#1598966f',
                    fill: true,
                    spanGaps: true,
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4
                }
            ]
        },
        chartOptions: {
            responsive: true,
            aintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                    },
                }
            }
        }
      }
    }
  }
  </script>