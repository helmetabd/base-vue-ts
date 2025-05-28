import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { loadSlim } from '@tsparticles/slim'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'
import AOS from 'aos'
import Particles from '@tsparticles/vue3'
import VueFeather from 'vue-feather' //feather icon
// import Maska from 'maska' //for client validation input type that forbiden user from input different format
import Multiselect from '@vueform/multiselect'

import './assets/main.css'
import './assets/scss/config/default/app.scss'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'remixicon/fonts/remixicon.css'
import 'aos/dist/aos.css'
import '@vueform/multiselect/themes/default.css'

const app = createApp(App)

AOS.init({
  easing: 'ease-out-back',
  duration: 1000
})

app.use(createPinia())
app.use(router)
app.component(VueFeather.type, VueFeather)
app.component('apexchart', VueApexCharts)
app.component('MultiSelect', Multiselect)
// app.use(Maska)
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine) // you can load the full tsParticles library from "tsparticles" if you need it
  }
})

app.mount('#app')
