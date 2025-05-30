<script setup lang="ts">
import { computed, reactive } from 'vue';
import { calculatePercentage } from '@/utils/calculationHelper';
import DonutChart from './DonutChart.vue';
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
interface DataArray {
    label: string
    value: number
    percentage: number
}

const totalSum = computed((): number => {
    return state.data?.series.reduce((acc: number, val: number) => acc + val, 0)
})

const percentageArray = computed((): number[] => {
    return state.data?.series.map((num: number) => calculatePercentage(num, totalSum.value))
})

const combineArray = computed((): DataArray[] =>
    state.data?.series.map((value: number, index: number) => ({
        label: state.data?.xaxis[index],
        value: value,
        percentage: percentageArray.value[index]
    }))
)

</script>

<template>
    <div class="card card-animate overflow-hidden">
        <div class="card-body pe-0">
            <div class="row h-100">
                <!-- <div class="d-flex align-items-center"> -->
                <h5 class="text-start fw-semibold">Employee Active by Education</h5>
                <div class="row align-content-center align-items-center pe-0">
                    <div class="col-xl-4 col-lg-12 col-md-12 col-sm-12" :key="state.renderKey">
                        <DonutChart :height="150" :width="150" :data="percentageArray" :label="labelPie"
                            :noLegend="true" />
                    </div>
                    <div class="col-xl-8 col-lg-12 col-md-12 col-sm-12">
                        <div class="table-responsive">
                            <table id="datatable" class="table nowrap table-hover fs-10 align-middle text-uppercase"
                                style="width: 100%;" v-if="value != null || value != undefined">
                                <thead>
                                    <tr class="text-info text-uppercase">
                                        <th class="pt-2 pb-2">Education</th>
                                        <th class="text-end pt-2 pb-2">Total</th>
                                        <th class="text-end pt-2 pb-2 hide-xs">%</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="(item, index) in combineArray" :key="index">
                                        <td class="pt-2 pb-2">
                                            <strong>{{ item.label }}</strong>
                                        </td>
                                        <td class="text-end pt-2 pb-2">
                                            {{ item.value }}
                                        </td>
                                        <td class="text-end pt-2 pb-2 hide-xs">
                                            {{ item.percentage }}
                                        </td>
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