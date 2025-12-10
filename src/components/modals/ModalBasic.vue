<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subTitle: {
    type: String
  },
  size: {
    type: String,
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  bodyClass: {
    type: String,
    default: ''
  },
  titleClass: {
    type: String,
    default: ''
  },
  subTitleClass: {
    type: String,
    default: 'text-uppercase text-muted'
  },
  headerClass: {
    type: String,
    default: ''
  },
  footerClass: {
    type: String,
    default: ''
  },
  center: {
    type: Boolean,
    default: false
  },
  closeButton: {
    type: Boolean,
    default: true
  },
  preview: {
    type: Boolean,
    default: false
  },
  previewPercentage: {
    type: Number,
  },
  previewTitle: {
    type: String,
  },
  previewBodyClass: {
    type: String,
    default: ''
  },
  previewContentClass: {
    type: String,
    default: ''
  },
  hideFooter: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])
const isVisible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal
  }
)

const closeModal = () => {
  isVisible.value = false
  emit('toggle', false)
}
</script>

<template>
  <div v-if="isVisible" class="modal fade show v-modal-custom fadeInDown"
    :class="props.size ? 'modal-' + props.size : ''" tabindex="-1" @click="closeModal" style="display: block"
    data-bs-keyboard="false" data-bs-backdrop="static">
    <div class="modal-dialog" :class="center ? 'modal-dialog-centered' : ''" @click.stop>
      <div class="d-flex w-100">
        <div class="modal-content"
          :style="{ width: (preview ? previewPercentage ? 100 - previewPercentage : 50 : 100) + '%' }">
          <div class="modal-header" :class="headerClass">
            <h5 class="modal-title" :class="titleClass">{{ title }}</h5>
            <h6 class="modal-title" :class="subTitleClass" v-if="subTitle">{{ subTitle }}</h6>
            <button v-if="closeButton" type="button" class="btn-close mb-1" aria-label="Close"
              @click="closeModal"></button>
            <slot name="customHeader"></slot>
          </div>
          <div class="modal-body" :class="bodyClass">
            <slot name="modalBody" />
          </div>
          <div class="modal-footer" :class="footerClass">
            <slot name="modalFooter" />
          </div>
        </div>
        <div class="modal-content ms-1" v-if="preview" :style="{ width: (previewPercentage ?? 50) + '%' }"
          :class="previewContentClass">
          <div class="modal-header" :class="headerClass">
            <h5 class="modal-title">{{ previewTitle }}</h5>
            <button type="button" class="btn-close mb-1" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body" :class="previewBodyClass">
            <slot name="modalPreviewBody" />
          </div>
          <div class="modal-footer" v-if="!hideFooter">
            <slot name="modalFooter" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isVisible" class="b-overlay-wrap position-relative" aria-busy="true">
      <div class="b-overlay position-fixed" style="inset: 0px; z-index: 10">
        <div class="position-absolute bg-dark" style="inset: 0px; opacity: 0.85"></div>
        <div class="position-absolute" style="top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%)"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.v-modal-custom .modal-dialog .modal-content {
  z-index: 1056;
}
</style>
