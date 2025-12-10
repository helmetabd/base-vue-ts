<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

// Define the props with types
const props = defineProps<{
  label?: string
  type: string
  name: string | number
  modelValue?: string | number | null | string[] | File
  placeholder?: string
  required?: boolean
  rows?: number
  code?: string
  customCode?: string
  labelClass?: string
}>()

// Define the emits for updating modelValue
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null | undefined): void
}>()

// Helper function to handle input event
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | null
  if (target) {
    emit('update:modelValue', target.value)
  }
}

const displayValue = ref('')
const actualValue = ref(0)

const handleInputRupiah = (e: Event) => {
  const target = e.target as HTMLInputElement | null
  if (target) {
    const cleaned = target.value.replace(/[^\d]/g, '')
    actualValue.value = cleaned ? parseInt(cleaned) : 0
    displayValue.value = cleaned ? formatRupiah(actualValue.value) : ''
    emit('update:modelValue', actualValue.value)
  }
}

const formatDisplay = () => {
  if (actualValue.value) {
    displayValue.value = formatRupiah(actualValue.value)
  }
}

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

// Sync incoming modelValue to display/actual values (initial and reactive)
const syncFromModel = (value: unknown) => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    actualValue.value = value
    displayValue.value = value ? formatRupiah(value) : ''
  } else if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    const numeric = Number(value)
    actualValue.value = numeric
    displayValue.value = numeric ? formatRupiah(numeric) : ''
  } else {
    actualValue.value = 0
    displayValue.value = ''
  }
}

onMounted(() => {
  syncFromModel(props.modelValue ?? null)
})

watch(
  () => props.modelValue,
  (newVal) => {
    // Avoid echo-updates when we are the source
    if (newVal !== actualValue.value) {
      syncFromModel(newVal as unknown)
    }
  }
)
</script>

<template>
  <div>
    <label :for="name.toString()" class="form-label" v-if="label" :class="labelClass ?? ''">
      <i class="las la-braille text-muted"></i>
      {{ label }}<code v-if="code" class="ps-1">{{ code }}</code>
      <code v-if="customCode" class="text-danger px-2">{{ customCode }}</code>
    </label>
    <textarea v-if="type === 'area'" class="form-control p-2" :value="String(modelValue)" :placeholder="placeholder"
      :rows="rows" @input="handleInput" v-bind="$attrs" />
    <input v-else-if="type === 'rupiah'" type="text" class="form-control p-2" :value="String(displayValue)"
      :placeholder="placeholder ?? 'Rp 0'" :required="required ?? false" @input="handleInputRupiah" v-bind="$attrs"
      @blur="formatDisplay" />
    <input v-else class="form-control p-2" :type="type" :value="modelValue" :placeholder="placeholder"
      :required="required ?? false" @input="handleInput" v-bind="$attrs" />
  </div>
</template>
