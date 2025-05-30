<template>
  <Layout>
    <!-- <div>
      <input v-model="barcodeValue" placeholder="Enter value for barcode" />
      <button @click="generateBarcode">Generate Barcode</button>
      <svg ref="barcodeSvg"></svg>
      <canvas ref="barcodeCanvas"></canvas>
    </div> -->
    <BarcodeCard value="72023120127"></BarcodeCard>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/layouts/MainLayout.vue'
import { ref, onMounted } from 'vue'
import JsBarcode from 'jsbarcode'
import BarcodeCard from '@/components/cards/barcode-card.vue'

// Reactive input value for the barcode
const barcodeValue = ref<string>('123456789012')

// Reference to the canvas element where the barcode will be rendered
const barcodeCanvas = ref<HTMLCanvasElement | null>(null)

// Function to generate the barcode
const generateBarcode = () => {
  if (barcodeCanvas.value) {
    JsBarcode(barcodeCanvas.value, barcodeValue.value, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 100,
      displayValue: false
    })
  }
}

// Generate a default barcode on component mount
onMounted(() => {
  generateBarcode()
})
</script>

<style scoped>
input {
  margin-right: 10px;
}
canvas {
  margin-top: 20px;
  border: 1px solid #000;
}
</style>
