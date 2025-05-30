<template lang="">
  <div class="col-lg-12 mt-2">
    <div class="form-check mb-2">
      <input
        class="form-check-input"
        type="checkbox"
        id="value1"
        value="1"
        v-model="checkedValue"
        @input="handleCheckboxChange"
      />
      <label class="form-check-label" for="value1">
        {{ checkboxLabel }}
      </label>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    checkboxLabel: {
      type: [String, Boolean],
      default: "",
    },
    checkboxValue: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    hhandleCheckboxChange(event) {
      this.checked = event.target.checked;
      this.fetchData.forEach((item) => {
        item.checkboxValue = this.checked ? 1 : 0;
      });
    },
  },
};
</script>
