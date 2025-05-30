<script setup lang="ts">
import RadialChart from './RadialChart.vue';
const props = defineProps(['label', 'value', 'radialValue'])
</script>

<template>
        <div class="card card-animate overflow-hidden">
            <div class="position-absolute start-0" style="z-index: 0;">
                <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
                    <path id="Shape 8" class="s0"
                        d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z">
                    </path>
                </svg>
            </div>
            <div class="card-body" style="z-index:1 ;">
                <div class="d-flex align-items-center">
                    <div class="flex-grow-1 overflow-hidden">
                        <p class="text-uppercase fw-medium text-muted text-truncate mb-3"> {{ props.label ?? 'Radial W Card' }}</p>
                        <h4 class="fs-22 fw-semibold ff-secondary mb-0"><span class="counter-value"
                                data-target="{{ props.value ?? 200 }}">{{ props.value ?? 200 }}</span></h4>
                    </div>
                        <RadialChart :height="80" :width="80" :hollow="50" :data="props.radialValue"/>
                </div>
            </div>
        </div>
</template>
<style>
.s0 {
    opacity: .05;
    fill: var(--vz-success)
}
</style>