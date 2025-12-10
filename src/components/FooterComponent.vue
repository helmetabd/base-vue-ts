<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col" col sm="6">
          <div class="d-flex justify-content-between">
            <div>{{ new Date().getFullYear() }} © {{ appName }} by IT GBNA.</div>
            <div>App Ver. 1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const appName = ref(import.meta.env.VITE_APP_NAME);
</script>