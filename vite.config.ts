import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  // base: './',
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
        quietDeps: true
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~@': '/src/'
    }
  },
  build: {
    rollupOptions: {
      // Leave treeshake default (true) for smaller bundles; disable only for debugging
      // treeshake: false,
      output: {
        // Using function form for compatibility with current Vite (rolldown) type definitions
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Core Vue ecosystem - load eagerly
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vendor-vue'
            }

            // Charts - lazy load with chart components
            if (id.includes('apexcharts')) {
              return 'vendor-charts'
            }

            // Editor - lazy load with editor components (split further to reduce chunk)
            if (id.includes('ckeditor5-ui')) {
              return 'vendor-editor-ui'
            }
            if (id.includes('ckeditor5-engine')) {
              return 'vendor-editor-engine'
            }
            if (id.includes('ckeditor5-core') || id.includes('ckeditor5-utils')) {
              return 'vendor-editor-core'
            }
            if (id.includes('ckeditor')) {
              return 'vendor-editor'
            }

            // Animations - separate chunk for lottie
            if (id.includes('lottie-web') || id.includes('@tsparticles')) {
              return 'vendor-animations'
            }

            // Date/time utilities
            if (id.includes('moment') || id.includes('flatpickr')) {
              return 'vendor-datetime'
            }

            // Form validation & utilities
            if (id.includes('vee-validate') || id.includes('yup')) {
              return 'vendor-form'
            }

            // Image/media processing
            if (id.includes('cropper') || id.includes('jsbarcode')) {
              return 'vendor-media'
            }

            // UI components & libraries
            if (
              id.includes('bootstrap') ||
              id.includes('multiselect') ||
              id.includes('sweetalert2') ||
              id.includes('simplebar') ||
              id.includes('swiper') ||
              id.includes('aos') ||
              id.includes('feather')
            ) {
              return 'vendor-ui'
            }

            // HTTP & utilities (axios, lodash, etc)
            if (
              id.includes('axios') ||
              id.includes('lodash') ||
              id.includes('format-axios-error')
            ) {
              return 'vendor-http'
            }

            // Icon libraries - separate to cache independently
            if (
              id.includes('remixicon') ||
              id.includes('boxicons') ||
              id.includes('materialdesignicons')
            ) {
              return 'vendor-icons'
            }

            // Remaining node_modules - catch-all for smaller dependencies
            return 'vendor-misc'
          }
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild', // Now using esbuild for fast minification
    sourcemap: process.env.VITE_SOURCEMAP === 'true',
    chunkSizeWarningLimit: 600, // Lower threshold to catch bloated chunks earlier
    cssCodeSplit: true // Enable CSS code splitting for better caching
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@vueform/multiselect',
      'axios',
      'sweetalert2',
      'apexcharts',
      'vue3-apexcharts'
    ]
  }
})
