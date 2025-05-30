<template>
    <div class="whatsapp-header">
        <i class="ri-arrow-left-line"></i>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Logo" />
        <span>Chat</span>
        <i class="ri-more-2-fill" style="margin-left:auto;"></i>
    </div>

    <div class="whatsapp-preview">
        <div class="whatsapp-message" v-if="formattedText || imageUrl">
            <!-- Display Image if Exists -->
            <div v-if="showImage && imageUrl" class="whatsapp-image">
                <img :src="image || ''" alt="Uploaded Image" />
            </div>

            <!-- Message Text as Caption -->
            <template v-if="formattedText">
                <span v-html="formattedText"></span>
                <div class="text-end">
                    <small class="text-muted time pe-1">{{ messageTime ?? time }}</small>
                    <i class="mdi mdi-check-all align-bottom"></i>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed } from 'vue';


const props = defineProps({
    showImage: {
        type: Boolean,
        default: true
    },
    messageTime: String,
    formattedText: String, // WhatsApp formatted text
    imageUrl: [String, File], // Image URL for preview
});

const imageSelector = () => {
    if (props.imageUrl) {
        if (typeof props.imageUrl == 'object') {
            return URL.createObjectURL(props.imageUrl)
        } else {
            return props.imageUrl
        }
    }
    return null
}

const image = computed(() => {
    return imageSelector()
})
const time = computed(() => moment(new Date()).format("hh:mm"))

</script>

<style scoped>
.whatsapp-header {
    display: flex;
    align-items: center;
    padding: 10px;
    background: #075e54;
    color: white;
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 900;
    /* border-radius: 10px 10px 0 0; */
}

.whatsapp-header img {
    width: 24px;
    margin: 0 10px;
}

.whatsapp-header i {
    font-size: 20px;
    margin: 0 10px;
    cursor: pointer;
}

.whatsapp-preview {
    padding: 10px;
    border-radius: 10px;
    display: flex;
    justify-content: end;
}

.whatsapp-image img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 5px;
}

.whatsapp-message {
    background: #dcf8c6;
    padding: 8px;
    color: black;
    border-radius: 5px;
    display: inline-block;
}

:deep(span p) {
    margin: 0;
    padding: 0;
}
</style>