<script setup lang="ts">
/* eslint-disable */
import { ref } from 'vue'
import { Cropper, CircleStencil, Preview } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const emit = defineEmits<{ (e: 'update-image', dataUrl: string): void }>()

const checked = ref(false)
const showModal = ref(false)
const preview = ref<string | null>(null)
const croppedImage = ref<string | null>(null)
const pictureSelected = ref<File | null>(null)
const result = ref<{ coordinates: any; image: any }>({ coordinates: null, image: null })

function modalOpen() {
  showModal.value = true
}

function editData() {
  const res = result.value
  if (res.image) {
    const cropper = (refs.cropper as any) as { getResult: () => any }
    const r = cropper.getResult()
    const canvas = r?.canvas
    if (canvas) {
      // emit data URL so parent can update UI or upload
      const dataUrl = canvas.toDataURL('image/jpeg')
      emit('update-image', dataUrl)
    }
    showModal.value = false
  } else {
    console.error('No valid image data available for update')
  }
}

function imagePreview(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    pictureSelected.value = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.value = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

function onChange({ coordinates, image }: any) {
  result.value = { coordinates, image }
}

function cropImage() {
  const cropper = (refs.cropper as any) as { getResult: () => any }
  const r = cropper.getResult()
  editData()
  const newTab = window.open()
  if (newTab) newTab.document.body.innerHTML = `<img src="${r.canvas.toDataURL('image/jpeg')}"></img>`
}

function reset() {
  pictureSelected.value = null
  preview.value = null
}

const refs: Record<string, any> = {}

function handleCheckboxChange(e?: Event) {
  // no-op for now; checkbox v-model keeps `checked` in sync
}
</script>
<template>
  <div>
    <button class="btn btn-success" @click="modalOpen">
      <i class="ri-user-line align-middle me-1"></i> Update Avatar
    </button>
    <BModal
      v-model="showModal"
      hide-footer
      title="Update Password"
      class="v-modal-custom"
    >
      <form @submit.prevent="editData">
        <div class="row g-3">
          <div class="image-wrapper">
            <div class="image-container">
              <!-- <b-img
                alt="Image Preview"
                :src="preview"
                class="img-fluid image-item">
              </b-img> -->
              <Cropper
                ref="cropper"
                :src="preview"
                @change="onChange"
                :debounce="false"
                :stencil-props="{
                  aspectRatio: 1,
                }"
                :stencil-component="CircleStencil"
              />
              <preview
                :width="120"
                :height="120"
                :image="result.image"
                :coordinates="result.coordinates"
              />
            </div>
          </div>
          <div>
            <label for="formFile" class="form-label mt-4">Select Image</label>
            <input
              class="form-control"
              type="file"
              id="formFile"
              accept="image/*"
              @change="imagePreview"
            />
          </div>
            <div class="col mt-4" lg="5">
            <input
              type="checkbox"
              id="checkboxEditPassword"
              style="margin-right: 4px"
              v-model="checked"
              @change="handleCheckboxChange"
            />
            <label for="checkboxEditPassword">Confirm</label>
          </div>
          <div class="col hstack gap-2 justify-content-end" lg="7">
            <div>
              <BButton
                style="margin-right: 1em"
                type="button"
                variant="light"
                @click="showModal = false"
              >
                Close
              </BButton>
              <BButton v-if="checked" type="submit" variant="primary"
                >Update</BButton
              >
              <BButton v-else type="submit" variant="primary" class="disabled"
                >Update</BButton
              >
            </div>
          </div>
        </div>
      </form>
    </BModal>
  </div>
</template>
<style>
.image-wrapper {
  margin-top: 3%;
  width: 100%;
  height: 67%;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.image-container {
  width: 400px;
  min-height: 120px;
  max-height: auto;
  float: none;
  margin: 3px;
  padding: 3px;
}
.image-item {
  max-width: 50%;
  height: auto;
}
</style>
