<script setup lang="ts">
import moment from 'moment'
import { computed } from 'vue'
import { reactive } from 'vue'

const props = defineProps({
  currentDate: {
    type: Date,
    required: true
  },
  perDays: {
    type: Boolean,
    default: false
  },
  perYear: {
    type: Boolean,
    default: false
  },
  perQuarter: {
    type: Boolean,
    default: false
  },
  noData: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['changeDate'])

const state = reactive({
  currentDate: props.currentDate,
  prevDate: null,
  nextDate: null,
  params: {},
  staffRanks: []
})

const formatDate = (data: moment.MomentInput, label = false) => {
  if (data) {
    let date = moment(data)
    let config = 'MMM YYYY'
    if (props.perDays) {
      config = 'DD MMM YYYY'
    }
    if (props.perYear) {
      config = 'YYYY'
    }
    if (props.perQuarter) {
      config = '[Q]Q YYYY'
    }
    if (label) {
      config = config.replace('MMM', 'MMMM')
    }
    return date.format(config)
  }
  return ''
}

const prevDate = () => {
  const previousDate = new Date(state.currentDate)
  previousDate.setDate(previousDate.getDate() - 1)
  state.currentDate = previousDate
  emit('changeDate', state.currentDate)
}

const prevMonth = () => {
  const previousMonthDate = new Date(state.currentDate)
  previousMonthDate.setDate(1)
  if(props.perQuarter){
    moment(previousMonthDate).subtract(1, 'Q')
  } else {
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1)
  }
  state.currentDate = previousMonthDate
  emit('changeDate', state.currentDate)
}

const prevYear = () => {
  const previousYear = new Date(state.currentDate)
  previousYear.setFullYear(previousYear.getFullYear() - 1)
  state.currentDate = previousYear
  emit('changeDate', state.currentDate)
}

const nextDate = () => {
  if (!isNextButtonDisabled.value) {
    const nextDate = new Date(state.currentDate)
    nextDate.setDate(nextDate.getDate() + 1)
    state.currentDate = nextDate
    emit('changeDate', state.currentDate)
  }
}

const nextMonth = () => {
  if (!isNextButtonDisabled.value) {
    const nextMonthDate = new Date(state.currentDate)
    if(props.perQuarter){
      moment(nextMonthDate).add(1, 'Q')
    } else {
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
    }
    state.currentDate = nextMonthDate
    emit('changeDate', state.currentDate)
  }
}

const nextYear = () => {
  if (!isNextButtonDisabled.value) {
    const nextYear = new Date(state.currentDate)
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    state.currentDate = nextYear
    emit('changeDate', state.currentDate)
  }
}

const isNextButtonDisabled = computed(() => {
  const today = new Date()
  let status =
    state.currentDate.getFullYear() === today.getFullYear() &&
    state.currentDate.getMonth() === today.getMonth()
  if (props.perYear) {
    return state.currentDate.getFullYear() === today.getFullYear()
  }
  if (props.perDays) {
    return status && state.currentDate.getDate() === today.getDate()
  }
  if (props.perQuarter) {
    return (
      moment(state.currentDate).quarter() === moment(today).quarter() &&
      state.currentDate.getFullYear() === today.getFullYear()
    )
  } else {
    return status
  }
})

const previousMonthLabel = computed(() => {
  const previousMonthDate = new Date(state.currentDate)
  previousMonthDate.setDate(1)
  if(props.perQuarter){
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 3)
  } else {
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1)
  }
  return formatDate(previousMonthDate)
})

const previousDateLabel = computed(() => {
  const previousDate = new Date(state.currentDate)
  previousDate.setDate(previousDate.getDate() - 1)
  return formatDate(previousDate)
})

const previousYearLabel = computed(() => {
  const previousYear = new Date(state.currentDate)
  previousYear.setFullYear(previousYear.getFullYear() - 1)
  return formatDate(previousYear)
})

const currentMonthLabel = computed(() => {
  return formatDate(state.currentDate, true)
})

const nextYearLabel = computed(() => {
  const nextYear = new Date(state.currentDate)
  nextYear.setFullYear(nextYear.getFullYear() + 1)
  return formatDate(nextYear)
})

const nextMonthLabel = computed(() => {
  const nextMonthDate = new Date(state.currentDate)
  if(props.perQuarter){
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 3)
  } else {
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
  }
  return formatDate(nextMonthDate)
})

const nextDateLabel = computed(() => {
  const nextDate = new Date(state.currentDate)
  nextDate.setDate(nextDate.getDate() + 1)
  return formatDate(nextDate)
})
</script>
<template>
  <div class="row mb-3">
    <div class="col-4">
      <button
        class="btn btn-success btn-label waves-effect waves-light"
        @click="props.perDays ? prevDate() : props.perYear ? prevYear() : prevMonth()"
      >
        <i class="ri-arrow-left-s-line label-icon align-middle fs-16 me-2"></i>
        {{
          props.perDays ? previousDateLabel : props.perYear ? previousYearLabel : previousMonthLabel
        }}
      </button>
    </div>
    <div class="col-4 text-center">
      <h4 class="pt-2 text-muted text-uppercase">{{ currentMonthLabel }}</h4>
      <h6 class="pt-1 text-muted text-uppercase" v-if="props.noData">(NO DATA)</h6>
    </div>
    <div class="col-4 text-right" style="text-align: right">
      <button
        v-if="!isNextButtonDisabled"
        class="btn btn-success btn-label waves-effect waves-light right"
        @click="props.perDays ? nextDate() : props.perYear ? nextYear() : nextMonth()"
      >
        {{ props.perDays ? nextDateLabel : props.perYear ? nextYearLabel : nextMonthLabel }}
        <i class="ri-arrow-right-s-line label-icon align-middle fs-16 ms-2"></i>
      </button>
    </div>
  </div>
</template>
