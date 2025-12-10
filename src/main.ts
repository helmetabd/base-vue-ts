import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import { loadSlim } from '@tsparticles/slim'
// import '@/utils/logger'
import VueApexCharts from 'vue3-apexcharts'
import checkRole from '@/utils/adminActionButton'
import checkOwner from '@/utils/ownerActionButton'
import checkPermission from '@/utils/checkPermission'
import { thousandSeparator } from '@/utils/dashboardHelper'

import App from './App.vue'
import router from './router'
import AOS from 'aos'
import Particles from '@tsparticles/vue3'
import VueFeather from 'vue-feather' //feather icon
// import Maska from 'maska' //for client validation input type that forbiden user from input different format
import Multiselect from '@vueform/multiselect'
import Vue3ColorPicker from "vue3-colorpicker";

import './assets/scss/config/minimal/app.scss'
import "@vueform/multiselect/themes/default.scss";
import 'bootstrap/dist/js/bootstrap.bundle'
import 'remixicon/fonts/remixicon.css'
import 'aos/dist/aos.css'
import '@vueform/multiselect/themes/default.css'
import "vue3-colorpicker/style.css";

const app = createApp(App)

const pinia = createPinia()
pinia.use(createPersistedStatePlugin())
app.use(pinia)

AOS.init({
  easing: 'ease-out-back',
  duration: 1000
})

app.use(router)
app.use(Vue3ColorPicker);
app.component(VueFeather.type, VueFeather)
app.component('apexchart', VueApexCharts)
app.component('MultiSelect', Multiselect)
// app.use(Maska)
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine) // you can load the full tsParticles library from "tsparticles" if you need it
  }
})

// expose commonly used helpers to templates via globalProperties
app.config.globalProperties.checkRole = checkRole
app.config.globalProperties.checkOwner = checkOwner
app.config.globalProperties.checkPermission = checkPermission
app.config.globalProperties.thousandSeparator = thousandSeparator

app.mount('#app')
