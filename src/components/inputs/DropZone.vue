<template>
    <div class="dropzone" :class="{ 'active-dropzone': isDragOver }" @dragover.prevent="isDragOver = true"
        @dragleave="isDragOver = false" @drop.prevent="handleDrop" @click="openFilePicker" v-bind="$attrs">
        <div class="mb-1" v-if="!previews.length || multiple">
            <i class="display-4 text-muted ri-upload-cloud-2-fill"></i>
        </div>
        <input type="file" ref="fileInput" :accept="accept" :multiple="multiple" class="hidden"
            @change="handleFileInput" />
        <h5 v-if="!previews.length || multiple">Drop files here or click to upload.</h5>
        <template v-if="!multiple">
            <div v-if="previews.length" class="single-preview">
                <!-- Show file name if accept includes image, otherwise show image or string -->
                <span v-if="!props.accept.includes('image')" class="d-flex justify-content-center align-content-center">
                    {{ getFileName(0) }}
                </span>
                <img v-else :src="previews[0]" class="preview-image" />
                <button class="remove-btn" @click.stop="removeFile(0)">×</button>
            </div>
        </template>
    </div>
    <template v-if="multiple">
        <div class="preview-container" v-if="previews.length">
            <div v-for="(preview, index) in previews" :key="index" 
                 :class="props.accept.includes('image') ? 'preview-item' : 'file-box'">
                <!-- Show file name if accept includes image, otherwise show image or string -->
                <span v-if="!props.accept.includes('image')" class="file-name">
                    {{ getFileName(index) }}
                </span>
                <img v-else :src="preview" class="preview-image" />
                <button class="remove-btn" @click.stop="removeFile(index)">×</button>
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
    accept: {
        type: String,
        default: 'image/*',
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: [Array, Object, String, File, null], // Support for File[], File, or URL string
        default: () => null,
    },
});

const emit = defineEmits(['update:modelValue']);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const previews = ref<string[]>([]);
const objectURLs = ref<string[]>([]);

// Cleanup object URLs to prevent memory leaks
const revokeObjectURLs = () => {
    objectURLs.value.forEach(url => URL.revokeObjectURL(url));
    objectURLs.value = [];
};

// Update previews (only show the image, no conversion)
const updatePreviews = () => {
    revokeObjectURLs();
    if (!props.modelValue) {
        previews.value = []; // Ensure previews is always an array
        return;
    }

    if (props.multiple && Array.isArray(props.modelValue)) {
        previews.value = props.modelValue.map(file => 
            typeof file === 'string' ? file : URL.createObjectURL(file)
        );
    } else if (typeof props.modelValue === 'string') {
        previews.value = [props.modelValue]; // Directly use URL
    } else if (props.modelValue instanceof Blob || props.modelValue instanceof File) {
        const url = URL.createObjectURL(props.modelValue);
        objectURLs.value.push(url);
        previews.value = [url];
    } else {
        console.error('Invalid modelValue type for URL.createObjectURL()');
        previews.value = [];
    }
};

// Watch for changes in modelValue
watch(() => props.modelValue, updatePreviews, { deep: true, immediate: true });

// Handle file drop
const handleDrop = (event: DragEvent) => {
    isDragOver.value = false;
    if (event.dataTransfer?.files) {
        processFiles(Array.from(event.dataTransfer.files));
    }
};

// Handle file input change
const handleFileInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        processFiles(Array.from(target.files));
    }
};

// Process and emit selected files
const processFiles = (selectedFiles: any[]) => {
    const uniqueFiles = selectedFiles.filter((file: any) => !isDuplicate(file));
    if (uniqueFiles.length === 0) return;
    
    if (props.multiple) {
        const currentFiles = Array.isArray(props.modelValue) ? props.modelValue : [];
        emit('update:modelValue', [...currentFiles, ...uniqueFiles]);
    } else {
        emit('update:modelValue', uniqueFiles[0] || null);
    }
};

// Check for duplicate files
const isDuplicate = (file: { name: any; size: any; }) => {
    if (props.multiple && props.modelValue && Array.isArray(props.modelValue)) {
        return props.modelValue.some((existingFile: { name: any; size: any; }) => {
            if (typeof existingFile === 'object' && existingFile !== null && 
                'name' in existingFile && 'size' in existingFile) {
                return existingFile.name === file.name && existingFile.size === file.size;
            }
            return false;
        });
    }
    return false;
};

// Remove file
const removeFile = (index: number) => {
    if (props.multiple) {
        if (Array.isArray(props.modelValue)) {
            const updatedFiles = [...props.modelValue];
            updatedFiles.splice(index, 1);
            emit('update:modelValue', updatedFiles);
        } else {
            console.error('Expected props.modelValue to be an array in multiple mode');
            emit('update:modelValue', []);
        }
    } else {
        emit('update:modelValue', null);
    }
    updatePreviews();
};

// Open file picker
const openFilePicker = () => {
    fileInput.value?.click();
};

function getFileName(index: number) {
    if (props.multiple && Array.isArray(props.modelValue)) {
        const file = props.modelValue[index];
        if (typeof file === 'string') {
            // If it's a string (URL), extract file name from URL
            return file.split('/').pop();
        } else if (file instanceof File) {
            return file.name;
        }
    } else if (!props.multiple) {
        const file = props.modelValue;
        if (typeof file === 'string') {
            return file.split('/').pop();
        } else if (file instanceof File) {
            return file.name;
        }
    }
    return '';
}

// Cleanup object URLs on component unmount
onBeforeUnmount(revokeObjectURLs);
</script>

<style scoped>
.preview-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
}

.preview-item {
    position: relative;
    width: 80px;
    height: 80px;
}

.file-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    padding: 8px 12px;
    background-color: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.file-box:hover {
    background-color: #e9ecef;
    border-color: #dee2e6;
}

.file-name {
    font-size: 12px;
    font-weight: 500;
    color: #495057;
    text-align: center;
    word-break: break-word;
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.remove-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 50%;
    background-color: #dc3545;
    color: white;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 1;
}

.remove-btn:hover {
    background-color: #c82333;
    transform: scale(1.1);
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

.single-preview {
    position: relative;
    display: inline-block;
    margin-top: 10px;
}

.dropzone {
    min-height: 150px;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #f8f9fa;
}

.dropzone:hover,
.active-dropzone {
    border-color: #007bff;
    background-color: #e3f2fd;
}

.hidden {
    display: none;
}
</style>