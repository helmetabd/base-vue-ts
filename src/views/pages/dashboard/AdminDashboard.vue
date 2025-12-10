<!-- <script setup lang="ts">
import type { Dashboard, Option, SpecialDashboard } from '@/interfaces/Utils';
import { reactive, watch } from 'vue';
import TurnOverRateCard from '@/components/chart-widgets/TurnOverRateCard.vue';
import AnualGrowth from '@/components/chart-widgets/AnualGrowth.vue';
import GrowthAgainstResign from '@/components/chart-widgets/GrowthAgainstResign.vue';
import EducationLevel from '@/components/chart-widgets/EducationLevel.vue';
import { utilsService } from '@/service';
import EmployeeStatusCard from '@/components/chart-widgets/EmployeeStatusCard.vue';
import EmployeeActiveCard from '@/components/chart-widgets/EmployeeActiveCard.vue';
import EmployeeActiveEducationCard from '@/components/chart-widgets/EmployeeActiveEducationCard.vue';
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment';
import CounterCard from '@/components/cards/counter-card.vue';

const router = useRouter()
const route = useRoute()

interface ParamsDashboard extends SpecialDashboard {
    office?: number
    month?: number
    year?: number
}

const currentYear = moment().year();

const state = reactive({
    dashboard: {} as Dashboard,
    fetchParams: {
        year: moment().year()
    } as ParamsDashboard,
    monthList: [] as Option[],
    officeList: [] as Option[],
    yearList: [] as number[],
    renderKey: 0 as number,
})

for (let year = currentYear; year >= 2021; year--) {
    state.yearList.push(year);
}

function selectParams(type: 'office' | 'month' | 'year', value: number) {
    state.fetchParams[type] = value
    changeRoute()
}

function changeRoute() {
    const paramData = Object.fromEntries(
        Object.entries(state.fetchParams).filter(([, value]) => value !== null)
    )
    router.replace({
        query: paramData
    })
}

function rerender() {
    state.renderKey++
}

function resetPage() {
    state.fetchParams.month = undefined
    state.fetchParams.year = undefined
    changeRoute()
}

function deleteParams(type: 'office' | 'year' | 'month') {
    state.fetchParams[type] = undefined
    changeRoute()
}

function getLabel(type: 'offices' | 'months', value: number) {
    let data = type == 'offices' ? state.officeList : state.monthList
    let result = data.find(obj => {
        return obj.value === Number(value)
    })
    return result?.label
}

async function fetchDashboard(params: ParamsDashboard = state.fetchParams) {
    const result: Dashboard = await utilsService.fetchDashboard(params)
    state.dashboard = result
    // state.dashboard.annual_growth.series[1].type = 'bar'
    state.monthList = result.meta.months
    state.officeList = result.meta.offices
    rerender()
}

watch(
    () => route.query,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            const checkData = Object.fromEntries(
                Object.entries(newValue).map(([key, value]) => {
                    // Handle the case where value could be LocationQueryValue or LocationQueryValue[]
                    if (Array.isArray(value)) {
                        // Handle array case, selecting the first item or defaulting to empty array
                        return [key, value.length > 0 ? value : undefined]
                    } else {
                        // Cast to undefined if null, otherwise keep the string value
                        return [key, value !== null ? value : undefined]
                    }
                }).filter(([, value]) => value !== undefined) // Filter out undefined values
            ) as ParamsDashboard

            state.fetchParams = checkData
            fetchDashboard()
        }
    },
    { deep: true, immediate: true }
)
</script>
<template>
    <div class="row align-items-center">
        <div class="col-xl-4 col-md-12"></div>
        <div class="col-xl-4 col-md-12">
            <div class="text-center fs-2 mb-3">Dashboard Employee Gawe Becik</div>
            <div class="text-muted fs-2 text-uppercase text-center flex-grow-1 mb-3" :key="state.renderKey">
                <span>
                    <span v-if="state.fetchParams?.office">{{ getLabel('offices', state.fetchParams.office)
                        }}</span> <span v-if="state.fetchParams?.month">{{ getLabel('months',
                            state.fetchParams.month) }}</span> <span v-if="state.fetchParams?.year">{{
                            state.fetchParams.year }}</span>
                </span>
            </div>
        </div>
        <div class="col-xl-4 col-md-12 d-flex justify-content-end">
            <div class="pb-2">
                <div class="btn-group mx-1 mb-1" role="group">
                    <button class="btn btn-sm bg-info text-white dropdown-toggle" data-bs-toggle="dropdown"
                        aria-expanded="false" v-if="state.officeList">
                        {{ state.fetchParams?.office ? getLabel('offices', state.fetchParams.office) : 'Office' }}
                    </button>
                    <button v-if="state.fetchParams?.office" data-aos="zoom-in" class="btn btn-sm btn-danger ms-1"
                        @click="deleteParams('office')">
                        <i class="ri-close-line align-middle"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="office in state.officeList" :key="office.value"
                            @click="selectParams('office', office.value)">
                            <span class="dropdown-item">{{ office.label }}</span>
                        </li>
                    </ul>
                </div>
                <div class="btn-group mx-1 mb-1" role="group">
                    <button class="btn btn-sm bg-info text-white dropdown-toggle" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        {{ state.fetchParams?.year ?? 'Year' }}
                    </button>
                    <button v-if="state.fetchParams?.year" data-aos="zoom-in" class="btn btn-sm btn-danger ms-1"
                        @click="state.fetchParams?.month != undefined ? resetPage() : deleteParams('year')">
                        <i class="ri-close-line align-middle"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="year in state.yearList" :key="year" @click="selectParams('year', year)">
                            <span class="dropdown-item">{{ year }}</span>
                        </li>
                    </ul>
                </div>
                <div class="btn-group mx-1 mb-1" role="group">
                    <button v-if="state.fetchParams?.year" class="btn btn-sm bg-info text-white dropdown-toggle"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        {{ state.fetchParams?.month ? getLabel('months', state.fetchParams.month) : 'Month' }}
                    </button>
                    <button v-else type="button" disabled class="btn btn-sm bg-info text-white dropdown-toggle pe-auto"
                        data-bs-toggle="tooltip" data-bs-custom-class="custom-tooltip"
                        title="Please choose the year first.">
                        Month
                    </button>
                    <button v-if="state.fetchParams?.month" data-aos="zoom-in" class="btn btn-sm btn-danger ms-1"
                        @click="deleteParams('month')">
                        <i class="ri-close-line align-middle"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="month in state.monthList" :key="month.value"
                            @click="selectParams('month', month.value)">
                            <span class="dropdown-item">{{ month.label }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="row" data-aos="fade-down">
        <div class="col-xxl-4 col-xl-4 col-md-12">
            <div class="row h-100">
                <div class="col-xxl-6 col-xl-12">
                    <div class="row h-100 dashboard-padding">
                        <div class="card card-animate">
                            <div class="card-body">
                                <div class="row h-100">
                                    <p class="text-uppercase text-center fw-medium title-font text-muted mb-0">
                                        Total Active Employee
                                    </p>
                                    <div class="d-flex align-items-start justify-content-center">
                                        <div class="col text-center">
                                            <div class="big-font fw-semibold text-center mb-0 text-info">
                                                <CounterCard :start-val="0"
                                                    :end-val="state.dashboard?.total_employees?.total" :duration="1000">
                                                </CounterCard>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-6 col-xl-12">
                    <div class="row h-100 dashboard-padding">
                        <TurnOverRateCard label="Male" :value="state.dashboard?.total_employees?.male"
                            :dataRadial="state.dashboard?.total_employees?.male_percentage" :key="state.renderKey" />
                        <TurnOverRateCard label="Female" :value="state.dashboard?.total_employees?.female"
                            :dataRadial="state.dashboard?.total_employees?.female_percentage" :key="state.renderKey" />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-4 col-xl-6 col-md-12">
            <div class="row h-100 dashboard-padding">
                <EmployeeStatusCard v-if="state.dashboard?.active_against_resign" :key="state.renderKey"
                    :value="state.dashboard?.active_against_resign"
                    :dataPie="[state.dashboard?.active_against_resign?.active_percentage, state.dashboard?.active_against_resign?.resigned_percentage]"
                    :labelPie="['Active', 'Resigned']" />
            </div>
        </div>
        <div class="col-xxl-4 col-xl-2 col-md-12">
            <div class="row h-100">
                <div class="col-xxl-6 col-xl-12">
                    <div class="row h-100 dashboard-padding">
                        <div class="card card-animate">
                            <div class="card-body">
                                <div class="row h-100">
                                    <p class="text-uppercase text-center fw-medium title-font text-muted mb-0">
                                        Turn Over Rate
                                    </p>
                                    <div class="d-flex align-items-start justify-content-center">
                                        <div class="col text-center">
                                            <div class="semi-font fw-semibold text-center mb-0 text-warning">
                                                <CounterCard :start-val="0"
                                                    :end-val="state.dashboard?.turn_over_rate?.rate" :decimals="2"
                                                    :duration="1000" /> %
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-6 col-xl-12">
                    <div class="row h-100 dashboard-padding">
                        <div class="card card-animate">
                            <div class="card-body">
                                <div class="row h-100">
                                    <p class="text-uppercase text-center fw-medium title-font text-muted mb-0">
                                        Average Age (Years)
                                    </p>
                                    <div class="d-flex align-items-start justify-content-center">
                                        <div class="col text-center">
                                            <div class="semi-font fw-semibold text-center mb-0 text-info">
                                                <CounterCard :start-val="0"
                                                    :end-val="state.dashboard?.average_age?.average_employees_age"
                                                    :duration="1000" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row" data-aos="fade-down">
        <div class="col-xl-4 col-md-12">
            <div class="row h-100 dashboard-padding">
                <EmployeeActiveCard v-if="state.dashboard?.core_against_support" :key="state.renderKey"
                    :value="state.dashboard?.core_against_support" :labelPie="['Core', 'Support']" />
                <EmployeeActiveEducationCard v-if="state.dashboard?.education_level" :key="state.renderKey"
                    :value="state.dashboard?.education_level" :labelPie="state.dashboard?.education_level?.xaxis" />
            </div>
        </div>
        <div class="col-xl-4 col-md-12">
            <div class="row h-100 dashboard-padding" v-if="state.dashboard.group_populate">
                <div class="card card-animate">
                    <h5 class="text-start fw-semibold mt-4 ms-4 mb-0">Employee Active by Department</h5>
                    <div class="card-body align-content-center">
                        <EducationLevel :key="state.renderKey" :data="state.dashboard.group_populate" />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-4 col-md-12">
            <div class="row h-100 dashboard-padding" v-if="state.dashboard.position_populate">
                <div class="card card-animate">
                    <h5 class="text-start fw-semibold mt-4 ms-4 mb-0">Employee Active by Position</h5>
                    <div class="card-body align-content-center">
                        <EducationLevel :key="state.renderKey" :data="state.dashboard.position_populate" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row" data-aos="fade-down">
        <div class="col-xl-8 col-md-12" v-if="state.dashboard.growth_against_resign">
            <div class="row h-100 dashboard-padding">
                <div class="card card-animate">
                    <h5 class="text-start fw-semibold mt-4 ms-4 mb-0">Growth Against Resign Annually</h5>
                    <div class="card-body align-content-center">
                        <GrowthAgainstResign :key="state.renderKey" :data="state.dashboard.growth_against_resign" />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-4 col-md-12" v-if="state.dashboard.annual_growth">
            <div class="row h-100 dashboard-padding">
                <div class="card card-animate">
                    <h5 class="text-start fw-semibold mt-4 ms-4 mb-0">Annual Growth</h5>
                    <div class="card-body align-content-center">
                        <AnualGrowth :key="state.renderKey" :data="state.dashboard.annual_growth"
                            v-if="state.dashboard.annual_growth" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.s0 {
    opacity: .05;
    fill: var(--vz-success)
}
</style> -->
<template></template>