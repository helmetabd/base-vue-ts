<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Rule {
    value: string | number
    type: string
    icon?: string
    label: string
    case?: Rule
}

const props = defineProps({
    badge: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
    },
    title: {
        type: String,
    },
    disable: {
        type: Boolean,
        default: false
    },
    rules: {
        type: Array as () => Rule[],
        default: () => []
    },
    condition: {
        type: Function,
        default: () => true
    },
    item: {
        type: Object,
        default: () => ({})
    },
    value: {
        type: [String, Number],
    }
})

defineEmits(['clicked'])

const badgeClass = ref(classType(props.badge))
const badgeType = ref(props.badge)
const badgeIcon = ref(props.icon)
const badgeTitle = ref(props.title)

function classType(type = props.badge) {
    return `badge bg-${type}-subtle text-${type} p-2`
}

function setFromRules() {
    let rule = props.rules.find(rule => rule.value == props.value)
    if (rule?.case) {
        if (props.condition(props.item)) {
            rule = rule.case // Override with the new rule
        }
    }
    if (rule) {
        badgeClass.value = classType(rule.type)
        badgeType.value = rule.type
        badgeIcon.value = rule.icon
        badgeTitle.value = rule.label
    }
}

function hoverBadge(type = props.badge) {
    badgeClass.value = `badge bg-${type} text-light p-2`
}

onMounted(() => {
    setFromRules()
})

</script>
<template>
    <span :class="badgeClass"
        :style="{ cursor: disable ? 'default' : 'pointer', 'pointer-events': disable ? 'none' : 'auto' }"
        @mouseover="!disable && hoverBadge(badgeType)" @mouseleave="setFromRules" @click="!disable && $emit('clicked')">
        <i v-if="badgeIcon" :class="badgeIcon"></i>
        {{ badgeTitle }}
    </span>
</template>