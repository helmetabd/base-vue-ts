<script setup>
const props = defineProps(['data'])

const series = props.data?.series ?? []
const chartOptions = {
    chart: {
        type: 'area',
        toolbar: {
            show: false, // Hide the toolbar
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    colors: ['#289DDE', '#F3B94C'],
    xaxis: {
        categories: props.data?.xaxis ?? [],
    },
    // tooltip: {
    //     x: {
    //         format: 'dd/MM/yy HH:mm'
    //     },
    // },
}
</script>
<template>
    <div id="chart">
        <apexchart height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>