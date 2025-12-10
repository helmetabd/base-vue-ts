<script setup lang="ts">
import { computed, toRefs } from 'vue'

interface Titles {
  title?: string
  label?: string
}

const props = defineProps<{
  rerender?: boolean
  data?: number[]
  titles?: Titles
  body?: string
  icon?: string
  color?: string
}>()

const { data, titles, icon, color } = toRefs(props)

const series = computed(() => [
  {
    name: 'Revenue',
    data: data.value ?? [],
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 350,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    labels: {
      show: false,
    },
    type: 'label',
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  tooltip: {
    x: {
      format: 'MM/yy ',
    },
  },
  colors: [color.value ?? '#008FFB'],
}))
</script>
<template>
  <div class="col-md-4">
    <div class="card card-height-100">
      <div class="card-header align-items-center d-flex">
        <h4 v-if="titles" class="card-title mb-0 flex-grow-1" :style="{ color: color }">
          <i v-if="icon" :class="icon"></i> {{ titles?.title }}
        </h4>
        <div class="text-uppercase pt-1" :style="{ color: color }">
          {{ titles?.label }}
        </div>
      </div>
      <div class="card-body p-0">
        <slot></slot>
        <div class="me-2" id="chartAcq" style="min-height: 215px">
          <apexchart class="apex-charts" height="200" dir="ltr" :series="series" :options="chartOptions"></apexchart>
        </div>

        <div class="p-3 pt-0">
          <router-link :to="{ name: 'dashboard' }" class="btn btn-info btn-sm btn-info"
            :style="{ backgroundColor: color, border: 'none' }">
            <i class="ri-database-2-line align-bottom me-1"></i>
            View {{ titles?.title }} Summary
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
