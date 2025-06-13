<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'

interface ModalProps {
  title: string
  subTitle?: string
  size?: 'sm' | 'lg' | 'xl'
  modelValue: boolean
  bodyClass?: string
  titleClass?: string
  subTitleClass?: string
  headerClass?: string
  footerClass?: string
  center?: boolean
  closeButton?: boolean
  preview?: boolean
  previewPercentage?: number
  previewTitle?: string
  previewBodyClass?: string
  previewContentClass?: string
  hideFooter?: boolean
  onBeforeClose?: () => boolean | Promise<boolean> // Function to call before closing
  preventEscapeClose?: boolean
  preventBackdropClose?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  bodyClass: '',
  titleClass: '',
  subTitleClass: 'text-uppercase text-muted',
  headerClass: '',
  footerClass: '',
  center: false,
  closeButton: true,
  preview: false,
  previewBodyClass: '',
  previewContentClass: '',
  hideFooter: false,
  preventEscapeClose: false,
  preventBackdropClose: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'open': []
}>()

// Computed property for two-way binding
const isVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    if (value) {
      emit('open')
    } else {
      emit('close')
    }
  }
})

// Generate unique ID for accessibility
const modalId = `modal-${Math.random().toString(36).substr(2, 9)}`

// Handle modal closing with optional before-close function
const closeModal = async () => {
  try {
    // Call onBeforeClose function if it exists
    if (props.onBeforeClose) {
      const canClose = await props.onBeforeClose()
      if (!canClose) {
        return // Don't close if the function returns false
      }
    }
    
    isVisible.value = false
  } catch (error) {
    console.error('Error in onBeforeClose function:', error)
    // Optionally still close the modal or handle the error as needed
  }
}

// Handle backdrop click
const handleBackdropClick = () => {
  if (!props.preventBackdropClose) {
    closeModal()
  }
}

// Handle escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isVisible.value && !props.preventEscapeClose) {
    closeModal()
  }
}

// Body scroll management
const lockBodyScroll = () => {
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${scrollBarWidth}px`
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// Watch for visibility changes to manage body scroll and keyboard events
watch(isVisible, (newVal) => {
  if (newVal) {
    lockBodyScroll()
    document.addEventListener('keydown', handleEscapeKey)
  } else {
    unlockBodyScroll()
    document.removeEventListener('keydown', handleEscapeKey)
  }
})

// Focus management
const modalRef = ref<HTMLElement>()
const lastActiveElement = ref<HTMLElement>()

const trapFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || !modalRef.value) return

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement?.focus()
      event.preventDefault()
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement?.focus()
      event.preventDefault()
    }
  }
}

watch(isVisible, (newVal) => {
  if (newVal) {
    lastActiveElement.value = document.activeElement as HTMLElement
    document.addEventListener('keydown', trapFocus)
    // Focus the modal after it's rendered
    setTimeout(() => {
      const firstFocusable = modalRef.value?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()
    }, 100)
  } else {
    document.removeEventListener('keydown', trapFocus)
    lastActiveElement.value?.focus()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.removeEventListener('keydown', trapFocus)
  unlockBodyScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade" appear>
      <div
        v-if="isVisible"
        ref="modalRef"
        class="modal fade show v-modal-custom"
        :class="{ 'modal-xl': props.size === 'xl' }"
        tabindex="-1"
        :aria-labelledby="`${modalId}-title`"
        :aria-describedby="subTitle ? `${modalId}-subtitle` : undefined"
        aria-modal="true"
        role="dialog"
        @click="handleBackdropClick"
        style="display: block"
      >
        <div 
          class="modal-dialog" 
          :class="center ? 'modal-dialog-centered' : ''" 
          @click.stop
        >
          <div class="d-flex w-100">
            <!-- Main Modal Content -->
            <div 
              class="modal-content"
              :style="{ width: (preview ? previewPercentage ? 100 - previewPercentage : 50 : 100) + '%' }"
            >
              <div class="modal-header" :class="headerClass">
                <div class="modal-titles">
                  <h5 
                    :id="`${modalId}-title`"
                    class="modal-title" 
                    :class="titleClass"
                  >
                    {{ title }}
                  </h5>
                  <h6 
                    v-if="subTitle"
                    :id="`${modalId}-subtitle`"
                    class="modal-subtitle" 
                    :class="subTitleClass"
                  >
                    {{ subTitle }}
                  </h6>
                </div>
                <button 
                  v-if="closeButton" 
                  type="button" 
                  class="btn-close mb-1" 
                  aria-label="Close modal"
                  @click="closeModal"
                />
                <slot name="customHeader" />
              </div>
              
              <div class="modal-body" :class="bodyClass">
                <slot name="modalBody" />
              </div>
              
              <div v-if="!hideFooter" class="modal-footer" :class="footerClass">
                <slot name="modalFooter" />
              </div>
            </div>

            <!-- Preview Panel -->
            <div 
              v-if="preview" 
              class="modal-content ms-1" 
              :style="{ width: (previewPercentage ?? 50) + '%' }"
              :class="previewContentClass"
            >
              <div class="modal-header" :class="headerClass">
                <h5 class="modal-title">{{ previewTitle }}</h5>
                <button 
                  type="button" 
                  class="btn-close mb-1" 
                  aria-label="Close preview" 
                  @click="closeModal"
                />
              </div>
              
              <div class="modal-body" :class="previewBodyClass">
                <slot name="modalPreviewBody" />
              </div>
              
              <div v-if="!hideFooter" class="modal-footer">
                <slot name="modalFooter" />
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Backdrop -->
        <div class="modal-backdrop">
          <div class="backdrop-overlay" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.v-modal-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1055;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-modal-custom .modal-dialog {
  position: relative;
  width: auto;
  max-width: 90vw;
  max-height: 90vh;
  margin: 1rem;
  z-index: 1056;
}

.v-modal-custom .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem 1rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-titles {
  flex: 1;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e9ecef;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

/* Modal size variants */
.modal-xl .modal-dialog {
  max-width: 95vw;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-dialog,
.modal-fade-leave-to .modal-dialog {
  transform: translateY(-50px);
}

/* Responsive design */
@media (max-width: 768px) {
  .v-modal-custom .modal-dialog {
    max-width: 95vw;
    margin: 0.5rem;
  }
  
  .d-flex {
    flex-direction: column;
  }
  
  .modal-content {
    width: 100% !important;
    margin-bottom: 0.5rem;
  }
  
  .modal-content:last-child {
    margin-bottom: 0;
  }
}

/* Focus styles */
.btn-close:focus,
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}
</style>