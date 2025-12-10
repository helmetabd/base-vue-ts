<template>
  <div :style="style" ref="lavContainer"></div>
</template>

<script setup lang="ts">
import lottie from 'lottie-web'
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  options: Record<string, any>
  height?: number
  width?: number
}>()

const emit = defineEmits<{ (e: 'animCreated', anim: any): void }>()

const lavContainer = ref<HTMLElement | null>(null)

const style = computed(() => ({
  width: props.width ? `${props.width}px` : '100%',
  height: props.height ? `${props.height}px` : '100%',
  overflow: 'hidden',
  margin: '0 auto'
}))

onMounted(() => {
  const anim = lottie.loadAnimation({
    container: lavContainer.value as any,
    renderer: 'svg',
    loop: props.options.loop !== false,
    autoplay: props.options.autoplay !== false,
    animationData: props.options.animationData,
    rendererSettings: props.options.rendererSettings
  })
  emit('animCreated', anim)
})
</script>