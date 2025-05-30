<script setup lang="ts">
import PieChart from './PieChart.vue';
defineProps({
    dataPie: Array,
    labelPie: Array,
    value: Object
})
</script>

<template>
    <div class="card card-animate overflow-hidden">
        <h5 class="text-start fw-semibold mt-4 ms-4 mb-0">Employee Status</h5>
        <div class="card-body">
            <div class="row h-100 justify-content-center align-items-center">
                <div class="row justify-content-center align-items-center">
                    <div class="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                        <PieChart :height="200" :width="200" :data="dataPie" :label="labelPie" />
                    </div>
                    <div class="col-xl-8 col-lg-12 col-md-12 col-sm-12">
                        <div class="table-responsive">
                            <table id="datatable" class="table nowrap table-hover fs-11 align-middle text-uppercase"
                                style="width: 100%;">
                                <thead>
                                    <tr class="text-info text-uppercase">
                                        <th class="pt-2 pb-2">Status</th>
                                        <th class="text-end pt-2 pb-2">Male</th>
                                        <th class="text-end pt-2 pb-2">Female</th>
                                        <th class="text-end pt-2 pb-2 hide-xs">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td class="pt-2 pb-2">
                                            <strong>Active</strong>
                                        </td>
                                        <td class="text-end pt-2 pb-2">
                                            {{ value?.active_male }}
                                        </td>
                                        <td class="text-end pt-2 pb-2">
                                            {{ value?.active_female }}
                                        </td>
                                        <td class="text-end pt-2 pb-2 hide-xs">{{ value?.active }}</td>
                                    </tr>
                                    <tr>
                                        <td class="pt-2 pb-2">
                                            <strong>Resigned</strong>
                                        </td>
                                        <td class="text-end pt-2 pb-2">
                                            {{ value?.resigned_male }}</td>
                                        <td class="text-end pt-2 pb-2">
                                            {{ value?.resigned_female }}
                                        </td>
                                        <td class="text-end pt-2 pb-2 hide-xs">{{ value?.resigned }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style></style>