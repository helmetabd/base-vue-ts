<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import router from '../../router'
import { reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { storeToRefs } from 'pinia'
const state = reactive({
  submitted: false,
  authError: null,
  tryingToLogIn: false,
  isAuthError: false,
  processing: false,
  particleConfig: {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 1000
        }
      },
      color: {
        value: '#ffffff'
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        },
        polygon: {
          nb_sides: 5
        },
        image: {
          src: 'img/github.svg',
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 4,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 130,
        color: '#ffffff',
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 3,
        direction: 'top',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: 'window',
      events: {
        onhover: {
          enable: true,
          mode: 'grab'
        },
        onclick: {
          enable: false,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        }
      }
    },
    retina_detect: true
  }
})
const submitForm = reactive({
  user_identity: null,
  password: ''
})
const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

// Validation schema using Yup
const validationSchema = yup.object({
  user_identity: yup.string().required('User Identity is required'),
  password: yup.string().required('Password is required')
})

// Use vee-validate form
const { handleSubmit, defineField, errors } = useForm({
  validationSchema,
  initialValues: {
    user_identity: '',
    password: ''
  }
})

const [user_identity, user_identityAttrs] = defineField('user_identity')
const [password, passwordAttrs] = defineField('password')

const signIn = handleSubmit(async (values) => {
  let loginData = {
    email: values.user_identity,
    password: values.password
  }
  authStore.signIn(loginData).then(() => router.replace({ name: 'dashboard' }))
})
</script>

<template>
  <div class="auth-page-wrapper pt-5">
    <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
      <vue-particles id="tsparticles" class="bg-overlay" :options="state.particleConfig" />
      <div class="shape">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 120">
          <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
        </svg>
      </div>
    </div>
    <div class="auth-page-content">
      <div class="container-sm">
        <div class="row">
          <div class="col">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <router-link :to="{ name: 'auth.login' }" class="d-inline-block auth-logo">
                  <img src="@/assets/images/logo-light.png" alt="" height="20" />
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div class="card mt-4">
              <div class="p-4">
                <div class="mt-2">
                  <div v-if="error" class="alert alert-danger mt-3 alert-dismissible text-center" role="alert">
                    <span>{{ error }}</span>
                  </div>

                  <form @submit.prevent="signIn">
                    <div class="mb-3">
                      <label for="user_identity" class="form-label">User Identity</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        :class="{ 'is-invalid': errors.user_identity }"
                        id="user_identity" 
                        placeholder="Enter Email / Phone / NIP"
                        v-model="user_identity" 
                        v-bind="user_identityAttrs"
                      />
                      <div v-if="errors.user_identity" class="invalid-feedback">
                        <span>{{ errors.user_identity }}</span>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label" for="password-input">Password</label>
                      <div class="position-relative auth-pass-inputgroup mb-3">
                        <input 
                          type="password" 
                          v-model="password" 
                          v-bind="passwordAttrs"
                          class="form-control pe-5"
                          :class="{ 'is-invalid': errors.password }"
                          placeholder="Enter password" 
                          id="password-input" 
                        />
                        <div v-if="errors.password" class="invalid-feedback">
                          <span>{{ errors.password }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="mt-4">
                      <button class="btn btn-success w-100" type="submit" :disabled="loading">
                        {{ loading ? 'Please wait' : 'Sign In' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <p class="mb-0">
                <i class="ri-copyright-line"></i> {{ new Date().getFullYear() }} Yudhistira. by IT
                GBNA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
