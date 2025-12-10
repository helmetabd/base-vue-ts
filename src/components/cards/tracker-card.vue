<script setup lang="ts">
import { formatDate } from '@/utils/calculationHelper';

defineProps({
    createdAt: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,
    },
    formatDateFrom: {
        type: String,
        default: 'YYYY-MM-DDTHH:mm:ssZ'
    },
    formatDateTo: {
        type: String,
        default: 'DD MMM YYYY - HH:mm:ss'
    }
})
</script>

<template>
    <div class="row text-muted text-uppercase fs-11">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-body table-responsive">
                    <div class="row">
                        <div class="col-md-6 text-muted">
                            Added: {{ formatDate(createdAt, formatDateFrom, formatDateTo) }} by {{ createdBy }}
                        </div>
                        <div class="col-md-6 text-end text-muted" v-if="updatedAt && updatedBy">
                            Modified: {{ formatDate(updatedAt, formatDateFrom, formatDateTo) }} by {{ updatedBy }}
                        </div>
                    </div>
                </div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>