<script setup lang="ts">
import { ref } from 'vue'
import VueCropper, { type VueCropperMethods } from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { employeeService } from '@/service'

// Define prop types
const props = defineProps<{ route_id: string | string[] | number }>()

const emit = defineEmits<{
  reload: []
}>()

// State management
const imgSrc = ref<string | ArrayBuffer | null | undefined>(null)
const cropImg = ref<string | null>(null)
const cropper = ref<VueCropperMethods | null>(null) // Type for cropper component ref
// const cropper = ref<InstanceType<typeof VueCropper> | null>(null) // Type for cropper component ref
const inputRef = ref<HTMLInputElement | null>(null)

// Crop the image
function cropImage() {
  if (cropper.value) {
    cropImg.value = cropper.value?.getCroppedCanvas().toDataURL()
  }
}

// Reset the cropper
function reset() {
  cropper.value?.reset()
}

// Rotate the image by the specified degree
function rotate(deg: number) {
  cropper.value?.rotate(deg)
}

// Set the image for cropping
function setImage(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && file.type.indexOf('image/') === -1) {
    alert('Please select an image file')
    return
  }

  if (file && typeof FileReader === 'function') {
    const reader = new FileReader()

    reader.onload = (event: ProgressEvent<FileReader>) => {
      imgSrc.value = event.target?.result
      if (cropper.value && event.target?.result) {
        cropper.value.replace(event.target.result as string)
      }
    }

    reader.readAsDataURL(file)
  } else {
    alert('Sorry, FileReader API not supported')
  }
}

// Trigger the file input to choose a file
function showFileChooser() {
  inputRef.value?.click()
}

// Upload the cropped photo
async function uploadPhoto() {
  if (!props.route_id) {
    return
  }

  cropImage()
  if (cropper.value)
    cropper.value.getCroppedCanvas().toBlob((blob: Blob | null) => {
      if (!blob) {
        return
      }

      const formData = new FormData()
      formData.append('photo', blob)

      employeeService.updateImage(props.route_id, formData, () => emit('reload'))
    })
}
</script>

<template>
  <input
    id="input"
    ref="inputRef"
    type="file"
    name="image"
    accept="image/*"
    @change="setImage"
    style="display: none"
  />
  <div>
    <div class="content">
      <section class="cropper-area">
        <div class="img-cropper">
          <div class="row">
            <div
              class="col border-2 border-dashed rounded d-flex justify-content-center align-items-center"
              v-if="!imgSrc"
            >
              <span style="font-size: 20px">
                <i class="las la-cloud-upload-alt" style="font-size: 30px"></i>
                Upload Image First
              </span>
            </div>
            <div class="col" v-if="imgSrc">
              <vue-cropper
                ref="cropper"
                :aspect-ratio="1 / 1"
                :src="imgSrc"
                preview=".preview"
                style="max-height: 250px; max-width: 250px"
              />
            </div>
            <div class="col" :style="!imgSrc ? 'height: 250px' : ''">
              <div v-if="imgSrc">
                <p>Preview</p>
                <div class="d-flex gap-5">
                  <div class="preview border border-5 border-primary" />
                  <div class="preview border border-5 border-primary rounded-circle" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col">
            <div class="d-flex gap-2">
              <button @click="showFileChooser" class="btn btn-primary">
                <i class="las la-cloud-upload-alt" style="font-size: 20px"></i>
                Upload Photo
              </button>
              <button class="btn btn-primary" @click.prevent="rotate(90)">
                <i class="las la-redo-alt"></i> Rotate
              </button>
              <a href="#" role="button" class="btn btn-primary" @click.prevent="reset"> Reset </a>
            </div>
          </div>
          <div class="col d-flex align-items-end justify-content-end">
            <button class="btn btn-primary" @click="uploadPhoto">Save</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style>
.preview-area {
  width: 307px;
}

.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}

.preview-area p:last-of-type {
  margin-top: 1rem;
}

.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}

.preview-avatar {
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 3px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
