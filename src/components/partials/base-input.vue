<template lang="">
  <div>
    <label class="mt-2 mb-2" v-if="label">{{ label }}</label>
    <input
      v-if="inputType === 'text'"
      type="text"
      :placeholder="label"
      :value="modelValue"
      :class="{ 'form-control': true, 'is-required': required }"
      class="form-control"
      @input="updateModelValue($event)" />
    <input
      v-if="inputType === 'email'"
      type="email"
      :placeholder="label"
      :value="modelValue"
      :class="{ 'form-control': true, 'is-required': required }"
      class="form-control"
      @input="updateModelValue($event)" />
    <input
      v-if="inputType === 'password'"
      type="password"
      :placeholder="label"
      :value="modelValue"
      :class="{ 'form-control': true, 'is-required': required }"
      class="form-control"
      @input="updateModelValue($event)" />
    <input
      v-if="inputType === 'phone'"
      type="phone"
      :placeholder="label"
      :value="modelValue"
      :class="{ 'form-control': true, 'is-required': required }"
      class="form-control"
      @input="updateModelValue($event)" />
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: [String, Boolean],
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    inputType: {
      type: String,
      default: "text",
    },
    inputFields: {
      type: Array,
      default: () => [],
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateModelValue(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>
