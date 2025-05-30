<script setup>
import { getAvatar } from '@/utils/assetsHelper'
import moment from 'moment'
import Spinner from '../SpinnerComponent.vue'
import StackedAvatar from '../utils/StackedAvatar.vue'
import { reactive, computed, onMounted } from 'vue'
import { ref } from 'vue'
import thousandSeparator from '@/utils/thousandSeparator'
import PercentageBadge from '../partials/percentage-badge.vue'
import { calculateGrowth } from '@/utils/calculationHelper'

const props = defineProps({
  table_search: {
    type: Boolean,
    default: true
  },
  table_show: {
    type: Boolean,
    default: true
  },
  table_pagination: {
    type: Boolean,
    default: true
  },
  table_class: {
    type: String,
    default: ''
  },
  group: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 1
  },
  page_size: {
    type: Number,
    default: 10
  },
  dataTable: {
    type: Array,
    default: () => []
  },
  column: {
    type: Array,
    default: () => []
  },
  headerGroup: {
    type: Array,
    default: () => []
  },
  buttons: {
    type: Object,
    default: () => ({
      excel: false,
      copy: false,
      print: false
    })
  },
  customRow: {
    type: Object
  },
  copyTitle: {
    type: String
  },
  headerRowClass: {
    type: String
  },
  paginationClass: {
    type: String
  }
})
const state = reactive({
  items: props.dataTable,
  columns: props.column,
  groupHeader: props.headerGroup,
  filter: '',
  sortKey: props.sortBy,
  sortOrders: props.order,
  pageSize: props.page_size,
  currentPage: 1,
  pageSizeOptions: [10, 25, 50, 100]
})
const isDataEmpty = ref(false)
const loading = computed(() => {
  if (filteredItems.value.length === 0) {
    return true
  } else {
    return false
  }
})
const filteredItems = computed(() => {
  if (!state.filter) {
    return props.dataTable
  }

  return props.dataTable.filter((item) => {
    return Object.keys(item).some(
      (name) =>
        isColumnFilterable(name) &&
        String(item[name]).toLowerCase().includes(state.filter.toLowerCase())
    )
  })
})
const sortedItems = computed(() => {
  const filterData = filteredItems.value
  const sortingKey = state.sortKey
  if (!sortingKey) {
    return filterData
  }
  return filterData.slice().sort((a, b) => {
    let aValue = a[sortingKey]
    let bValue = b[sortingKey]

    if (state.columns.some((column) => column.name === sortingKey && column.isNumber)) {
      aValue = parseFloat(aValue)
      bValue = parseFloat(bValue)
    }

    return aValue > bValue ? state.sortOrders : -state.sortOrders
  })
})
const totalPages = computed(() => {
  return sortedItems.value.length ? Math.ceil(sortedItems.value.length / state.pageSize) : 1
})
const paginatedItems = computed(() => {
  const start = (state.currentPage - 1) * state.pageSize
  const end = start + state.pageSize
  return sortedItems.value.length ? sortedItems.value.slice(start, end) : []
})
const pages = computed(() => {
  const pagesArray = []
  for (let i = 1; i <= totalPages.value; i++) {
    pagesArray.push(i)
  }
  return pagesArray
})
const entriesRange = computed(() => {
  let start = 0
  let end = 0
  let total = 0
  if (sortedItems.value.length) {
    start = (state.currentPage - 1) * state.pageSize + 1
    end = Math.min(state.currentPage * state.pageSize, filteredItems.value.length)
    total = filteredItems.value.length
  }
  return `${start} to ${end} of ${total}`
})
const ellipsisPages = computed(() => {
  const totalVisiblePages = 3
  let range = []
  let start, end

  if (totalPages.value <= totalVisiblePages) {
    start = 1
    end = totalPages.value
  } else {
    const pagesBeforeCurrent = 1
    const pagesAfterCurrent = 1

    if (state.currentPage <= pagesBeforeCurrent + 1) {
      start = 1
      end = totalVisiblePages
    } else if (state.currentPage + pagesAfterCurrent >= totalPages.value) {
      start = totalPages.value - totalVisiblePages + 1
      end = totalPages.value
    } else {
      start = state.currentPage - pagesBeforeCurrent
      end = state.currentPage + pagesAfterCurrent
    }
  }

  if (start > 1) {
    range.push(1)
    if (start > 2) {
      range.push('...')
    }
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  if (end < totalPages.value) {
    if (end < totalPages.value - 1) {
      range.push('...')
    }
    range.push(totalPages.value)
  }

  return { start, end, range }
})
const avatar = (avatar) => getAvatar(avatar)
const formatDate = (date, beforeFormat, afterFormat) => {
  if (date) {
    return moment(date, beforeFormat).format(afterFormat)
    // return moment(date, "YYYY-MM-DD").format("DD MMM YYYY");
  }
  return ''
}
const toggleSorting = (column) => {
  if (column.sortable) {
    state.sortKey = column.name
    state.sortOrders *= -1
  }
}
const isColumnFilterable = (key) => {
  const column = state.columns.find((column) => column.name === key)
  return column ? column.filterable : false
}
const prevPage = () => {
  if (state.currentPage > 1) {
    state.currentPage--
  }
}
const nextPage = () => {
  if (state.currentPage < totalPages.value) {
    state.currentPage++
  }
}
const goToPage = (pageNumber) => {
  state.currentPage = pageNumber
}
const checkIcon = (column) => {
  if (column.sortable) {
    if (state.sortKey === column.name) {
      if (state.sortOrders === 1) {
        return 'sorting sorting_asc'
      } else {
        return 'sorting sorting_desc'
      }
    } else {
      return 'sorting'
    }
  } else {
    return 'sorting_disabled'
  }
}
const getObjectValue = (obj, path, defaultValue) => {
  // Check if the path contains a separator
  if (!path.includes('.')) {
    // If no separator found, directly access the property
    return obj[path] !== undefined && obj[path] !== null
      ? obj[path]
      : defaultValue
        ? defaultValue
        : null
  }
  // Split the path by dot
  const keys = path.split('.')

  // Initialize result with the object
  let result = obj

  // Traverse each key in the path
  for (const key of keys) {
    if (result !== null && result !== undefined && typeof result === 'object') {
      // If the key exists in the current result, update result with its value
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result = result[key]
      } else {
        // If the key doesn't exist, return undefined
        return defaultValue ? defaultValue : null
      }
    } else {
      return defaultValue ? defaultValue : null
    }
  }

  // Return the final result
  return result !== undefined && result !== null ? result : defaultValue ? defaultValue : null
}
const formatObjectArray = (arr, obj) => {
  return arr.map((item) => item[obj]).join(', ')
}
function lightOrDark(color) {
  // Check the format of the color, HEX or RGB?
  let r, g, b, hsp
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    r = color[1];
    g = color[2];
    b = color[3];
  }
  else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'
    ));
    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }
  // HSP equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );
  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return 'light';
  }
  else {
    return 'dark';
  }
}
const loadingState = ref(loading.value)
onMounted(() => {
  if (loading.value) {
    setTimeout(() => {
      isDataEmpty.value = true
      loadingState.value = false
    }, 3000)
  }
})
</script>

<template>
  <div class="dataTables_wrapper dt-bootstrap5 no-footer">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_length" v-if="props.table_show">
          <label>
            Show
            <select v-model="state.pageSize" id="pageSize" aria-controls="datatable" class="form-select form-select-sm">
              <option v-for="(option, index) in state.pageSizeOptions" :value="option" :key="index">
                {{ option }}
              </option>
            </select>
            entries
          </label>
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_filter" v-if="props.table_search">
          <label for="filter">Search:<input type="search" v-model="state.filter" id="filter"
              class="form-control form-control-sm" aria-controls="datatable" />
          </label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="dt-buttons" v-if="props.buttons">
        <button v-if="props.buttons.copy" class="dt-button buttons-copy buttons-html5" tabindex="0" type="button"
          id="copyButton" @click="copyToClipboard">
          <span>Copy</span>
        </button>
        <button v-if="props.buttons.excel" class="dt-button buttons-excel buttons-html5" tabindex="0" type="button"
          @click="exportToExcel">
          <span>Excel</span>
        </button>
        <button v-if="props.buttons.print" class="dt-button buttons-print" tabindex="0" type="button"
          @click="printTable">
          <span>Print</span>
        </button>
      </div>
      <div style="overflow-x: auto; overflow-y: hidden;">
        <table ref="tableData" id="datatable"
          class="table table-hover table-bordered align-middle text-nowrap dt-responsive nowrap dataTable no-footer"
          :class="props.table_class" style="width: 100%" aria-describedby="datatable_info">
          <thead class="align-middle">
            <tr v-if="group">
              <th v-for="group in state.groupHeader" :colspan="group.colspan" :key="group.title" :class="group.class">
                {{ group.title }}
              </th>
            </tr>
            <tr :class="props.headerRowClass">
              <th v-for="(column, index) in state.columns" :key="index" @click="toggleSorting(column)" :style="'width:' +
                column.width +
                '; cursor:' +
                (column.sortable ? ' pointer;' : ' default;')
                " :class="checkIcon(column) + ' ' + column.headerClass" :hidden="column.hidden ?? false"
                aria-controls="datatable">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedItems" :key="index" :class="props.customRow && getObjectValue(item, props.customRow.value)
              ? props.customRow.class
              : ''
              ">
              <td v-for="(column, columnIndex) in state.columns" :key="columnIndex"
                :class="column.bold ? 'fw-semibold ' : 'fw-normal '" :hidden="column.hidden ?? false">
                <template v-if="column.customizeRow">
                  <slot :name="`column-${column.name}`" :item="item" />
                </template>
                <template v-else-if="column.isNumber">
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
                    <PercentageBadge :label="calculateGrowth(
                      getObjectValue(item, column.percentage.target),
                      getObjectValue(item, column.percentage.actual)
                    ).result
                      " :status="calculateGrowth(
                        getObjectValue(item, column.percentage.target),
                        getObjectValue(item, column.percentage.actual)
                      ).success
                        ">
                    </PercentageBadge>
                  </div>
                </template>
                <template v-else-if="column.custom">
                  <div v-if="column.custom.routeName" :class="column.class">
                    <span>
                      <template v-if="
                        column.custom.parent &&
                        getObjectValue(item, column.custom.parent.data) !== null &&
                        getObjectValue(item, column.custom.parent.params) !== getObjectValue(item, column.custom.params)
                      ">
                        <i :class="column.custom.parent.icon ?? column.custom.icon" :style="column.custom.parent.iconColorObject ? 'color: ' +
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
                      <img v-if="column.custom.image" :src="avatar(getObjectValue(item, column.custom.image))"
                        class="rounded-circle avatar-xxs me-2" />
                      <template v-if="column.isFirst">
                        <router-link :to="{
                          name: column.custom.routeName,
                          params: {
                            id: getObjectValue(item[column.name][0], column.custom.params)
                          }
                        }">
                          {{
                            getObjectValue(
                              item[column.name][0],
                              column.custom.display ?? column.name
                            )
                          }}
                        </router-link>
                      </template>
                      <template v-else>
                        <router-link v-if="getObjectValue(item, column.custom.display ?? column.name)" :to="{
                          name: column.custom.routeName,
                          params: column.custom.moreParams ? { ...column.custom.moreParams, id: getObjectValue(item, column.custom.params) } : {
                            id: getObjectValue(item, column.custom.params)
                          }
                        }">
                          {{ getObjectValue(item, column.custom.display ?? column.name) }}
                          <i v-if="
                            column.custom.uniqueFirst &&
                            getObjectValue(item, column.custom.uniqueFirst.fields) ===
                            column.custom.uniqueFirst.value
                          " :class="column.custom.uniqueFirst.icon"></i>
                          <template v-if="column.custom.uniqueIcon">
                            <slot :name="`column-${column.name}-unique`" :item="item" />
                          </template>
                        </router-link>
                      </template>
                    </span>
                  </div>
                  <template v-else-if="column.custom.image">
                    <img v-if="column.custom.image" :src="avatar(getObjectValue(item, column.custom.image))"
                      class="rounded-circle avatar-xxs me-2" />
                    {{ getObjectValue(item, column.name) }}
                    <i v-if="
                      column.custom.uniqueFirst &&
                      getObjectValue(item, column.custom.uniqueFirst.fields) ===
                      column.custom.uniqueFirst.value
                    " :class="column.custom.uniqueFirst.icon"></i>
                    <template v-if="column.custom.uniqueIcon">
                      <slot :name="`column-${column.name}-unique`" :item="item" />
                    </template>
                  </template>
                  <div v-else :class="column.class">
                    <span>
                      <i :class="column.custom.icon"></i>
                      {{ item[column.name] }}
                    </span>
                  </div>
                </template>
                <template v-else-if="column.badge">
                  <template v-if="column.badge.types">
                    <div v-if="column.badge.isArray">
                      <div v-for="(array, indexA) in item[column.name]" :key="indexA">
                        <div v-for="(model, indexB) in column.badge.types" :key="indexB">
                          <div v-if="model.value === getObjectValue(array, column.badge.display)">
                            <span v-if="column.badge.custom" :class="'badge text-' + model.textColor"
                              :style="'background-color: ' + model.color + ';'">{{
                                model.label
                                  ? model.label
                                  : getObjectValue(array, column.badge.display)
                              }}</span>
                            <span v-else :class="'badge bg-' + model.type + '-subtle text-' + model.type + ' p-2'
                              ">{{
                                model.label
                                  ? model.label
                                  : getObjectValue(array, column.badge.display)
                              }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <template v-else>
                      <template v-for="(model, indexA) in column.badge.types" :key="indexA">
                        <template v-if="model.value === getObjectValue(item, column.name)">
                          <span v-if="column.badge.custom" :class="'badge text-' + model.textColor"
                            :style="'background-color: ' + model.color + ';'">
                            {{ model.label ? model.label : getObjectValue(item, column.name) }}
                          </span>
                          <span v-else :class="'badge bg-' + model.type + '-subtle text-' + model.type + ' p-2'
                            ">{{
                              model.label ? model.label : getObjectValue(item, column.name)
                            }}</span>
                        </template>
                      </template>
                    </template>
                  </template>
                  <div v-else id="Badge">
                    <div v-if="column.badge.isArray">
                      <template v-for="(array, indexA) in item[column.name]" :key="indexA">
                        <span v-if="column.badge.custom" :class="'badge text-' + column.badge.textColor" :style="'background-color: ' + getObjectValue(array, column.badge.color) + ';'
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
                      <span v-if="column.badge.custom" :class="'badge text-' + column.badge.textColor" :style="'background-color: ' + getObjectValue(item, column.badge.color) + ';'
                        ">{{ getObjectValue(item, column.name) }}</span>
                      <span v-else :class="'badge bg-' +
                        column.badge.type +
                        '-subtle text-' +
                        column.badge.type +
                        ' p-2'
                        ">{{ getObjectValue(item, column.name) }}</span>
                    </div>
                  </div>
                </template>
                <template v-else-if="column.dateConfig">
                  <router-link v-if="column.routeName" :to="{
                    name: column.routeName,
                    params: {
                      id: getObjectValue(item, column.params.id)
                    },
                    query: {
                      date: getObjectValue(item, column.params.date)
                    }
                  }">
                    {{
                      formatDate(
                        item[column.name],
                        column.dateConfig.before,
                        column.dateConfig.after
                      )
                    }}
                  </router-link>
                  <template v-else>
                    {{
                      formatDate(
                        item[column.name],
                        column.dateConfig.before,
                        column.dateConfig.after
                      )
                    }}
                  </template>
                </template>
                <template v-else-if="column.offcanvas">
                  <button class="btn btn-light btn-sm" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRightTrial" aria-controls="offcanvasRightTrial" @click="
                      openOffcanvas({
                        courier: getObjectValue(item, column.offcanvas.courier),
                        tracking_number: item[column.name]
                      })
                      ">
                    {{ item[column.name] }}
                  </button>
                </template>
                <template v-else-if="column.stackedImage">
                  <StackedAvatar :collections="item[column.name]" />
                </template>
                <template v-else-if="column.isArray">
                  <template v-if="column.isFirst">
                    {{ getObjectValue(item[column.name][0], column.display) }}
                  </template>
                  <template v-else-if="column.isLast">
                    {{ getObjectValue(item[column.name][array.length - 1], column.display) }}
                  </template>
                  <template v-else>
                    <template>
                      {{ formatObjectArray(item[column.name], column.display) }}
                    </template>
                  </template>
                </template>
                <template v-else-if="column.defaultValue">
                  {{ getObjectValue(item, column.name, column.defaultValue) }}
                </template>
                <template v-else-if="column.color">
                  <div :style="{ backgroundColor: getObjectValue(item, column.name) }" class="p-1 rounded-2">
                    <span
                      :class="lightOrDark(getObjectValue(item, column.name)) == 'light' ? 'text-dark' : 'text-light'">
                      {{ getObjectValue(item, column.name) }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  {{ getObjectValue(item, column.name) }}
                </template>
              </td>
            </tr>
            <tr v-if="!paginatedItems.length">
              <td :colspan="state.columns.length" class="dataTables_empty" valign="top">
                <Spinner :loading="loadingState"></Spinner>
                <span v-if="isDataEmpty">No data available in table</span>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="paginatedItems.length">
            <slot name="tableFooter"></slot>
          </tfoot>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-5" v-if="props.table_pagination">
        <div class="dataTables_info" id="datatable_info" role="status" aria-live="polite"
          :class="props.paginationClass">
          <span class="page-stats">Showing {{ entriesRange }} entries</span>
        </div>
      </div>
      <div class="col-sm-12 col-md-7 d-flex justify-content-end" v-if="props.table_pagination">
        <div :class="totalPages >= 10 ? 'paging_simple_numbers' : 'paging_full_numbers'" class="dataTables_paginate"
          id="datatable_paginate">
          <ul class="pagination">
            <li class="paginate_button page-item previous">
              <button @click="prevPage" class="page-link" data-dt-idx="0" tabindex="0"
                :style="'cursor:' + (state.currentPage === 1 ? ' default;' : ' pointer;')">
                Previous
              </button>
            </li>
            <template v-if="totalPages <= 10">
              <li class="paginate_button page-item" v-for="pageNumber in pages" :key="pageNumber">
                <button @click="goToPage(pageNumber)" class="page-link" data-dt-idx="2" tabindex="0"
                  :class="{ active: pageNumber === state.currentPage }" :style="'cursor:' + (pageNumber === state.currentPage ? ' default;' : ' pointer;')
                    ">
                  {{ pageNumber }}
                </button>
              </li>
            </template>
            <template v-else>
              <template v-for="pageNumber in ellipsisPages.range" :key="pageNumber">
                <li class="paginate_button page-item" v-if="pageNumber !== '...'">
                  <button @click="goToPage(pageNumber)" class="page-link" data-dt-idx="2" tabindex="0"
                    :class="{ active: pageNumber === state.currentPage }" :style="'cursor:' + (pageNumber === state.currentPage ? ' default;' : ' pointer;')
                      ">
                    {{ pageNumber }}
                  </button>
                </li>
                <li v-else>
                  <span class="page-link" style="pointer-events: none">...</span>
                </li>
              </template>
            </template>
            <li class="paginate_button page-item next">
              <button @click="nextPage" class="page-link" data-dt-idx="8" tabindex="0"
                :style="'cursor:' + (state.currentPage === totalPages ? ' default;' : ' pointer;')">
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div ref="copyInfo" id="datatables_buttons_info" class="dt-button-info" style="display: none">
    <h2>Copy to clipboard</h2>
    <div>Copied {{ paginatedItems.length }} rows to clipboard</div>
  </div>
</template>
