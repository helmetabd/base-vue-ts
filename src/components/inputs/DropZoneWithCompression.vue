<template>
    <div v-if="grid5 != 99" class="dropzone-grid">
        <div v-for="i in maxImages" :key="i" class="dropzone-slot" :class="{
            'has-image': previews[i - 1],
            'active-dropzone': dragover(i),
            dragover: dragover(i) && isDragOver,
            'processing': processingStatus[i - 1]
        }" @click="dragover(i) ? openFilePicker() : null" @dragover.prevent="dragover(i) ? (isDragOver = true) : null"
            @dragleave="dragover(i) ? (isDragOver = false) : null"
            @drop.prevent="dragover(i) ? handleDrop($event) : null">
            <template v-if="previews[i - 1]">
                <img :src="previews[i - 1]" class="preview-image" />
                <button type="button" class="remove-btn" @click.stop="removeFile(i - 1)">
                    ×
                </button>
                <div v-if="i === 1" class="main-label">Gambar utama</div>
                <!-- Processing indicator -->
                <div v-if="processingStatus[i - 1]" class="processing-overlay">
                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                        <span class="visually-hidden">Processing...</span>
                    </div>
                    <small class="text-muted mt-1">Converting...</small>
                    <small v-if="processingProgress[i - 1] !== undefined" class="text-muted mt-1 ms-2">{{
                        processingProgress[i - 1] }}%</small>
                </div>
                <!-- Compression info -->
                <div v-if="compressionInfo[i - 1]" class="compression-info">
                    <small class="text-success">
                        {{ compressionInfo[i - 1]?.compressionRatio }}% smaller
                    </small>
                </div>
            </template>
            <template v-else>
                <div class="">
                    <i class="display-4 text-muted ri-upload-cloud-2-fill"></i>
                    <div v-if="i === 1" class="main-label">Unggah gambar utama</div>
                    <div v-else class="secondary-label">Unggah gambar</div>
                </div>
            </template>
        </div>
        <input type="file" ref="fileInput" accept="image/*" :multiple="true" class="hidden" @change="handleFileInput"
            :disabled="previews.length >= maxImages" />
    </div>
    <div v-else>
        <div class="dropzone-area" :class="{ 'active-dropzone': isDragOver, 'processing': processingStatus[0] }"
            @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false" @drop.prevent="handleDrop"
            @click="openFilePicker" v-bind="$attrs">
            <input type="file" ref="fileInput" :accept="accept" :multiple="multiple" class="hidden"
                @change="handleFileInput" />
            <template v-if="previews.length">
                <!-- If value is a string (URL), show only the image, centered -->
                <div v-if="typeof modelValue === 'string'" class="preview-container single-preview">
                    <img :src="modelValue" class="preview-image" />
                    <button type="button" class="remove-btn" @click.stop="removeFile(0)">×</button>
                </div>
                <!-- If value is a File, show full preview UI -->
                <div v-else class="preview-container single-preview">
                    <img :src="previews[0]" class="preview-image" />
                    <button type="button" class="remove-btn" @click.stop="removeFile(0)">×</button>
                    <!-- Processing indicator for single mode -->
                    <div v-if="processingStatus[0]" class="processing-indicator">
                        <div class="spinner-border spinner-border-sm text-primary" role="status">
                            <span class="visually-hidden">Processing...</span>
                        </div>
                        <small class="text-muted mt-1">Converting to WebP...</small>
                        <small v-if="processingProgress[0] !== undefined" class="text-muted mt-1 ms-2">{{
                            processingProgress[0] }}%</small>
                    </div>
                    <!-- Compression info for single mode -->
                    <div v-if="compressionInfo[0]" class="preview-info">
                        <small class="text-success">
                            Original: {{ formatFileSize(compressionInfo[0].originalSize) }} →
                            Compressed: {{ formatFileSize(compressionInfo[0].compressedSize) }}
                            ({{ compressionInfo[0].compressionRatio }}% reduction)
                        </small>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="dz-instructions">
                    <i class="display-4 text-muted ri-upload-cloud-2-fill"></i>
                    <div><strong>Drop files here</strong> or click to upload.</div>
                </div>
            </template>
        </div>
    </div>

    <!-- Processing status display -->
    <div v-if="showProcessingInfo && (processingCount > 0 || processedCount > 0)" class="mt-2">
        <div class="d-flex align-items-center">
            <div v-if="processingCount > 0" class="me-3">
                <div class="spinner-border spinner-border-sm text-primary me-1" role="status"></div>
                <small class="text-muted">Processing {{ processingCount }} image(s)...</small>
            </div>
            <div v-if="processedCount > 0">
                <i class="ri-check-line text-success me-1"></i>
                <small class="text-success">{{ processedCount }} image(s) processed</small>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed } from "vue";
import {
    convertAndCompressImage,
    type ImageProcessingOptions,
    type ProcessedImageResult,
    formatFileSize
} from "@/utils/imageProcessor";

const props = defineProps({
    accept: {
        type: String,
        default: "image/*",
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: [Array, Object, String, File, null],
        default: () => null,
    },
    grid5: {
        type: Number,
        default: 99,
    },
    // Image processing options
    autoConvert: {
        type: Boolean,
        default: true,
    },
    quality: {
        type: Number,
        default: 0.8,
        validator: (value: number) => value >= 0 && value <= 1,
    },
    maxWidth: {
        type: Number,
        default: 1920,
    },
    maxHeight: {
        type: Number,
        default: 1080,
    },
    format: {
        type: String,
        default: 'webp',
        validator: (value: string) => ['webp', 'jpeg', 'png'].includes(value),
    },
    showProcessingInfo: {
        type: Boolean,
        default: true,
    }
});

const emit = defineEmits(["update:modelValue", "fileNames", "fileUrls", "processingComplete", "processingError"]);

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const previews = ref<string[]>([]);
const objectURLs = ref<string[]>([]);
const processingStatus = ref<boolean[]>([]);
const processingProgress = ref<number[]>([]);
const compressionInfo = ref<ProcessedImageResult[]>([]);
const maxImages = props.grid5;

// Computed properties for processing status
const processingCount = computed(() => processingStatus.value.filter(status => status).length);
const processedCount = computed(() => compressionInfo.value.filter((info: any) => info).length);

const dragover = (i: number) => {
    return (
        !previews.value[i - 1] &&
        i === previews.value.length + 1 &&
        previews.value.length < maxImages
    );
};

// Cleanup object URLs to prevent memory leaks
const revokeObjectURLs = () => {
    objectURLs.value.forEach((url) => URL.revokeObjectURL(url));
    objectURLs.value = [];
};

// Process image with conversion and compression
const processImage = async (file: File, index: number): Promise<File> => {
    if (!props.autoConvert || !props.accept.includes('image')) {
        return file;
    }

    try {
        // Set processing status
        processingStatus.value[index] = true;
        processingProgress.value[index] = 0;

        const options: ImageProcessingOptions = {
            quality: props.quality,
            maxWidth: props.maxWidth,
            maxHeight: props.maxHeight,
            format: props.format as 'webp' | 'jpeg' | 'png',
        };

        const result = await convertAndCompressImage(file, options, (p: number) => {
            processingProgress.value[index] = p;
        });

        // Store compression info
        compressionInfo.value[index] = result;

        // Emit processing complete event
        emit('processingComplete', { index, result });

        return result.file;
    } catch (error) {
        console.error('Error processing image:', error);
        emit('processingError', { index, error });
        return file; // Return original file if processing fails
    } finally {
        // Clear processing status
        processingStatus.value[index] = false;
        processingProgress.value[index] = 100;
    }
};

// Process multiple files (allows an index offset so new files map to correct positions)
const processFiles = async (files: File[], startIndex = 0): Promise<File[]> => {
    const processedFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!f) continue; // guard against undefined
        const processedFile = await processImage(f, startIndex + i);
        processedFiles.push(processedFile);
    }

    return processedFiles;
};

// Handle file input change
const handleFileInput = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        const files = Array.from(input.files);
        await handleFiles(files);
    }
};

// Handle drag and drop
const handleDrop = async (event: DragEvent) => {
    isDragOver.value = false;
    if (event.dataTransfer?.files) {
        const files = Array.from(event.dataTransfer.files);
        await handleFiles(files);
    }
};

// Process and handle files
const handleFiles = async (files: File[]) => {
    if (!props.multiple && files.length > 1) {
        files = files[0] ? [files[0]] : [] as File[]; // Only take the first file for single mode
    }

    if (props.multiple && previews.value.length + files.length > maxImages) {
        files = files.slice(0, maxImages - previews.value.length);
    }
    // Prepare immediate previews and processing indicators so each file slot shows a spinner
    const startIndex = props.multiple && Array.isArray(props.modelValue) ? props.modelValue.length : 0;

    if (props.multiple) {
        // Create object URLs for immediate preview and mark processing status
        files.forEach((file, idx) => {
            const url = URL.createObjectURL(file);
            objectURLs.value.push(url);
            // Insert preview into previews at the correct position
            previews.value.splice(startIndex + idx, 0, url);
            // Ensure arrays are large enough
            processingStatus.value[startIndex + idx] = true;
            compressionInfo.value[startIndex + idx] = undefined as any;
        });
    } else {
        // Single mode: show immediate preview
        revokeObjectURLs();
        if (files[0]) {
            const url = URL.createObjectURL(files[0]);
            objectURLs.value.push(url);
            previews.value = [url];
            processingStatus.value[0] = true;
            compressionInfo.value[0] = undefined as any;
        } else {
            previews.value = [];
        }
    }

    // Process images if auto-convert is enabled
    const processedFiles = props.autoConvert && props.accept.includes('image')
        ? await processFiles(files, startIndex)
        : files;

    if (props.multiple) {
        const currentFiles = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
        const newFiles = [...currentFiles, ...processedFiles];
        emit("update:modelValue", newFiles);
    } else {
        emit("update:modelValue", processedFiles[0] || null);
    }
};

// Open file picker
const openFilePicker = () => {
    fileInput.value?.click();
};

// Remove file
const removeFile = (index: number) => {
    if (props.multiple && Array.isArray(props.modelValue)) {
        const newFiles = [...props.modelValue];
        newFiles.splice(index, 1);
        emit("update:modelValue", newFiles);
    } else {
        emit("update:modelValue", null);
    }

    // Clear processing info for removed file
    processingStatus.value[index] = false;
    compressionInfo.value.splice(index, 1);
};

// Note: getFileName logic was removed because it was unused. If needed later, reintroduce a helper.

// Emit file names
const emitFileNames = () => {
    if (!props.modelValue) {
        emit("fileNames", props.multiple ? [] : null);
        return;
    }

    if (props.multiple && Array.isArray(props.modelValue)) {
        const fileNames = props.modelValue
            .map((file) => {
                if (typeof file === "string") {
                    return file.split("/").pop() || "";
                } else if (file instanceof File) {
                    return file.name;
                }
                return "";
            })
            .filter((name) => name !== "");
        emit("fileNames", fileNames);
    } else {
        const file = props.modelValue;
        let filename = "";
        if (typeof file === "string") {
            filename = file.split("/").pop() || "";
        } else if (file instanceof File) {
            filename = file.name;
        }
        emit("fileNames", filename);
    }
};

// Emit file URLs (create object URLs for File instances and track them)
const emitFileUrls = () => {
    if (!props.modelValue) {
        emit("fileUrls", props.multiple ? [] : null);
        return;
    }

    if (props.multiple && Array.isArray(props.modelValue)) {
        // Revoke previous object URLs and rebuild from modelValue
        revokeObjectURLs();
        const fileUrls: string[] = props.modelValue
            .map((file) => {
                if (typeof file === "string") {
                    return file; // Already a URL
                } else if (file instanceof File) {
                    const url = URL.createObjectURL(file);
                    objectURLs.value.push(url);
                    return url;
                }
                return "";
            })
            .filter((url) => url !== "");
        previews.value = fileUrls;
        emit("fileUrls", fileUrls);
    } else {
        const file = props.modelValue;
        let fileUrl = "";
        if (typeof file === "string") {
            fileUrl = file; // Already a URL
        } else if (file instanceof File) {
            // Revoke previous single URL
            revokeObjectURLs();
            fileUrl = URL.createObjectURL(file); // Create object URL for File
            objectURLs.value.push(fileUrl);
        }
        previews.value = fileUrl ? [fileUrl] : [];
        emit("fileUrls", fileUrl);
    }
};

// Update previews
const updatePreviews = () => {
    // Clear existing object URLs to avoid duplicates
    revokeObjectURLs();
    if (!props.modelValue) {
        previews.value = [];
        emitFileNames();
        emitFileUrls();
        return;
    }

    if (props.multiple && Array.isArray(props.modelValue)) {
        const urls: string[] = props.modelValue.map((file) => {
            if (typeof file === "string") return file;
            const url = URL.createObjectURL(file);
            objectURLs.value.push(url);
            return url;
        });
        previews.value = urls;
    } else if (typeof props.modelValue === "string") {
        previews.value = [props.modelValue];
    } else if (
        props.modelValue instanceof Blob ||
        props.modelValue instanceof File
    ) {
        const url = URL.createObjectURL(props.modelValue);
        objectURLs.value.push(url);
        previews.value = [url];
    } else {
        console.error("Invalid modelValue type for URL.createObjectURL()");
        previews.value = [];
    }

    emitFileNames();
    emitFileUrls();
};

// Watch for changes in modelValue
watch(() => props.modelValue, updatePreviews, { immediate: true });

// Cleanup on unmount
onBeforeUnmount(() => {
    revokeObjectURLs();
});
</script>

<style scoped>
.dropzone {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.dropzone:hover,
.dropzone.active-dropzone {
    border-color: #3b82f6;
    background-color: #eff6ff;
}

.dropzone.processing {
    opacity: 0.7;
}

.dropzone-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
}

.dropzone-slot {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 150px;
}

.dropzone-slot:hover,
.dropzone-slot.active-dropzone {
    border-color: #3b82f6;
    background-color: #eff6ff;
}

.dropzone-slot.has-image {
    border-color: #10b981;
    background-color: #f0fdf4;
    padding: 0;
}

.dropzone-slot.processing {
    opacity: 0.7;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
}

.single-preview {
    position: relative;
    max-width: 300px;
    margin: 0 auto;
}

.single-preview .preview-image {
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: contain;
}

.preview-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.preview-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #e5e7eb;
}

.file-box {
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.file-name {
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    word-break: break-word;
}

.remove-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(239, 68, 68, 0.9);
}

.dropzone-area {
    border: 2px dashed #d1d5db;
    border-radius: 10px;
    padding: 28px 12px 18px 12px;
    min-height: 170px;
    background: #fafbfc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
}

.dropzone-area.dragover {
    border-color: #299cdb;
    background: #f3e8ff;
}

.dropzone-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 18px;
    justify-content: center;
}

.preview-container {
    position: relative;
    width: 150px;
    min-height: 170px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 8px;
}

.preview-image {
    width: 100%;
    height: 120px;
    object-fit: contain;
    background: #f3f4f6;
    border-bottom: 1px solid #f3f4f6;
    margin-bottom: 0;
}

.remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ef4444;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    transition: background 0.2s, color 0.2s;
    z-index: 2;
}

.remove-btn:hover {
    background: #fee2e2;
    color: #b91c1c;
}

.preview-info {
    font-size: 13px;
    color: #10b981;
    margin: 8px 0 0 0;
    text-align: center;
    word-break: break-all;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 6px;
    padding: 4px 6px 2px 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.processing-indicator {
    font-size: 13px;
    color: #6366f1;
    margin-top: 10px;
    text-align: center;
}

.error-message {
    color: #ef4444;
    font-size: 13px;
    margin-top: 10px;
    text-align: center;
}

.dropzone-stats {
    font-size: 13px;
    color: #6b7280;
    margin-top: 10px;
    text-align: center;
}

.dropzone-area input[type="file"] {
    display: none;
}

.dropzone-area:focus-within {
    border-color: #6366f1;
    background: #f3e8ff;
}

.dropzone-area .dz-instructions {
    color: #6b7280;
    font-size: 15px;
    margin-bottom: 0;
    text-align: center;
}

.dropzone-area .dz-instructions strong {
    color: #299cdb;
}
</style>