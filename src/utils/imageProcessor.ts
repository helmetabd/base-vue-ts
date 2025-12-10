/**
 * Image Converter and Compressor Utility
 * Converts images to WebP format and compresses them for optimal file size
 */

export interface ImageProcessingOptions {
  quality?: number; // 0-1, default 0.8
  maxWidth?: number; // default 1920
  maxHeight?: number; // default 1080
  format?: 'webp' | 'jpeg' | 'png'; // default 'webp'
  maintainAspectRatio?: boolean; // default true
}

export interface ProcessedImageResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  originalFormat: string;
  processedFormat: string;
  dataUrl: string;
}

/**
 * Converts and compresses an image file to WebP format
 */
export async function convertAndCompressImage(
  file: File,
  options: ImageProcessingOptions = {},
  onProgress?: (p: number) => void
): Promise<ProcessedImageResult> {
  const {
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1080,
    format = 'webp',
    maintainAspectRatio = true
  } = options;

  return new Promise((resolve, reject) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      onProgress?.(100);
      reject(new Error('File is not an image'));
      return;
    }

    // initial progress
    onProgress?.(0);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // loaded image
        onProgress?.(25);
        // Calculate new dimensions
        const { width, height } = calculateDimensions(
          img.width, 
          img.height, 
          maxWidth, 
          maxHeight, 
          maintainAspectRatio
        );

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Clear canvas and draw image
        ctx!.clearRect(0, 0, width, height);
        ctx!.drawImage(img, 0, 0, width, height);

        // Convert to desired format
        const mimeType = `image/${format}`;
        // indicate compression stage
        onProgress?.(60);
        const dataUrl = canvas.toDataURL(mimeType, quality);

        // Convert data URL to File
        dataURLToFile(dataUrl, `${getFileNameWithoutExtension(file.name)}.${format}`)
          .then(compressedFile => {
            // finalizing
            onProgress?.(100);
            const result: ProcessedImageResult = {
              file: compressedFile,
              originalSize: file.size,
              compressedSize: compressedFile.size,
              compressionRatio: Math.round((1 - compressedFile.size / file.size) * 100),
              originalFormat: file.type,
              processedFormat: mimeType,
              dataUrl: dataUrl
            };

            resolve(result);
          })
          .catch(err => {
            onProgress?.(100);
            reject(err);
          });
      } catch (error) {
        onProgress?.(100);
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Process multiple images concurrently
 */
export async function convertAndCompressImages(
  files: File[],
  options: ImageProcessingOptions = {}
): Promise<ProcessedImageResult[]> {
  const promises = files.map(file => convertAndCompressImage(file, options));
  return Promise.all(promises);
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio: boolean
): { width: number; height: number } {
  if (!maintainAspectRatio) {
    return { 
      width: Math.min(originalWidth, maxWidth), 
      height: Math.min(originalHeight, maxHeight) 
    };
  }

  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  // Scale down if necessary
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return { 
    width: Math.round(width), 
    height: Math.round(height) 
  };
}

/**
 * Convert data URL to File object
 */
function dataURLToFile(dataURL: string, filename: string): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      const arr = dataURL.split(',');
      if (!arr || !arr[0]) {
        reject(new Error('Invalid data URL'));
        return;
      }

      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) {
        reject(new Error('Invalid data URL'));
        return;
      }

      const mime = mimeMatch[1];
      if (!arr[1]) {
        reject(new Error('Invalid data URL: missing base64 data'));
        return;
      }

      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      const file = new File([u8arr], filename, { type: mime });
      resolve(file);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Get filename without extension
 */
function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * Check if browser supports WebP format
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate image file size and dimensions
 */
export async function validateImage(
  file: File,
  options: {
    maxSizeInMB?: number;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    allowedFormats?: string[];
  } = {}
): Promise<{ isValid: boolean; errors: string[] }> {
  const {
    maxSizeInMB = 10,
    maxWidth = 4000,
    maxHeight = 4000,
    minWidth = 1,
    minHeight = 1,
    allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  } = options;

  const errors: string[] = [];

  // Check file type
  if (!allowedFormats.includes(file.type)) {
    errors.push(`Invalid file format. Allowed formats: ${allowedFormats.map(f => f.split('/')[1]).join(', ')}`);
  }

  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    errors.push(`File size too large. Maximum size: ${maxSizeInMB}MB`);
  }

  // Check dimensions
  try {
    const dimensions = await getImageDimensions(file);
    
    if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
      errors.push(`Image dimensions too large. Maximum: ${maxWidth}x${maxHeight}px`);
    }
    
    if (dimensions.width < minWidth || dimensions.height < minHeight) {
      errors.push(`Image dimensions too small. Minimum: ${minWidth}x${minHeight}px`);
    }
  } catch (e) {
    // preserve the error for debugging while returning a user-facing message
    // log to console so devs can inspect the root cause
    // (do not throw here; validation should return errors array)
  console.error('getImageDimensions error', e);
    errors.push('Failed to read image dimensions');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}