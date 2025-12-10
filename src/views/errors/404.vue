<script setup lang="ts">
import animationData from "@/components/widgets/etwtznjn.json"
import Lottie from "@/components/widgets/lottie.vue"

const defaultOptions = { animationData }
</script>

<template>
    <div class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div class="bg-overlay"></div>
        <div class="auth-page-content overflow-hidden pt-lg-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col" xl="5">
                        <BCard no-body class="overflow-hidden">
                            <BCardBody class="p-4">
                                <div class="text-center">
                                    <lottie colors="primary:#405189,secondary:#0ab39c" :options="defaultOptions"
                                        style="height:7.5rem;width:7.5rem;" />
                                    <h1 class="text-primary mb-4">Oops !</h1>
                                    <h4 class="text-uppercase">Sorry, Page not Found 😭</h4>
                                    <p class="text-muted mb-4">The page you are looking for not available!</p>
                                    <router-link :to="{name: 'auth.login'}" class="btn btn-success"><i class="mdi mdi-home me-1"></i>Back to
                                        home</router-link>
                                </div>
                            </BCardBody>
                        </BCard>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>