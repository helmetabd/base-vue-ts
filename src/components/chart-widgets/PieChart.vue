<script setup>
import { resizeHelper } from '@/utils/dashboardHelper';

const props = defineProps(['data', 'label', 'height', 'width', 'title', 'noLegend'])
const series = props.data ?? [70]
const label = props.label ?? ['Speedo']
const height = resizeHelper(props.height ?? 100, 15)
const width = resizeHelper(props.width ?? 100, 15)
// const series = [44, 55, 13, 43, 22]
const chartOptions = {
    chart: {
        type: 'pie',
        height: height,
        width: width
    },
    tooltip: {
        y: {
            formatter: function (value) {
                return value + "%";
            }
        }
    },
    legend: {
        position: "bottom",
    },
    plotOptions: {
        pie: {
            dataLabels: {
                formatter: (val) => `${val}%`,
                offset: -10,
                minAngleToShowLabel: 10
            },
        }
    },
    colors: ['#289DDE', '#F3B94C'],
    labels: label,
    responsive: [
        {
            breakpoint: 1400,
            options: {
                legend: {
                    show: false
                }
            }
        }
    ]
}
if (props.noLegend) {
    chartOptions.legend.show = false
}
</script>

<template>
    <div id="chart">
        <apexchart class="d-flex justify-content-center" type="pie" :height="height" :width="width"
            :options="chartOptions" :series="series"></apexchart>
    </div>
</template>