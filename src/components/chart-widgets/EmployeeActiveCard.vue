<script setup lang="ts">
import { computed, reactive } from 'vue';
import PieChart from './PieChart.vue';
import { calculatePercentage } from '@/utils/calculationHelper';
const props = defineProps({
    labelPie: Array,
    value: Object,
})

const state = reactive({
    gender: 'total' as string,
    data: props.value,
    renderKey: 0 as number,
    dataPie: [] as any
})

function changeGender(gender: string) {
    state.gender = gender
    firstSet()
    rerender()
}

function firstSet(type: string = state.gender) {
    const core: number = state.data?.core[type]
    const support: number = state.data?.support[type]
    const total: number = core + support
    const data_core = calculatePercentage(core, total)
    const data_support = calculatePercentage(support, total)
    state.dataPie = [data_core, data_support]
}

const total = computed(() => {
    return state.data?.core[state.gender] + state.data?.support[state.gender]
})

function rerender() {
    state.renderKey++
}

firstSet()

</script>
2
<template>
    <div class="card card-animate overflow-hidden">
        <div class="card-body pe-0">
            <div class="row h-100">
                <!-- <div class="d-flex align-items-center"> -->
                <h5 class="text-start fw-semibold">Employee Active by Division</h5>
                <div class="row align-content-center align-items-center pe-0">
                    <div class="col-xl-4 col-lg-12" :key="state.renderKey">
                        <PieChart :height="150" :width="150" :data="state.dataPie" :label="labelPie" :noLegend="true" />
                    </div>
                    <div class="col-xl-8 col-lg-12">
                        <div class="d-flex justify-content-end">
                            <div class="btn-group-sm" role="group">
                                <button class="btn btn-sm bg-info text-white dropdown-toggle" data-bs-toggle="dropdown"
                                    aria-expanded="false">{{ state.gender == 'total' ? 'Gender' : state.gender == 'male'
                                        ? 'Male' : 'Female' }}</button>
                                <ul class="dropdown-menu">
                                    <li><span style="" class="dropdown-item"
                                            @click="changeGender('total')">Gender</span></li>
                                    <li><span class="dropdown-item" @click="changeGender('male')">Male</span></li>
                                    <li><span class="dropdown-item" @click="changeGender('female')">Female</span></li>
                                </ul>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table id="datatable" class="table nowrap table-hover fs-10 align-middle text-uppercase"
                                style="width: 100%;" v-if="value">
                                <thead>
                                    <tr class="text-info text-uppercase">
                                        <th class="pt-2 pb-2">Division</th>
                                        <th class="text-end pt-2 pb-2">Total</th>
                                        <th class="text-end pt-2 pb-2 hide-xs">%</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td class="pt-2 pb-2">
                                            <strong>Core</strong>
                                        </td>
                                        <td class="text-end pt-2 pb-2"
                                            v-if="value?.core != null || value?.core != undefined">
                                            {{ state.data?.core[state.gender] }}
                                        </td>
                                        <td class="text-end pt-2 pb-2 hide-xs">{{
                                            calculatePercentage(state.data?.core[state.gender], total) }}</td>
                                    </tr>
                                    <tr>
                                        <td class="pt-2 pb-2">
                                            <strong>Support</strong>
                                        </td>
                                        <td class="text-end pt-2 pb-2"
                                            v-if="value?.support != null || value?.support != undefined">
                                            {{ state.data?.support[state.gender] }}</td>
                                        <td class="text-end pt-2 pb-2 hide-xs">{{
                                            calculatePercentage(state.data?.support[state.gender], total) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- </div> -->
                </div>
            </div>
        </div>
    </div>
</template>