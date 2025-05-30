<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import router from '../../router'
import { reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { storeToRefs } from 'pinia'
import Lottie from "@/components/widgets/lottie.vue";
import animationData from "@/components/widgets/construction3.json";

const data = reactive({
    submitted: false,
    authError: null,
    tryingToLogIn: false,
    isAuthError: false,
    processing: false,
    defaultOptions: { animationData: animationData },
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

const signIn = handleSubmit((values) => {
    let loginData = {
        user_identity: values.user_identity,
        password: values.password
    }
    authStore.signIn(loginData).then(() => router.push({ name: 'dashboard' }))
})

const particlesLoaded = () => {
    // Callback function when particles are loaded
}
</script>

<template>
    <div class="d-flex flex-column min-vh-100">
        <div class="auth-page-wrapper pt-5">
            <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
                <vue-particles id="tsparticles" class="bg-overlay" :particlesLoaded="particlesLoaded"
                    :options="data.particleConfig" />
                <div class="shape">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 1440 120">
                        <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z">
                        </path>
                    </svg>
                </div>
            </div>
            <div class="auth-page-content">
                <div class="container-sm">
                    <div class="row justify-content-center">
                        <div class="col col-sm-10 col-md-8 col-lg-6 col-xl-5 mt-3">
                            <lottie :options="data.defaultOptions" />
                            <div class="text-center">
                                <h4 id="divQuote" class="text-center text-dark">
                                    Under Maintenance
                                </h4>
                                <div class="text-center">
                                    <em id="divQuoter">- We're Working on something good... -</em>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="mt-auto">
            <div class="my-4 text-center">
                <p class="mb-0"><i class="ri-copyright-line"></i> {{ new Date().getFullYear() }} Arjuna.
                    by
                    IT GBNA</p>
            </div>
        </footer>
    </div>
</template>
