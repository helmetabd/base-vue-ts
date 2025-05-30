<template>
  <div>
    <label for="ForminputState" class="form-label">{{ label }}</label>
    <select
      :placeholder="label"
      id="ForminputState"
      class="form-select"
      data-choices
      data-choices-sorting="true"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" selected>Pilih</option>
      <option
        v-for="option in optionValue"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

  <script>
  export default {
    props: {
      label: {
        type: String,
        default: "",
      },
      modelValue: {
        type: String,
        default: "",
      },
      optionValue: {
        type: Array,
        default: () => [],
      },
    },
  };
  </script>
  <style></style>
  