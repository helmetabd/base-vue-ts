/**
 * Vue Composable for Image Processing
 * Provides reactive image processing functionality with WebP conversion and compression
 */

import { ref, computed } from 'vue'
import { 
    convertAndCompressImage, 
    convertAndCompressImages,
    validateImage,
    getImageDimensions,
    supportsWebP,
    formatFileSize,
    type ImageProcessingOptions,
    type ProcessedImageResult
} from '@/utils/imageProcessor'

export interface UseImageProcessorOptions extends ImageProcessingOptions {
    autoProcess?: boolean
    validateOnUpload?: boolean
    maxSizeInMB?: number
    allowedFormats?: string[]
}

export function useImageProcessor(options: UseImageProcessorOptions = {}) {
    // Reactive state
    const isProcessing = ref(false)
    const processedImages = ref<ProcessedImageResult[]>([])
    const errors = ref<string[]>([])
    const webpSupported = ref(false)
    const totalOriginalSize = ref(0)
    const totalCompressedSize = ref(0)

    // Default options
    const defaultOptions: UseImageProcessorOptions = {
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
        format: 'webp',
        autoProcess: true,
        validateOnUpload: true,
        maxSizeInMB: 10,
        allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        maintainAspectRatio: true
    }

    const config = { ...defaultOptions, ...options }

    // Computed properties
    const totalCompressionRatio = computed(() => {
        if (totalOriginalSize.value === 0) return 0
        return Math.round((1 - totalCompressedSize.value / totalOriginalSize.value) * 100)
    })

    const hasErrors = computed(() => errors.value.length > 0)

    const stats = computed(() => ({
        totalFiles: processedImages.value.length,
        totalOriginalSize: totalOriginalSize.value,
        totalCompressedSize: totalCompressedSize.value,
        totalSaved: totalOriginalSize.value - totalCompressedSize.value,
        compressionRatio: totalCompressionRatio.value,
        averageCompression: processedImages.value.length > 0 
            ? Math.round(processedImages.value.reduce((acc, img) => acc + img.compressionRatio, 0) / processedImages.value.length)
            : 0
    }))

    // Initialize WebP support check
    const initializeWebPSupport = async () => {
        webpSupported.value = await supportsWebP()
        
        // Auto-adjust format based on support
        if (!webpSupported.value && config.format === 'webp') {
            config.format = 'jpeg'
        }
    }

    // Validate a single image
    const validateImageFile = async (file: File): Promise<boolean> => {
        if (!config.validateOnUpload) return true

        const validation = await validateImage(file, {
            maxSizeInMB: config.maxSizeInMB,
            maxWidth: config.maxWidth! * 2, // Allow larger input for compression
            maxHeight: config.maxHeight! * 2,
            allowedFormats: config.allowedFormats
        })

        if (!validation.isValid) {
            errors.value.push(...validation.errors)
            return false
        }

        return true
    }

    // Process a single image
    const processImage = async (file: File): Promise<ProcessedImageResult | null> => {
        try {
            // Validate first if enabled
            if (config.validateOnUpload) {
                const isValid = await validateImageFile(file)
                if (!isValid) return null
            }

            isProcessing.value = true
            const result = await convertAndCompressImage(file, config)
            
            processedImages.value.push(result)
            totalOriginalSize.value += result.originalSize
            totalCompressedSize.value += result.compressedSize

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown processing error'
            errors.value.push(`Failed to process ${file.name}: ${errorMessage}`)
            return null
        } finally {
            isProcessing.value = false
        }
    }

    // Process multiple images
    const processImages = async (files: File[]): Promise<ProcessedImageResult[]> => {
        const results: ProcessedImageResult[] = []
        isProcessing.value = true

        try {
            // Validate all files first if enabled
            if (config.validateOnUpload) {
                const validationPromises = files.map(validateImageFile)
                const validationResults = await Promise.all(validationPromises)
                
                if (validationResults.some(result => !result)) {
                    // Some files failed validation
                    const validFiles = files.filter((_, index) => validationResults[index])
                    files = validFiles
                }
            }

            // Process all valid files
            const processedResults = await convertAndCompressImages(files, config)
            
            for (const result of processedResults) {
                processedImages.value.push(result)
                totalOriginalSize.value += result.originalSize
                totalCompressedSize.value += result.compressedSize
                results.push(result)
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown processing error'
            errors.value.push(`Batch processing failed: ${errorMessage}`)
        } finally {
            isProcessing.value = false
        }

        return results
    }

    // Get image dimensions from file
    const getImageInfo = async (file: File) => {
        try {
            const dimensions = await getImageDimensions(file)
            return {
                dimensions,
                size: file.size,
                type: file.type,
                name: file.name,
                formattedSize: formatFileSize(file.size)
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            errors.value.push(`Failed to get image info for ${file.name}: ${errorMessage}`)
            return null
        }
    }

    // Clear all data
    const reset = () => {
        processedImages.value = []
        errors.value = []
        totalOriginalSize.value = 0
        totalCompressedSize.value = 0
        isProcessing.value = false
    }

    // Clear errors
    const clearErrors = () => {
        errors.value = []
    }

    // Update configuration
    const updateConfig = (newOptions: Partial<UseImageProcessorOptions>) => {
        Object.assign(config, newOptions)
    }

    // Initialize
    initializeWebPSupport()

    return {
        // State
        isProcessing: readonly(isProcessing),
        processedImages: readonly(processedImages),
        errors: readonly(errors),
        webpSupported: readonly(webpSupported),
        
        // Computed
        stats,
        hasErrors,
        totalCompressionRatio,
        
        // Methods
        processImage,
        processImages,
        validateImageFile,
        getImageInfo,
        reset,
        clearErrors,
        updateConfig,
        
        // Utilities
        formatFileSize,
        
        // Configuration
        config
    }
}

// Helper function to create a file processing factory
export function createImageProcessor(options: UseImageProcessorOptions = {}) {
    return () => useImageProcessor(options)
}

// Export readonly function for reactive refs
function readonly<T>(ref: { value: T }) {
    return computed(() => ref.value)
}