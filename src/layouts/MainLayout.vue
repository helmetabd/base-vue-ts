<script setup lang="ts">
import { useLayoutStore } from '../stores/layout'
import Vertical from './VerticalLayout.vue'
import { useRoute } from 'vue-router'

const layoutStore = useLayoutStore()
const router = useRoute()
// mounted() {
//   // document.querySelector("html").setAttribute('dir', 'rtl');
// }
</script>

<template>
  <div>
    <Vertical
      v-if="
        layoutStore.layoutValue.layoutType === 'vertical' ||
        layoutStore.layoutValue.layoutType === 'semibox'
      "
      :layout="layoutStore.layoutValue.layoutType"
    >
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0" id="pageTitle">{{ router.meta.title }}</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item active">{{ router.meta.title }}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <slot />
    </Vertical>
  </div>
</template>
