<template>
  <div :class="orgchartContainerClass" @wheel="zoom && zoomHandler" @mouseup="pan && panning && panEndHandler">
    <div class="orgchart" :style="{ transform: transformVal, cursor: cursorVal }" @mousedown="pan && panStartHandler"
      @mousemove="pan && panning && panHandler">
      <organization-chart-node :datasource="props.datasource">
        <template v-for="(_, name) in $slots" v-slot:[name]="scope">
          <slot :name="name" v-bind="scope" />
        </template>
      </organization-chart-node>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import OrganizationChartNode from './OrganizationChartNode.vue'
import type { DepartmentMap } from '@/interfaces/Department'

// Props definition
const props = defineProps<{
  datasource: DepartmentMap
  pan?: boolean
  zoom?: boolean
  zoomoutLimit?: number
  zoominLimit?: number
}>()

// Reactive properties
const orgchartContainerClass = computed(() => 'orgchart-container')
const cursorVal = ref<string>('default')
const panning = ref<boolean>(false)
const startX = ref<number>(0)
const startY = ref<number>(0)
const transformVal = ref<string>('')
const zoomoutLimit = props.zoomoutLimit || 0.5
const zoominLimit = props.zoominLimit || 7

function panEndHandler(): void {
  panning.value = false
  cursorVal.value = 'default'
}
function panHandler(e: MouseEvent | TouchEvent): void {
  let newX = 0
  let newY = 0
  if (!(e as TouchEvent).targetTouches) {
    // pan on desktop
    newX = (e as MouseEvent).pageX - startX.value
    newY = (e as MouseEvent).pageY - startY.value
  } else if ((e as TouchEvent).targetTouches.length === 1) {
    // pan on mobile device
    newX = (e as TouchEvent).targetTouches[0].pageX - startX.value
    newY = (e as TouchEvent).targetTouches[0].pageY - startY.value
  } else if ((e as TouchEvent).targetTouches.length > 1) {
    return
  }

  const matrix = transformVal.value.split(',')
  if (transformVal.value === '') {
    transformVal.value = `matrix(1,0,0,1,${newX},${newY})`
  } else if (transformVal.value.indexOf('3d') === -1) {
    matrix[4] = `${newX}`
    matrix[5] = `${newY})`
  } else {
    matrix[12] = `${newX}`
    matrix[13] = `${newY}`
  }
  transformVal.value = matrix.join(',')
}
function panStartHandler(e: MouseEvent | TouchEvent): void {
  if ((e.target as HTMLElement).closest('.node')) {
    panning.value = false
    return
  } else {
    cursorVal.value = 'move'
    panning.value = true
  }

  let lastX = 0
  let lastY = 0
  if (transformVal.value !== '') {
    const matrix = transformVal.value.split(',')
    if (transformVal.value.indexOf('3d') === -1) {
      lastX = parseInt(matrix[4], 10)
      lastY = parseInt(matrix[5], 10)
    } else {
      lastX = parseInt(matrix[12], 10)
      lastY = parseInt(matrix[13], 10)
    }
  }

  if (!(e as TouchEvent).targetTouches) {
    // pan on desktop
    startX.value = (e as MouseEvent).pageX - lastX
    startY.value = (e as MouseEvent).pageY - lastY
  } else if ((e as TouchEvent).targetTouches.length === 1) {
    // pan on mobile device
    startX.value = (e as TouchEvent).targetTouches[0].pageX - lastX
    startY.value = (e as TouchEvent).targetTouches[0].pageY - lastY
  } else if ((e as TouchEvent).targetTouches.length > 1) {
    return
  }
}
function setChartScale(newScale: number): void {
  const matrix = transformVal.value.split(',')
  let targetScale = 1

  if (transformVal.value === '') {
    transformVal.value = `matrix(${newScale}, 0, 0, ${newScale}, 0, 0)`
  } else if (transformVal.value.indexOf('3d') === -1) {
    targetScale = Math.abs(parseFloat(matrix[3]) * newScale)
    if (targetScale > zoomoutLimit && targetScale < zoominLimit) {
      matrix[0] = `matrix(${targetScale}`
      matrix[3] = `${targetScale}`
      transformVal.value = matrix.join(',')
    }
  } else {
    targetScale = Math.abs(parseFloat(matrix[5]) * newScale)
    if (targetScale > zoomoutLimit && targetScale < zoominLimit) {
      matrix[0] = `matrix3d(${targetScale}`
      matrix[5] = `${targetScale}`
      transformVal.value = matrix.join(',')
    }
  }
}
function zoomHandler(e: WheelEvent): void {
  const newScale = 1 + (e.deltaY > 0 ? -0.2 : 0.2)
  setChartScale(newScale)
}
</script>
