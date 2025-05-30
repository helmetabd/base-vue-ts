<script>
export default {
};
</script>
<template>
    <div class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div class="bg-overlay"></div>
        <div class="auth-page-content overflow-hidden pt-lg-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col" xl="5">
                        <Bcard no-body class="card overflow-hidden">
                            <BCardBody class="p-4">
                                <div class="text-center">
                                    <img :src="require('../../assets/images/offline.gif')" alt=""
                                        height="210">
                                    <h3 class="mt-4 fw-semibold">We're currently offline</h3>
                                    <p class="text-muted mb-4 fs-14">We can't show you this images because you aren't
                                        connected to the internet. When you’re back online refresh the page or hit the
                                        button below</p>
                                    <BButton variant="success" class="btn-border"
                                        onClick="window.location.href=window.location.href"><i
                                            class="ri-refresh-line align-bottom"></i> Refresh</BButton>
                                </div>
                            </BCardBody>
                        </Bcard>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>