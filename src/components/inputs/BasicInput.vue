<script setup lang="ts">
// Define the props with types
defineProps<{
  label?: string
  type: string
  name: string | number
  modelValue?: string | number | null | string[]
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
</script>

<template>
  <div>
    <label :for="name.toString()" class="form-label" v-if="label" :class="labelClass ?? ''">
      {{ label }}<code v-if="code" class="ps-1">{{ code }}</code>
      <code v-if="customCode" class="text-danger px-2">{{ customCode }}</code>
    </label>
    <textarea v-if="type === 'area'" class="form-control p-2" :value="modelValue" :placeholder="placeholder"
      :rows="rows" @input="handleInput" v-bind="$attrs" />
    <input v-else class="form-control p-2" :type="type" :value="modelValue" :placeholder="placeholder"
      :required="required ?? false" @input="handleInput" v-bind="$attrs" />
  </div>
</template>
