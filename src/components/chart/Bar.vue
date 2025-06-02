<template>
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </template>
  
  <script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
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
    components: { Bar },
    data() {
        return {
        chartData: {
            labels: this.labels,
            datasets: [
                {
                    label: 'Total Data',
                    data: this.datasets,
                    backgroundColor: '#BF3131',
                    borderRadius: 10
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