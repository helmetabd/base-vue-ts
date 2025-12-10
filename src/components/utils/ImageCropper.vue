<script setup lang="ts">
import { ref } from 'vue'
import VueCropperJs, { type VueCropperMethods } from 'vue-cropperjs'
import "cropperjs/dist/cropper.css";
import { userService } from '@/service'
import { convertAndCompressImage, supportsWebP, type ImageProcessingOptions } from '@/utils/imageProcessor';

// Define prop types
const props = defineProps<{ 
  route_id: string | string[] | number 
  quality?: number
  maxWidth?: number
  maxHeight?: number
  format?: 'webp' | 'jpeg' | 'png'
  autoConvert?: boolean
}>()

const emit = defineEmits<{
  reload: []
  uploaded: [boolean]
  processingStart: []
  processingComplete: [{ originalSize: number, compressedSize: number, compressionRatio: number }]
  processingError: [Error]
}>()

// State management
const imgSrc = ref<string | ArrayBuffer | null | undefined>(null)
const cropImg = ref<string | null>(null)
const cropper = ref<VueCropperMethods | null>(null) // Type for cropper component ref
const inputRef = ref<HTMLInputElement | null>(null)
const isProcessing = ref(false)
const webpSupported = ref(false)

// Check WebP support on component mount
supportsWebP().then((supported: boolean) => {
  webpSupported.value = supported
})

// Default options
const processingOptions: ImageProcessingOptions = {
  quality: props.quality || 0.8,
  maxWidth: props.maxWidth || 800,
  maxHeight: props.maxHeight || 800,
  format: props.format || (webpSupported.value ? 'webp' : 'jpeg'),
  maintainAspectRatio: true
}

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

// Set the image for cropping (from file input or drop)
function setImageFromFile(file: File) {
  if (file.type.indexOf('image/') === -1) {
    alert('Please select an image file')
    return
  }
  if (typeof FileReader === 'function') {
    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>) => {
      imgSrc.value = event.target?.result
      if (cropper.value && event.target?.result) {
        cropper.value.replace(event.target.result as string)
      }
      emit('uploaded', true)
    }
    reader.readAsDataURL(file)
  } else {
    alert('Sorry, FileReader API not supported')
  }
}

function onFileInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) setImageFromFile(file)
}

// Dropzone drag-and-drop logic
const isDropActive = ref(false)
function onDrop(e: DragEvent) {
  e.preventDefault()
  isDropActive.value = false
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0]
    if (file) {
      setImageFromFile(file)
      e.dataTransfer.clearData()
    }
  }
}
function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDropActive.value = true
}
function onDragLeave(e: DragEvent) {
  e.preventDefault()
  isDropActive.value = false
}
function onDropzoneClick() {
  inputRef.value?.click()
}

// Upload the cropped photo
async function uploadPhoto() {
  if (!props.route_id) {
    return
  }

  cropImage()
  if (!cropper.value) return

  isProcessing.value = true
  emit('processingStart')

  try {
    // Get cropped canvas and convert to blob
    const canvas = cropper.value.getCroppedCanvas({
      width: processingOptions.maxWidth,
      height: processingOptions.maxHeight,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    })

    // Convert canvas to blob
    canvas.toBlob(async (blob: Blob | null) => {
      if (!blob) {
        throw new Error('Failed to create blob from canvas')
      }

      try {
        let finalFile: File

        // Convert blob to file for processing
        const originalFile = new File([blob], "profile.jpg", { type: blob.type })

        if (props.autoConvert !== false && processingOptions.format) {
          // Process the image with conversion and compression
          const result = await convertAndCompressImage(originalFile, processingOptions)
          finalFile = result.file
          
          // Emit processing complete event
          emit('processingComplete', {
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            compressionRatio: result.compressionRatio
          })
        } else {
          finalFile = originalFile
        }

        const formData = new FormData()
        formData.append('photo', finalFile)

        userService.updateAvatar(String(props.route_id), formData, () => {
          emit('reload')
          emit('uploaded', false)
        }, {
          allowOutsideClick: false,
          allowEscapeKey: false
        })

      } catch (error) {
        console.error('Error processing image:', error)
        emit('processingError', error as Error)
        
        // Fallback: upload original file
        const fallbackFile = new File([blob], "profile.jpg", { type: blob.type })
        const formData = new FormData()
        formData.append('photo', fallbackFile)

        userService.updateAvatar(String(props.route_id), formData, () => {
          emit('reload')
          emit('uploaded', false)
        }, {
          allowOutsideClick: false,
          allowEscapeKey: false
        })
      } finally {
        isProcessing.value = false
      }
    }, processingOptions.format ? `image/${processingOptions.format}` : 'image/jpeg', processingOptions.quality)

  } catch (error) {
    console.error('Error uploading photo:', error)
    emit('processingError', error as Error)
    isProcessing.value = false
  }
}
</script>

<template>
  <input id="input" ref="inputRef" type="file" name="image" accept="image/*" @change="onFileInputChange"
    style="display: none" />
  <div class="image-cropper-wrapper">
    <input id="input" ref="inputRef" type="file" name="image" accept="image/*" @change="onFileInputChange"
      style="display: none" />
    <div class="cropper-content">
      <div class="cropper-header" v-if="!imgSrc">
        <h5 class="mb-0">Upload Your Photo</h5>
        <p class="text-muted mb-0">Choose an image to crop and set as your profile picture</p>
      </div>

      <section class="cropper-area">
        <div class="img-cropper">
          <div class="row g-4">
            <div class="col-lg-8">
              <div class="dropzone-upload" :class="{ 'dropzone-active': isDropActive, 'dropzone-has-img': imgSrc }"
                @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop" @click="onDropzoneClick" v-if="!imgSrc">
                <div class="dropzone-content">
                  <div class="upload-icon">
                    <i class="las la-cloud-upload-alt"></i>
                  </div>
                  <h6 class="upload-title">Drag & drop or click to upload</h6>
                  <p class="upload-subtitle">Only image files are allowed</p>
                  <p class="upload-info">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
                </div>
              </div>
              <div v-else class="cropper-container-wrapper">
                <VueCropperJs ref="cropper" :src="imgSrc" preview=".preview" class="custom-cropper"
                  :aspect-ratio="1 / 1" :view-mode="1" />
              </div>
            </div>

            <div class="col-lg-4" v-if="imgSrc">
              <div class="preview-section">
                <h6 class="preview-title">Preview</h6>
                <div class="preview-container">
                  <div class="preview-item">
                    <div class="preview border border-3 border-primary" />
                    <span class="preview-label">Square</span>
                  </div>
                  <div class="preview-item">
                    <div class="preview border border-3 border-primary rounded-circle" />
                    <span class="preview-label">Circle</span>
                  </div>
                </div>

                <div class="image-info mt-3">
                  <div class="info-item">
                    <small class="text-muted">Aspect Ratio:</small>
                    <small class="fw-semibold">1:1 (Square)</small>
                  </div>
                  <div class="info-item">
                    <small class="text-muted">Output Size:</small>
                    <small class="fw-semibold">300 x 300px</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="cropper-actions" v-if="imgSrc">
          <div class="action-buttons">
            <button class="btn btn-outline-primary btn-action" @click.prevent="rotate(90)">
              <i class="las la-redo-alt me-2"></i>
              Rotate 90°
            </button>
            <button class="btn btn-outline-secondary btn-action" @click.prevent="reset">
              <i class="las la-undo me-2"></i>
              Reset
            </button>
          </div>
          <div class="save-section">
            <button class="btn btn-primary btn-lg btn-save" @click="uploadPhoto" :disabled="isProcessing">
              <div v-if="isProcessing" class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Processing...</span>
              </div>
              <i v-else class="las la-save me-2"></i>
              {{ isProcessing ? 'Processing...' : 'Save Photo' }}
            </button>
            <div v-if="isProcessing" class="mt-2">
              <small class="text-muted">Converting to {{ processingOptions.format?.toUpperCase() }} format...</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Main wrapper */
.image-cropper-wrapper {
  width: 100%;
  max-width: 100%;
}

/* Dropzone enhanced styling */
.dropzone-upload {
  border: 3px dashed #007bff;
  border-radius: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.dropzone-upload::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(0, 123, 255, 0.05) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.dropzone-upload:hover::before {
  transform: translateX(100%);
}

.dropzone-upload:hover {
  border-color: #0056b3;
  background: linear-gradient(135deg, #e3f0ff 0%, #cfe2ff 100%);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.25);
  transform: translateY(-3px);
}

.dropzone-upload.dropzone-active {
  border-color: #28a745;
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
  box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
  transform: scale(1.02);
  border-style: solid;
}

.dropzone-content {
  padding: 3rem 2rem;
  z-index: 1;
  position: relative;
}

.upload-icon {
  font-size: 4rem;
  color: #007bff;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.dropzone-upload:hover .upload-icon {
  transform: scale(1.2) rotate(5deg);
}

.upload-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.upload-subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.upload-info {
  font-size: 0.875rem;
  color: #adb5bd;
  margin: 0;
}

/* Cropper container */
.cropper-container-wrapper {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.custom-cropper {
  max-height: 400px;
  border-radius: 12px;
  overflow: hidden;
}

/* Preview section */
.preview-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  height: fit-content;
}

.preview-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.preview-container {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.preview-item {
  text-align: center;
}

.preview {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.preview:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.preview.rounded-circle {
  border-radius: 50% !important;
}

.preview-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.image-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

/* Actions section */
.cropper-actions {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn-action {
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border-width: 2px;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.btn-save {
  border-radius: 12px;
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #8C68CD 0%, #a18cc8 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(118, 40, 167, 0.3);
  transition: all 0.3s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(118, 40, 167, 0.4);
  background: linear-gradient(135deg, #6f42c1 0%, #5a3e9d 100%);
}

.btn-save:active {
  transform: translateY(0);
}

/* Responsive design */
@media (max-width: 768px) {
  .cropper-content {
    padding: 1.5rem;
  }

  .cropper-actions {
    flex-direction: column;
    text-align: center;
  }

  .action-buttons {
    justify-content: center;
  }

  .preview-container {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .upload-title {
    font-size: 1.25rem;
  }

  .upload-icon {
    font-size: 3rem;
  }
}

.cropper-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.cropper-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.cropper-header h5 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>
