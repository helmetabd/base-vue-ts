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
                position: 'top', // Positioning data labels at the top
                // offsetX: 100, // Adjust this value for horizontal offset
            }
        }
    },
    colors: ['#289DDE'],
    dataLabels: {
        enabled: true,
        offsetX: 18,
        style: {
            colors: ['#ffffff']
        },
        background: {
            enabled: true,
            foreColor: '#404040',
            // borderColor: '#fff',
            padding: 5,
            borderRadius: 0,
            borderWidth: 0,
            borderColor: "#ffffff",
            opacity: 1,
        },
        dropShadow: {
            enabled: true
        }
    },
    xaxis: {
        categories: props.data.xaxis ?? []
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
                dataLabels: {
                    offsetY: -18,
                    offsetX: 0,
                }
            }
        }
    ]
}
</script>
<template>
    <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
</template>