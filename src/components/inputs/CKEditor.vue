<script setup lang="ts">
import { ref, watch } from 'vue'
import { Ckeditor } from '@ckeditor/ckeditor5-vue'
import 'ckeditor5/ckeditor5.css';

import {
    ClassicEditor,
    Autoformat,
    Autosave,
    Bold,
    Emoji,
    Essentials,
    Italic,
    Link,
    List,
    Mention,
    Paragraph,
    PasteFromOffice,
    Strikethrough,
    TextTransformation,
    Underline,
    WordCount,
} from 'ckeditor5'
import { computed } from 'vue';

const props = defineProps({
    modelValue: String,
    placeHolder: {
        type: Boolean,
        default: true
    }
})
const emits = defineEmits(['update:modelValue'])

const editorData = ref(props.modelValue)

const config = computed(() => {
    let defaultConfig: any = {
        licenseKey: 'GPL',
        plugins: [
            Autoformat,
            Autosave,
            Bold,
            Emoji,
            Essentials,
            Italic,
            Link,
            List,
            Mention,
            Paragraph,
            PasteFromOffice,
            Strikethrough,
            TextTransformation,
            WordCount
        ],
        toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'strikethrough', '|', 'emoji', '|', 'bulletedList', 'numberedList'],
        mention: {
            feeds: [
                {
                    marker: '[',
                    feed: ['[customer_name]', '[products_list]', '[cs_name]', '[tracking_number]', '[courier]'],
                    minimumCharacters: 0
                },
            ]
        },
    }
    if (props.placeHolder) {
        defaultConfig.placeholder = 'Type or paste your content here!'
    }
    return defaultConfig
})

watch(editorData, (newValue) => {
    emits('update:modelValue', newValue)
})
</script>

<template>
    <div>
        <ckeditor :editor="ClassicEditor" v-model="editorData" :config="config" />
    </div>
</template>

<style scoped>
:root {
    --ck-z-default: 100;
    --ck-z-panel: calc(var(--ck-z-default) + 999);
}
</style>