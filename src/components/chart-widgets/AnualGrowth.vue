<script setup>
const props = defineProps(['data'])

function getCloseMarkers(seriesData, threshold = 5) {
    const growthData = seriesData.series[0].data;
    const totalData = seriesData.series[1].data;
    const closeMarkers = [];

    growthData.forEach((value, index) => {
        const totalValue = totalData[index];
        // Check if the absolute difference is within the threshold
        if (Math.abs(value - totalValue) <= threshold) {
            closeMarkers.push({
                seriesIndex: 0, // Only apply to the line series
                dataPointIndex: index,
                size: 0 // Hide marker at this index
            });
        }
    });

    return closeMarkers;
}

// Calculate close markers based on threshold
const closeMarkers = getCloseMarkers(props.data, 10)

const chartOptions = {
    chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: {
            show: false,
        }
    },
    markers: {
        size: 7,
        discrete: closeMarkers
    },
    dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
        // offsetY: -10, // Adjust the Y offset to avoid marker overlap
        style: {
            colors: ['#404040']
        },
        dropShadow: {
            enabled: true
        },
    },
    colors: ['#289DDE', '#F3B94C'],
    stroke: {
        width: 4
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            dataLabels: {
                position: 'top',
            }
        }
    },
    xaxis: {
        categories: props.data?.xaxis,
    },
    yaxis: [
        {
            seriesName: 'Growth',
            show: false,
            opposite: true,
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
                color: '#289DDE'
            },
            labels: {
                style: {
                    colors: '#289DDE',
                }
            },
            title: {
                text: "Growth",
                style: {
                    color: '#289DDE',
                }
            },
        },
        {
            seriesName: 'Total',
            opposite: true,
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
            },
            labels: {
                style: {
                    colors: '#F3B94C',
                },
            },
        },
    ],
    tooltip: {
        fixed: {
            enabled: true,
            position: 'topLeft',
            offsetY: 30,
            offsetX: 60
        },
    },
    legend: {
        horizontalAlign: 'left',
        offsetX: 40
    },
    responsive: [
        {
            breakpoint: 1400,
            options: {
                yaxis: {
                    show: false
                }
            }
        }
    ]
};

</script>

<template>
    <div id="chart">
        <apexchart type="line" height="350" :options="chartOptions" :series="props.data?.series"></apexchart>
    </div>
</template>