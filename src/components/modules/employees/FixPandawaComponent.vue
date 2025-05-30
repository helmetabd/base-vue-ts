<script setup>
import { reactive } from 'vue'
import ModalBasic from '@/components/modals/ModalBasic.vue'
import apiClient from '@/service/ApiClientService';
// import Swal from 'sweetalert2';
import { responseHelper } from '@/utils/responseHelper';

const props = defineProps(['employee_id'])
const state = reactive({
    fixPandawaType: 1,
    modalFixPandawa: false,
    pandawaData: null,
    fixPandawaError: false,
    fixPandawaErrorMessage: ''
})
const submitPandawaFix = async (event) => {
    let formData = new FormData(event.target)
    apiClient.post(`/employees/${props.employee_id}/sync-pandawa`, formData)
        .then((res) => responseHelper('success', res, undefined, () => { state.modalFixPandawa = false }))
        .catch((error) => {
            state.fixPandawaErrorMessage = error.response?.data?.message ?? error.message
            state.fixPandawaError = true
        })
}
</script>
<template>
    <div class="mt-3 mb-3">
        <button type="button" class="btn btn-sm btn-warning" @click="() => {
            state.modalFixPandawa = true; state.checked = false
        }">
            <i class="las la-link"></i>
            <span class="hide-xs">Create/Fix Pandawa Account</span>
        </button>
    </div>
    <ModalBasic :modelValue="state.modalFixPandawa" titleClass="text-info text-uppercase"
        headerClass="border-bottom border-bottom-dashed" footerClass="border-top border-top-dashed"
        title="Fix Pandawa Account" @toggle="state.modalFixPandawa = $event">
        <template #modalBody>
            <form id="fix_pandawa_form" action="#" @submit.prevent="(e) => submitPandawaFix(e)">
                <input name="employee_id" type="hidden" :value="employee_id">
                <div class="alert alert-danger alert-border-left alert-dismissible fade show mb-2" role="alert"
                    id="formAlert_fixPandawaAccount" v-if="state.fixPandawaError">
                    <i class="ri-error-warning-line me-1 align-middle"></i>
                    <strong>Error</strong> - <span>
                        {{ state.fixPandawaErrorMessage }}
                    </span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <div class="col-12">
                    <select name="type" class="form-select" v-model="state.fixPandawaType" required>
                        <option value="1">New Pandawa Account</option>
                        <option value="2">Existing</option>
                    </select>
                </div>
                <div class="col-12 arjuna_data" v-if="state.fixPandawaType == 2">
                    <hr class="text-muted arjuna_data">
                    <label class="form-label" for="pandawa_email">Pandawa Email Login</label>
                    <input class="form-control bg-light" type="email" name="pandawa_email" required>
                </div>
            </form>

        </template>
        <template #modalFooter>
            <div class="col">
                <div class="row">
                    <div class="col col-lg-5 mt-2">
                        <input v-model="state.checked" type="checkbox" id="checkboxEditProfile"
                            style="margin-right: 4px" />
                        <label for="checkboxEditProfile" class="fs-12">Confirm</label>
                    </div>
                    <div class="col col-lg-7 hstack justify-content-end">
                        <button style="margin-right: 1em" type="button" class="btn btn-light btn-sm"
                            @click="state.modalFixPandawa = false">
                            Close
                        </button>
                        <button form="fix_pandawa_form" type="submit" variant="primary" class="btn btn-info btn-sm"
                            :class="!state.checked ? 'disabled' : ''">
                            <i class="ri-check-line align-middle me-1"></i>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </ModalBasic>
</template>