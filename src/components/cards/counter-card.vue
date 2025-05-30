<template>
    <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface CountToProps {
    startVal: number;
    endVal: number;
    duration: number;
    autoplay?: boolean;
    decimals?: number;
    prefix?: string;
    suffix?: string;
}

const props = withDefaults(defineProps<CountToProps>(), {
    startVal: 0,
    endVal: 100,
    duration: 2000,
    autoplay: true,
    decimals: 0,
    prefix: '',
    suffix: '',
})

const displayValue = ref(props.startVal.toFixed(props.decimals));
const startTime = ref<number | null>(null);
const currentVal = ref(props.startVal);

const easingFunction = (t: number, b: number, c: number, d: number): number => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
};

const count = (timestamp: number) => {
    if (!startTime.value) startTime.value = timestamp;
    const elapsed = timestamp - startTime.value;
    const progress = Math.min(elapsed / props.duration, 1);
    currentVal.value = easingFunction(progress, props.startVal, props.endVal - props.startVal, 1);
    displayValue.value = `${props.prefix}${currentVal.value.toFixed(props.decimals)}${props.suffix}`;

    if (elapsed < props.duration) {
        requestAnimationFrame(count);
    } else {
        displayValue.value = `${props.prefix}${props.endVal.toFixed(props.decimals)}${props.suffix}`;
    }
};

const start = () => {
    startTime.value = null;
    requestAnimationFrame(count);
};

if (props.autoplay) {
    onMounted(start);
}

watch(
    () => [props.startVal, props.endVal],
    () => {
        if (props.autoplay) start();
    }
);
</script>

<style scoped>
span {
    font-variant-numeric: tabular-nums;
}
</style>