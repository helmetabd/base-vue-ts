<script setup>
const props = defineProps(['data'])
const series = [{
    data: props.data?.series ?? []
}]
const chartOptions = {
    chart: {
        type: 'bar',
        height: 350,
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            horizontal: true,
            dataLabels: {
                position: 'center', // Positioning data labels at the top
                offsetX: 100, // Adjust this value for horizontal offset
            }
        }
    },
    colors: ['#289DDE'],
    dataLabels: {
        enabled: true,
        style: {
            colors: ['#ffffff']
        },
        dropShadow: {
            enabled: true
        }
    },
    xaxis: {
        categories: props.data.xaxis ?? [],
    },
    tooltip: {
        y: {
            title: {
                formatter: function () {
                    return "Employee Count: ";
                },
            },
        }
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        horizontal: false
                    }
                },
            }
        }
    ]
}
</script>
<template>
    <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
</template>