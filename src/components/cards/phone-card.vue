<!-- components/PhoneWrapper.vue -->
<template>
  <div class="phone-wrapper">
    <!-- Notch -->
    <div class="status-bar">
      <span class="time">{{ time }}</span>
      <div class="phone-notch"></div>
      <div class="status-icons">
        <i class="ri-signal-wifi-fill"></i>
        <i class="las la-signal"></i>
        <i class="ri-battery-fill"></i>
      </div>
    </div>

    <!-- Screen Area -->
    <div class="phone-screen">
      <slot></slot> <!-- Slot for dynamic content -->
    </div>

    <!-- Bottom Navigation (Home, Back, Recent Apps) -->
    <div class="phone-buttons">
      <i class="ri-arrow-left-s-line"></i>
      <i class="ri-circle-line"></i>
      <i class="ri-stop-line"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed } from 'vue';


const time = computed(() => moment(new Date()).format("hh:mm"))
</script>

<style scoped>
/* Phone Wrapper */
.phone-wrapper {
  width: 320px;
  height: 600px;
  background: black;
  border-radius: 30px;
  padding: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* Notch */
.phone-notch {
  width: 130px;
  height: 25px;
  background: black;
  border-radius: 0 0 10px 10px;
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
}

/* Status Bar */
.status-bar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px 15px;
  background-color: cadetblue;
  border-radius: 20px 20px 0 0;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* Status Icons */
.status-icons {
  display: flex;
  align-items: center;
}

.status-icons i {
  font-size: 11px;
  margin: 0 2px;
}

/* Screen */
.phone-screen {
  width: 100%;
  height: 100%;
  /* background-color: aliceblue; */
  background-image: url('~@/assets/images/whatsapp_background.png');
  background-size: contain;
  padding: 10px, 27px, 10px, 10px;
  box-sizing: content-box;
  overflow-y: auto;
}

/* Hide scrollbar for Chrome, Safari and Edge */
.phone-screen::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for Firefox */
.phone-screen {
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* Hide scrollbar for IE and Edge */
}


/* Bottom Buttons */
.phone-buttons {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 5px;
  background: #fff;
  border-radius: 0 0 20px 20px;
}

.phone-buttons i {
  font-size: 15px;
  color: grey;
}
</style>