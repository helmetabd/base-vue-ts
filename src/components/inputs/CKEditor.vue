<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { Ckeditor } from '@ckeditor/ckeditor5-vue'
import 'ckeditor5/ckeditor5.css';

import {
    ClassicEditor,
    Alignment,
    Autoformat,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    CloudServices,
    Emoji,
    Essentials,
    Heading,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Mention,
    Paragraph,
    PasteFromOffice,
    SimpleUploadAdapter,
    Strikethrough,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    WordCount,
    MediaEmbed,
} from 'ckeditor5'
import { storeImage, deleteImage } from '@/service/UtilsService'

const props = defineProps({
    modelValue: String,
    placeHolder: {
        type: Boolean,
        default: true
    },
    height: {
        type: String,
        default: '300px'
    }
})
const emits = defineEmits(['update:modelValue'])

const editorData = ref(props.modelValue)
const isLayoutReady = ref(false)
const editorInstance = ref(null)

// Track uploaded images to handle deletion
const uploadedImages = ref(new Set<string>())

// Custom upload adapter for image uploads using ApiClientService
function createCustomUploadAdapter(loader: any) {
    let uploadedImageUrl: string | null = null;
    let isAborted = false;

    return {
        upload() {
            return loader.file.then(async (file: File) => {
                if (isAborted) {
                    throw new Error('Upload aborted');
                }

                try {
                    let processedFile = file;

                    // Process image if it's an image file
                    if (file.type.startsWith('image/')) {
                        try {
                            const { convertAndCompressImage } = await import('@/utils/imageProcessor');
                            const result = await convertAndCompressImage(file, {
                                quality: 0.85,
                                maxWidth: 1200,
                                maxHeight: 1200,
                                format: 'webp'
                            });
                            processedFile = result.file;
                            console.log(`Image compressed: ${result.originalSize} → ${result.compressedSize} bytes (${result.compressionRatio}% reduction)`);
                        } catch (processingError) {
                            console.warn('Image processing failed, using original file:', processingError);
                            // Continue with original file if processing fails
                        }
                    }

                    const formData = new FormData();
                    formData.append("upload", processedFile);
                    formData.append("name", processedFile.name);

                    // Using storeImage from UtilsService
                    const imageUrl = await storeImage("/utilities/upload-image", formData);
                    console.log('Image uploaded to:', imageUrl);
                    uploadedImageUrl = imageUrl.url;

                    // Track uploaded image
                    uploadedImages.value.add(imageUrl.url);

                    if (isAborted) {
                        // If aborted after upload, delete the uploaded image
                        await deleteImage("/utilities/delete-image", imageUrl.url);
                        uploadedImages.value.delete(imageUrl.url);
                        throw new Error('Upload aborted');
                    }

                    return { default: imageUrl.url };
                } catch (error) {
                    if (uploadedImageUrl && !isAborted) {
                        // If upload failed but image was uploaded, clean it up
                        try {
                            await deleteImage("/utilities/delete-image", uploadedImageUrl);
                            uploadedImages.value.delete(uploadedImageUrl);
                        } catch (deleteError) {
                            console.error('Failed to delete uploaded image:', deleteError);
                        }
                    }
                    throw error;
                }
            });
        },
        abort() {
            isAborted = true;

            // If image was already uploaded, delete it from backend
            if (uploadedImageUrl) {
                deleteImage("/utilities/delete-image", uploadedImageUrl).catch((error: any) => {
                    console.error('Failed to delete image during abort:', error);
                });
                uploadedImages.value.delete(uploadedImageUrl);
            }
        },
    };
}

function MyCustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
        return createCustomUploadAdapter(loader);
    };
}

// Function to extract image URLs from editor content
function extractImageUrls(content: string): Set<string> {
    const imageUrls = new Set<string>();
    const imgRegex = /<img[^>]+src="([^"]+)"/g;
    let match: RegExpExecArray | null;

    while ((match = imgRegex.exec(content)) !== null) {
        const imageUrl = match[1];
        // Only track images that we uploaded (assuming they match our backend URL pattern)
        if (typeof imageUrl === 'string' && uploadedImages.value.has(imageUrl)) {
            imageUrls.add(imageUrl);
        }
    }

    return imageUrls;
}

// Function to handle image deletion when removed from content
function handleImageDeletion(newContent: string, oldContent: string) {
    const newImages = extractImageUrls(newContent);
    const oldImages = extractImageUrls(oldContent);

    // Find images that were removed
    const removedImages = new Set([...oldImages].filter(x => !newImages.has(x)));

    // Delete removed images from backend
    removedImages.forEach(async (imageUrl) => {
        try {
            await deleteImage("/utilities/delete-image", imageUrl);
            uploadedImages.value.delete(imageUrl);
            console.log('Deleted removed image:', imageUrl);
        } catch (error) {
            console.error('Failed to delete removed image:', imageUrl, error);
        }
    });
}

const config = computed(() => {
    if (!isLayoutReady.value) {
        return null;
    }

    let defaultConfig: any = {
        licenseKey: 'GPL',
        plugins: [
            Alignment,
            Autoformat,
            AutoImage,
            Autosave,
            BlockQuote,
            Bold,
            CloudServices,
            Emoji,
            Essentials,
            Heading,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsert,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            MediaEmbed,
            Mention,
            Paragraph,
            PasteFromOffice,
            SimpleUploadAdapter,
            Strikethrough,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            TodoList,
            Underline,
            WordCount,
        ],
        extraPlugins: [MyCustomUploadAdapterPlugin],
        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                '|',
                'emoji',
                'link',
                'insertImage',
                'mediaEmbed',
                'insertTable',
                'blockQuote',
                '|',
                'alignment',
                '|',
                'bulletedList',
                'numberedList',
                'todoList',
                'outdent',
                'indent',
                '|',
                'undo',
                'redo'
            ],
            shouldNotGroupWhenFull: false,
        },
        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph',
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1',
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2',
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3',
                },
                {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'ck-heading_heading4',
                },
                {
                    model: 'heading5',
                    view: 'h5',
                    title: 'Heading 5',
                    class: 'ck-heading_heading5',
                },
                {
                    model: 'heading6',
                    view: 'h6',
                    title: 'Heading 6',
                    class: 'ck-heading_heading6',
                },
            ],
        },
        image: {
            toolbar: [
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                '|',
                'resizeImage'
            ],
            upload: {
                types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'],
            },
        },
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file',
                    },
                },
            },
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true,
            },
        },
        mention: {
            feeds: [
                {
                    marker: '[',
                    feed: ['[customer_name]', '[products_list]', '[cs_name]', '[tracking_number]', '[courier]'],
                    minimumCharacters: 0
                },
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableProperties',
                'tableCellProperties',
            ],
        },
    }

    if (props.placeHolder) {
        defaultConfig.placeholder = 'Type or paste your content here!'
    }

    return defaultConfig
})

// Watch for changes in modelValue prop to update editorData
watch(() => props.modelValue, (newValue) => {
    if (newValue !== editorData.value) {
        editorData.value = newValue
    }
}, { immediate: true })

// Watch for changes in editorData to emit update and handle image deletion
watch(editorData, (newValue, oldValue) => {
    emits('update:modelValue', newValue)

    // Handle image deletion when content changes
    if (oldValue && newValue !== oldValue) {
        handleImageDeletion(newValue || '', oldValue || '');
    }
})

onMounted(() => {
    isLayoutReady.value = true;
})

// Handle editor ready event
function onEditorReady(editor: any) {
    editorInstance.value = editor;

    // Initialize uploaded images from existing content
    if (props.modelValue) {
        const existingImages = extractImageUrls(props.modelValue);
        existingImages.forEach(url => uploadedImages.value.add(url));
    }
}

// Optional: Clean up any orphaned images when component is destroyed
// You may want to remove this if images should persist even after component unmount
onUnmounted(() => {
    // Note: Be careful with this - only enable if you want to delete images when component unmounts
    // This might not be desired behavior in most cases

    // if (uploadedImages.value.size > 0) {
    //     uploadedImages.value.forEach(async (imageUrl) => {
    //         try {
    //             await deleteImage("/images", imageUrl);
    //         } catch (error) {
    //             console.error('Failed to cleanup image on unmount:', imageUrl, error);
    //         }
    //     });
    // }
})
</script>

<template>
    <div class="ck-editor-wrapper">
        <ckeditor v-if="isLayoutReady && config" :editor="ClassicEditor" v-model="editorData" :config="config"
            :style="{ '--editor-height': height }" @ready="onEditorReady" />
    </div>
</template>

<style scoped>
:root {
    --ck-z-default: 100;
    --ck-z-panel: calc(var(--ck-z-default) + 999);
}

.ck-editor-wrapper {
    height: var(--editor-height, 300px);
}

.ck-editor-wrapper :deep(.ck-editor) {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.ck-editor-wrapper :deep(.ck-editor__main) {
    flex: 1;
    overflow: hidden;
}

.ck-editor-wrapper :deep(.ck-editor__editable) {
    height: calc(var(--editor-height, 300px) - 40px) !important;
    min-height: calc(var(--editor-height, 300px) - 40px) !important;
    max-height: calc(var(--editor-height, 300px) - 40px) !important;
    overflow-y: auto !important;
    resize: none !important;
}

.ck-editor-wrapper :deep(.ck-editor__editable:focus) {
    height: calc(var(--editor-height, 300px) - 40px) !important;
    min-height: calc(var(--editor-height, 300px) - 40px) !important;
    max-height: calc(var(--editor-height, 300px) - 40px) !important;
}

/* Ensure the editor container doesn't expand */
.ck-editor-wrapper :deep(.ck-editor__main > .ck-editor__editable) {
    flex: 1;
    box-sizing: border-box;
}
</style>