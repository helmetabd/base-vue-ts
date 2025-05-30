<!-- CarouselWrapper.vue -->
<template>
    <div class="carousel-container">
        <button class="nav-btn left" @click="$emit('prev')">
            <i class="ri-arrow-left-s-line"></i>
        </button>

        <div class="carousel-phone">
            <slot /> <!-- PhoneWrapper goes here -->
        </div>

        <button class="nav-btn right" @click="$emit('next')">
            <i class="ri-arrow-right-s-line"></i>
        </button>
    </div>
</template>

<style scoped>
.carousel-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
}

.carousel-phone {
    position: relative;
}

.nav-btn {
    background: white;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.nav-btn:hover {
    background: #f0f0f0;
}

.left {
    order: -1;
}
</style>