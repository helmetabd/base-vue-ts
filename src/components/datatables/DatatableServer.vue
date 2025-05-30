<script setup lang="ts">
import _debounce from 'lodash/debounce'
import { getAvatar } from '../../utils/assetsHelper'
import { reactive, ref, watch } from 'vue'
import { utilsService } from '../../service'
import { thousandSeparator } from '@/utils/dashboardHelper'
import { calculateGrowth } from '../../utils/calculationHelper'
import type { MomentInput } from 'moment'
import moment from 'moment'
import PercentageBadge from '../partials/percentage-badge.vue'
import StackedAvatar from '../utils/StackedAvatar.vue'
import type { links, PaginationType } from '@/interfaces/Utils'
import { useRouter } from 'vue-router'
import { slideToggle } from '@/utils/slider'

const emit = defineEmits(['toggle', 'toggleExport', 'changeURL', 'getValue'])
const inputId = 'autofocus-input';
const router = useRouter()

interface Param {
    perpage?: number
    sort?: string
    order_by?: string
    search?: string
    page?: number
}
interface Column {
    name: string
    label: string
    sortable: boolean
    checkable?: boolean
    textTypes?: any
    hidden?: boolean
    width?: string
    bold?: boolean
    headerClass?: string
    routeName?: string
    class?: string
    isNumber?: boolean
    targetCollapsed?: boolean
    currency?: string
    fixedNumber?: number
    style?: { [key: string]: string }
    percentage?: { target: string; actual: string }
    custom?: any
    badge?: any
    dateConfig?: any
    offcanvas?: any
    stackedImage?: boolean
    isArray?: boolean
    isFirst?: boolean
    isLast?: boolean
    defaultValue?: any
    display?: string
    customizeRow?: boolean
    customizeHeader?: boolean
    truncate?: boolean
    params?: { id: string; date: any }
}
const props = defineProps({
    url: {
        type: String,
        required: true
    },
    params: {
        type: Object
    },
    column: {
        type: Object
    },
    table_search: {
        type: Boolean,
        default: true
    },
    table_filter: {
        type: Boolean,
        default: false
    },
    table_show: {
        type: Boolean,
        default: true
    },
    table_pagination: {
        type: Boolean,
        default: true
    }
})
const state = reactive({
    projects: [] as any[],
    toggleButton: false,
    tableUrl: props.url,
    tableParam: props.params,
    columns: props.column as Column[],
    perPage: ['10', '25', '50', '100'],
    arrows: {
        arr: props.params?.sort ?? 'asc',
        col: props.params?.order_by ?? 'id'
    },
    loadingState: false,
    tableData: {
        perpage: props.params?.perpage ?? 10,
        sort: props.params?.sort ?? 'asc',
        order_by: props.params?.order_by ?? 'id',
    } as Param,
    page: null as number | null,
    pagination: {} as PaginationType
})
const avatar = (avatar: string | null | undefined) => getAvatar(avatar)
const getProjects = (url = state.tableUrl) => {
    let par = { ...state.tableData }
    if (state.tableParam && Object.keys(state.tableParam).length) {
        par = { ...state.tableParam, ...state.tableData }
    }
    if (state.page) {
        par.page = state.page
    }
    const paramData = Object.fromEntries(
        Object.entries(par).filter(([key, value]) => value !== null)
    )
    const paramExport = Object.fromEntries(
        Object.entries(par).filter(([key, value]) => value !== null && key !== 'page' && key !== 'order_by' && key !== 'sort' && key !== 'per_page')
    )
    state.projects = []
    changeRoute(par)
    state.loadingState = true
    emit('changeURL', paramExport)
    emit('toggle', false)
    utilsService
        .fetchIndex(url, paramData)
        .then((res) => {
            state.projects = res.data
            emit('getValue', res)
            state.pagination = res.pagination
            if (!res.data.length) {
                isDataEmpty.value = true
            }
            if (state.pagination.total == 0) {
                emit('toggleExport', false)
            } else {
                emit('toggleExport', true)
            }
        })
        .finally(() => {
            state.page = null
            state.loadingState = false
            emit('toggle', true)
        })
}
const formatDate = (
    date: MomentInput,
    beforeFormat: string | undefined,
    afterFormat: string | undefined
) => {
    if (date) {
        return moment(date, beforeFormat).format(afterFormat)
    }
    return '-'
}
function shouldHideDate(item: { [x: string]: any }, column: Column): boolean {
    const config = column.dateConfig?.hideWhen;
    if (!config) return true;

    const left = getObjectValue(item, config.compare);
    const right = typeof config.with === 'string' && item[config.with] !== undefined
        ? getObjectValue(item, config.with)
        : config.with;

    switch (config.operator) {
        case '==': return left == right;
        case '===': return left === right;
        case '!=': return left != right;
        case '!==': return left !== right;
        case '<': return left < right;
        case '>': return left > right;
        case '<=': return left <= right;
        case '>=': return left >= right;
        default: return false; // fallback: no hide
    }
}
const searching = _debounce(async (e: Event) => {
    const target = e.target as HTMLInputElement;
    state.tableData.search = target.value
    getProjects()
}, 1000)
const sortBy = (key: string) => {
    state.tableData.order_by = key
    state.tableData.sort = state.tableData.sort === 'desc' ? 'asc' : 'desc'
    state.arrows.arr = state.tableData.sort
    state.arrows.col = key
    getProjects()
}
const getObjectValue = (obj: { [x: string]: any }, path: string, defaultValue?: any) => {
    if (!path.includes('.')) {
        return obj[path] !== undefined && obj[path] !== null
            ? obj[path]
            : defaultValue
                ? defaultValue
                : null
    }
    const keys = path.split('.')
    let result = obj
    for (const key of keys) {
        if (result !== null && result !== undefined && typeof result === 'object') {
            if (Object.prototype.hasOwnProperty.call(result, key)) {
                result = result[key]
            } else {
                return defaultValue ? defaultValue : null
            }
        } else {
            return defaultValue ? defaultValue : null
        }
    }
    return result !== undefined && result !== null ? result : defaultValue ? defaultValue : null
}
function checkIcon(column: { sortable: boolean; name: string }) {
    if (column.sortable) {
        if (state.arrows?.col === column.name) {
            return state.arrows.arr === 'asc' ? 'sorting sorting_asc' : 'sorting sorting_desc'
        } else {
            return 'sorting'
        }
    } else {
        return ''
    }
}
const changer = (data: string) => {
    // let newUrl = data.replace('http://', 'https://')
    // return newUrl
    let value = null
    let params = new URL(data).searchParams;
    if (params) {
        const page = params.get("page")
        if (page) {
            value = parseInt(page)
        }
    }
    return value
}
const redirect = (url: links | null) => {
    if (url != null) {
        if (url.label.includes('Previous') || url.label.includes('Next')) {
            if (url.url) {
                let page = changer(url.url)
                if (page) {
                    state.page = page
                }
            }
        } else {
            state.page = Number(url.label)
        }
        getProjects()
    }
}
const toggleFilter = () => {
    let searchDiv = document.getElementById('search-filter')
    state.toggleButton = !state.toggleButton
    slideToggle(searchDiv, 200)
}
function changeRoute(data: object) {
    const paramData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== null)
    )
    router.replace({
        query: paramData
    })
}
const isDataEmpty = ref(false)

watch(state.tableData, () => { getProjects() }, { immediate: true, });

watch(() => props.params, (newParam) => { state.tableParam = newParam, getProjects() }, { deep: true });
</script>

<template>
    <div class="dataTables_wrapper dt-bootstrap5 no-footer">
        <div class="row">
            <div class="row text-muted text-uppercase fs-11">
                <div class="col-sm-12 col-md-6" v-if="props.table_show">
                    <div class="dataTables_length" id="datatable_length">
                        <label>Show
                            <select v-model="state.tableData.perpage" name="datatable_length" aria-controls="datatable"
                                class="form-select form-select-sm">
                                <option v-for="(records, index) in state.perPage" :key="index" :value="records">
                                    {{ records }}
                                </option>
                            </select>
                            entries</label>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6 d-flex flex-row justify-content-end pe-0"
                    v-if="props.table_search || props.table_filter">
                    <div id="datatable_filter" class="dataTables_filter"
                        v-if="props.table_search && !state.toggleButton">
                        <label>Search:<input :id="inputId" @input="searching" type="search"
                                class="form-control form-control-sm" placeholder="" aria-controls="datatable" /></label>
                    </div>
                    <div class="ms-1" style="text-align: right" v-if="props.table_filter">
                        <button type="button" class="btn btn-sm btn-info" id="show_search_filter" @click="toggleFilter">
                            <i class="ri-filter-fill align-bottom"></i>
                            Filter Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <template v-if="props.table_filter">
            <div id="search-filter" class="row mb-1" style="display: none;">
                <div class="row pe-0">
                    <slot name="filter"></slot>
                </div>
            </div>
            <!--end row-->
        </template>
        <div class="row">
            <div style="overflow-x: auto; overflow-y: hidden;">
                <table id="datatable"
                    class="table dt-responsive nowrap table-nowrap table-bordered table-hover text-uppercase fs-11 align-middle dataTable no-footer dtr-inline"
                    style="width: 100%">
                    <thead class="align-middle">
                        <tr class="text-info bg-light">
                            <th v-for="column in state.columns" :key="column.name"
                                @click="column.sortable ? sortBy(column.name) : null" :style="{
                                    width: column.width,
                                    cursor: column.sortable ? 'pointer' : 'default',
                                    ...column.style
                                }" :class="checkIcon(column)" :hidden="column.hidden ?? false">
                                <template v-if="column.customizeHeader">
                                    <slot :name="`header-${column.name}`" :items="state.projects"></slot>
                                </template>
                                <template v-else>
                                    {{ column.label }}
                                </template>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!state.projects.length">
                            <td :colspan="state.columns.length" class="dataTables_empty" valign="top">
                                <div v-if="state.loadingState" class="d-flex justify-content-center py-4">
                                    <div class="mb-2 text-primary d-flex justify-items-center">
                                        <span class="spinner-border" role="status"
                                            style="width: 30px; height: 30px"></span>
                                        <span class="mt-1 mx-1"> Loading... </span>
                                    </div>
                                </div>
                                <span v-if="!state.loadingState && isDataEmpty">No data available in table</span>
                            </td>
                        </tr>
                        <tr v-for="(item, indexP) in state.projects" :key="indexP" v-else>
                            <td v-for="(column, indexC) in state.columns" :key="indexC" align="center"
                                :class="column.bold ? 'fw-semibold ' : 'fw-normal ' + column.class"
                                :hidden="column.hidden ?? false">
                                <template v-if="column.customizeRow">
                                    <slot :name="`column-${column.name}`" :item="item" />
                                </template>
                                <template v-if="column.isNumber">
                                    <div :class="column.class">
                                        <span style="float: left" v-if="column.currency">{{ column.currency }}</span>
                                        {{
                                            getObjectValue(item, column.name)
                                                ? column.fixedNumber
                                                    ? getObjectValue(item, column.name)
                                                        .toFixed(column.fixedNumber)
                                                        .replace('.', ',')
                                                    : thousandSeparator(getObjectValue(item, column.name))
                                                : 0
                                        }}
                                    </div>
                                </template>
                                <template v-else-if="column.percentage">
                                    <div :class="column.class">
                                        <PercentageBadge :label="Number(calculateGrowth(
                                            getObjectValue(item, column.percentage.target),
                                            getObjectValue(item, column.percentage.actual)
                                        ).result)
                                            " :status="calculateGrowth(
                                                getObjectValue(item, column.percentage.target),
                                                getObjectValue(item, column.percentage.actual)
                                            ).success
                                                ">
                                        </PercentageBadge>
                                    </div>
                                </template>
                                <template v-else-if="column.custom">
                                    <div v-if="column.custom.routeName"
                                        :class="(column.bold ? 'fw-semibold ' : 'fw-normal ') + column.class">
                                        <span>
                                            <template v-if="
                                                column.custom.parent &&
                                                getObjectValue(item, column.custom.parent.data) !== null
                                            ">
                                                <i :class="column.custom.parent.icon ?? column.custom.icon" :style="column.custom.parent.iconColorObject
                                                    ? 'color: ' +
                                                    getObjectValue(item, column.custom.parent.iconColorObject) +
                                                    ';'
                                                    : column.custom.parent.iconColor
                                                        ? 'color: ' + column.custom.parent.iconColor + ';'
                                                        : null
                                                    "></i>
                                                <router-link :to="{
                                                    name: column.custom.parent.routeName,
                                                    params: {
                                                        id: getObjectValue(item, column.custom.parent.params)
                                                    }
                                                }">
                                                    {{ getObjectValue(item, column.custom.parent.name) }}</router-link>
                                                <i class="las la-arrow-right ms-1 me-1 text-muted"></i>
                                            </template>
                                            <i v-if="column.custom.icon" :class="column.custom.icon" :style="column.custom.iconColorObject
                                                ? 'color: ' + getObjectValue(item, column.custom.iconColorObject) + ';'
                                                : column.custom.iconColor
                                                    ? 'color: ' + column.custom.iconColor + ';'
                                                    : null
                                                "></i>
                                            <img v-if="column.custom.image"
                                                :src="avatar(getObjectValue(item, column.custom.image))"
                                                class="rounded-circle avatar-xxs me-2" />
                                            <template v-if="column.isFirst">
                                                <router-link :to="{
                                                    name: column.custom.routeName,
                                                    params: {
                                                        id: getObjectValue(item[column.name][0], column.custom.params)
                                                    }
                                                }">
                                                    {{
                                                        getObjectValue(item[column.name][0], column.custom.display ??
                                                            column.name)
                                                    }}
                                                </router-link>
                                            </template>
                                            <template v-else>
                                                <router-link
                                                    v-if="getObjectValue(item, column.custom.display ?? column.name)"
                                                    :to="{
                                                        name: column.custom.routeName,
                                                        params: {
                                                            id: getObjectValue(item, column.custom.params)
                                                        }
                                                    }">
                                                    {{ getObjectValue(item, column.custom.display ?? column.name) }}
                                                    <i v-if="
                                                        column.custom.uniqueFirst &&
                                                        getObjectValue(item, column.custom.uniqueFirst.fields) ===
                                                        column.custom.uniqueFirst.value
                                                    " :class="column.custom.uniqueFirst.icon"></i>
                                                </router-link>
                                                <template v-if="column.custom.uniqueIcon">
                                                    <slot :name="`column-${column.name}-unique`" :item="item" />
                                                </template>
                                            </template>
                                        </span>
                                    </div>
                                    <template v-else-if="column.custom.image">
                                        <img v-if="column.custom.image"
                                            :src="avatar(getObjectValue(item, column.custom.image))"
                                            class="rounded-circle avatar-xxs me-2" />
                                        {{ getObjectValue(item, column.name) }}
                                        <i v-if="
                                            column.custom.uniqueFirst &&
                                            getObjectValue(item, column.custom.uniqueFirst.fields) ===
                                            column.custom.uniqueFirst.value
                                        " :class="column.custom.uniqueFirst.icon"></i>
                                    </template>
                                    <div v-else :class="column.class">
                                        <span v-if="getObjectValue(item, column.custom.display ?? column.name)">
                                            <i :class="column.custom.icon"></i>
                                            {{ getObjectValue(item, column.custom.display ?? column.name) }}
                                        </span>
                                    </div>
                                </template>
                                <template v-else-if="column.badge">
                                    <div v-if="column.badge.default && column.badge.default.value == getObjectValue(item, column.badge.default.name ?? column.name)"
                                        :class="column.badge.default.class">
                                        <strong>{{ column.badge.default.text }}</strong>
                                    </div>
                                    <template v-else>
                                        <template v-if="column.badge.types">
                                            <div v-if="column.badge.isArray">
                                                <div v-for="(array, indexA) in item[column.name]" :key="indexA">
                                                    <div v-for="(model, indexB) in column.badge.types" :key="indexB">
                                                        <div
                                                            v-if="model.value === getObjectValue(array, column.badge.display)">
                                                            <span v-if="column.badge.custom"
                                                                :class="'badge text-' + model.textColor"
                                                                :style="'background-color: ' + model.color + ';'">{{
                                                                    model.label ? model.label : getObjectValue(array,
                                                                        column.badge.display)
                                                                }}</span>
                                                            <span v-else
                                                                :class="'badge bg-' + model.type + '-subtle text-' + model.type + ' p-2'">{{
                                                                    model.label ? model.label : getObjectValue(array,
                                                                        column.badge.display)
                                                                }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <template v-else>
                                                <template v-for="(model, indexA) in column.badge.types" :key="indexA">
                                                    <template
                                                        v-if="model.value === getObjectValue(item, column.display ?? column.name)">
                                                        <span v-if="column.badge.custom"
                                                            :class="'badge text-' + model.textColor"
                                                            :style="'background-color: ' + model.color + ';'">
                                                            {{ model.label ?? getObjectValue(item, column.display ??
                                                                column.name) }}
                                                        </span>
                                                        <span v-else
                                                            :class="'badge bg-' + model.type + '-subtle text-' + model.type + ' p-2'">{{
                                                                model.label ?? getObjectValue(item,
                                                                    column.display ?? column.name)
                                                            }}</span>
                                                    </template>
                                                </template>
                                            </template>
                                        </template>
                                        <div v-else id="Badge">
                                            <div v-if="column.badge.isArray">
                                                <template v-for="(array, indexA) in item[column.name]" :key="indexA">
                                                    <span v-if="column.badge.custom"
                                                        :class="'badge text-' + column.badge.textColor" :style="'background-color: ' + getObjectValue(array, column.badge.color) + ';'
                                                            ">{{ getObjectValue(array, column.badge.display) }}</span>
                                                    <span v-else :class="'badge bg-' +
                                                        column.badge.type +
                                                        '-subtle text-' +
                                                        column.badge.type +
                                                        ' p-2'
                                                        ">{{ getObjectValue(array, column.badge.display) }}</span>
                                                </template>
                                            </div>
                                            <div v-else>
                                                <span v-if="column.badge.custom"
                                                    :class="'badge text-' + column.badge.textColor"
                                                    :style="'background-color: ' + getObjectValue(item, column.badge.color) + ';'">{{
                                                        getObjectValue(item,
                                                            column.name) }}</span>
                                                <span v-else :class="'badge bg-' + column.badge.type + '-subtle text-' + column.badge.type + ' p-2'
                                                    ">{{ getObjectValue(item, column.name) }}</span>
                                            </div>
                                        </div>
                                    </template>
                                </template>
                                <template v-else-if="column.dateConfig">
                                    <template v-if="shouldHideDate(item, column)">
                                        <router-link v-if="column.routeName && column.params" :to="{
                                            name: column.routeName,
                                            params: {
                                                id: getObjectValue(item, column.params.id)
                                            },
                                            query: {
                                                date: getObjectValue(item, column.params.date)
                                            }
                                        }">
                                            {{
                                                formatDate(item[column.name], column.dateConfig.before,
                                                    column.dateConfig.after)
                                            }}
                                        </router-link>
                                        <template v-else>
                                            {{
                                                formatDate(
                                                    getObjectValue(item, column.display ?? column.name),
                                                    column.dateConfig.before,
                                                    column.dateConfig.after
                                                )
                                            }}
                                        </template>
                                    </template>
                                    <template v-else>-</template>
                                </template>
                                <template v-else-if="column.stackedImage">
                                    <StackedAvatar :collections="item[column.name]" />
                                </template>
                                <template v-else-if="column.defaultValue">
                                    {{ getObjectValue(item, column.name, column.defaultValue) }}
                                </template>
                                <template v-else-if="column.checkable">
                                    <span class="text-success fw-semibold" v-if="
                                        getObjectValue(item, column.name) !== null &&
                                        getObjectValue(item, column.name) !== 0
                                    ">Ok</span>
                                    <span v-else>-</span>
                                </template>
                                <template v-else-if="column.textTypes">
                                    <template v-for="(model, indexA) in column.textTypes.types" :key="indexA">
                                        <template v-if="model.value === getObjectValue(item, column.name)">
                                            <span :class="'fw-semibold text-' + model.type">{{
                                                model.label ?? getObjectValue(item, column.display ?? column.name)
                                                }}</span>
                                        </template>
                                    </template>
                                </template>
                                <template v-else-if="column.truncate">
                                    <span class="truncate-class text-truncate">
                                        {{ getObjectValue(item, column.name) }}
                                    </span>
                                </template>
                                <template v-else>
                                    {{ getObjectValue(item, column.display ?? column.name) }}
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="row" v-if="props.table_pagination">
        <div class="col-sm-12 col-md-5 text-muted text-uppercase fs-11">
            <div class="dataTables_info">
                Showing {{ state.pagination.from }} to {{ state.pagination.to }} of
                {{ thousandSeparator(state.pagination.total) }} entries
            </div>
        </div>
        <div class="col-sm-12 col-md-7 paginationWrapper d-flex justify-content-end">
            <div class="dataTables_paginate paging_simple_numbers" id="datatable_paginate">
                <ul class="pagination">
                    <li v-for="(link, index) in state.pagination.links" :key="index" class="paginate_button page-item"
                        :class="Number(link.label) == state.pagination.currentPage
                            ? 'active'
                            : index == 0 && state.pagination.currentPage == 1
                                ? 'disabled'
                                : state.pagination.currentPage == state.pagination.lastPage &&
                                    index + 1 == state.pagination.links.length
                                    ? 'disabled'
                                    : link.label === '...'
                                        ? 'disabled'
                                        : ''
                            ">
                        <button @click="redirect(link)" type="button" aria-controls="datatable" data-dt-idx="1"
                            tabindex="0" class="page-link" v-html="link.label"></button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
