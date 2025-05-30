<script setup lang="ts">
import CounterCard from '../cards/counter-card.vue';
import RadialChart from './RadialChart.vue';
defineProps({
    dataRadial: Number,
    label: String,
    value: Number
})
</script>

<template>
    <div class="card card-animate overflow-hidden">
        <div class="position-absolute start-0" style="z-index: 0;">
            <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 170" width="200" height="100%"
                preserveAspectRatio="xMidYMid slice">
                <path id="Shape 8" class="s0"
                    d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z">
                </path>
            </svg>
        </div>
        <div class="card-body px-2" style="z-index:1 ;">
            <div class="d-flex align-items-center">
                <div class="flex-grow-1 overflow-visible">
                    <p class="text-uppercase fw-medium text-muted text-truncate mb-3"> {{ label }}</p>
                    <h4 class="fs-22 fw-semibold ff-secondary mb-0">
                        <CounterCard v-if="value != null || value != undefined" :start-val="0" :end-val="value"
                            :duration="1000" />
                    </h4>
                </div>
                <RadialChart v-if="dataRadial != null || dataRadial != undefined" :height="90" :width="105" hollow="60%"
                    :data="dataRadial" />
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