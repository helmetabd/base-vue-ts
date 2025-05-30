<script setup>
import { resizeHelper } from '@/utils/dashboardHelper';

const props = defineProps(['data', 'label', 'height', 'width', 'hollow'])
const series = [props.data ?? 70]
const height = resizeHelper(props.height ?? 100, 10, 1281)
const width = resizeHelper(props.width ?? 100, 10, 1281)
const chartOptions = {
    chart: {
        type: 'radialBar',
        height: height,
        width: width
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: props.hollow + '%' ?? '50%',
            },
            track: {
                margin: 2
            },
            dataLabels: {
                show: true,
                name: {
                    show: false
                },
                value: {
                    show: true,
                    fontSize: '15px', // Customize size
                    offsetY: 6,
                    fontWeight: 600, // Center the value vertically
                    formatter: (val) => `${val}%`, // Format the value
                },
            },
        },
        labels: props.label ?? ['Speedo'],
    },
}
</script>

<template>
    <div id="chart" class="flex-shrink-0">
        <apexchart type="radialBar" :height="height" :width="width" :options="chartOptions" :series="series">
        </apexchart>
    </div>
</template>