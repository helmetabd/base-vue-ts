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
        type: 'donut',
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
            customScale: 1,
            dataLabels: {
                formatter: (val) => `${val}%`,
                minAngleToShowLabel: 25
            },
            donut: {
                size: '50%'
            }
        },
    },
    colors: [
        '#289DDE',
        '#F3B94C',
        '#4DC6FF',
        '#1C77C3',
        '#F38F60',
        '#F880BC',
        '#DFA72F',
        '#6D63F9'
    ],
    labels: label
}
if (props.noLegend) {
    chartOptions.legend.show = false
}
</script>

<template>
    <div id="chart">
        <h5 v-if="props.title" class="text-center fw-semibold">{{ props.title }}</h5>
        <apexchart class="d-flex justify-content-center" type="donut" :height="height" :width="width"
            :options="chartOptions" :series="series"></apexchart>
    </div>
</template>