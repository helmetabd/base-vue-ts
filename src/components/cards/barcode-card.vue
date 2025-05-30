<!-- <template>
  <div>
    Pass the barcode string as a prop
    <div ref="barcodeDiv"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import JsBarcode from 'jsbarcode'

// Props to accept the barcode value
const props = defineProps<{ value: string }>()

// Reference to the div where the barcode will be rendered
const barcodeDiv = ref<HTMLDivElement | null>(null)

// Function to generate the barcode inside the div
const generateBarcode = () => {
  if (barcodeDiv.value) {
    JsBarcode(barcodeDiv.value, props.value, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 100,
      displayValue: true
    })
  }
}

// Watch for changes in the prop value and regenerate the barcode
watch(() => props.value, generateBarcode)

// Generate barcode on component mount
onMounted(() => {
  generateBarcode()
})
</script>

<style scoped>
div {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  display: inline-block;
}
</style> -->

<!-- <template>
  <div class="card-footer pt-2 pb-2 bg-light hide-xs">
    <div class="barcode-container" ref="barcodeContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// Define props for the barcode value
const props = defineProps<{ value: string }>()

// Reference to the barcode container div
const barcodeContainer = ref<HTMLDivElement | null>(null)

// Function to generate the barcode as divs
const generateBarcode = (value: string) => {
  if (!barcodeContainer.value) return

  // Clear existing barcode divs
  barcodeContainer.value.innerHTML = ''

  let position = 0

  // Example logic for generating the barcode based on the string
  for (let i = 0; i < value.length; i++) {
    const char = value[i]

    // Simulate different width bars based on character (you can customize this)
    const width = char.charCodeAt(0) % 2 === 0 ? 6 : 3 // Example logic: even/odd ASCII
    const height = 20 // Fixed height for each bar

    // Create the div element for the barcode bar
    const bar = document.createElement('div')
    bar.style.backgroundColor = 'black'
    bar.style.width = `${width}px`
    bar.style.height = `${height}px`
    bar.style.position = 'absolute'
    bar.style.left = `${position}px`
    bar.style.top = '0px'

    // Add the bar to the container
    barcodeContainer.value.appendChild(bar)

    // Move position for the next bar
    position += width + 3 // Add spacing between bars (3px in this case)
  }
}

// Watch for changes in the props.value and regenerate the barcode
watch(
  () => props.value,
  (newVal) => {
    generateBarcode(newVal)
  }
)

// Generate the barcode when the component is mounted
onMounted(() => {
  generateBarcode(props.value)
})
</script>

<style scoped>
.barcode-container {
  position: relative; 
  font-size: 0;
  width: 336px; /* You can adjust width based on the content */
  height: 20px;
}
</style> -->

<template>
  <div class="barcode-container" ref="barcodeContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import JsBarcode from 'jsbarcode'

// Props for accepting the barcode value
const props = defineProps<{ value: string | number }>()

// Reference to the div where the barcode will be rendered
const barcodeContainer = ref<HTMLDivElement | null>(null)

// Function to convert JsBarcode generated SVG path data into divs for rendering
const generateBarcode = (value: string | number) => {
  if (!barcodeContainer.value) return

  // Clear existing barcode divs
  barcodeContainer.value.innerHTML = ''

  // Create a dummy SVG element to use JsBarcode to generate the path data
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  if (typeof value == 'number') {
    value = value.toString()
  }

  // Generate the barcode using JsBarcode
  JsBarcode(svg, value, {
    format: 'CODE128B',
    height: 20,
    width: 3,
    displayValue: false // We don't want the human-readable value
  })

  // Extract the path data (the actual barcode)
  const path = svg.querySelector('rect')
  if (!path) return

  // JsBarcode generates a series of rects for black bars, so we will convert them to divs
  const rects = svg.querySelectorAll('rect')

  rects.forEach((rect) => {
    const bar = document.createElement('div')
    const x = parseFloat(rect.getAttribute('x') || '0')
    const width = parseFloat(rect.getAttribute('width') || '0')
    const height = parseFloat(rect.getAttribute('height') || '0')

    if (width > 12) {
      return // Skip large background rects
    }

    // Set the styles for each bar
    bar.style.backgroundColor = 'black'
    bar.style.position = 'absolute'
    bar.style.left = `${x}px`
    bar.style.width = `${width}px`
    bar.style.height = `${height}px`
    bar.style.top = '0'

    // Append the bar to the container
    barcodeContainer.value?.appendChild(bar)
  })
}

// Watch for changes in the value and regenerate the barcode
watch(
  () => props.value,
  (newVal) => {
    generateBarcode(newVal)
  }
)

// Generate barcode when the component is mounted
onMounted(() => {
  generateBarcode(props.value)
})
</script>

<style scoped>
.barcode-container {
  position: relative;
  font-size: 0;
  width: 336px; /* You can adjust this width dynamically */
  height: 20px; /* Adjust height based on your barcode size */
}
</style>
