import { defineStore } from 'pinia'
import moment from 'moment'

// Define types for your data structure
interface Customer {
  employee: number
  last_purchase_date: string
}

interface Sales {
  per_page: number
  sales_date_range: string
}

interface CrmTask {
  last_purchase_date: string
}

interface CrmCustomer {
  per_page: number
}

interface Order {
  per_page: number
  date: string
}

interface OrderArchive {
  per_page: number
  sale_status: string
}

interface Transfer {
  per_page: number
  date: string
}

interface TransferArchive {
  per_page: number
  sale_status: number
}

// Combine all interfaces into a single type
interface DataDefault {
  customer: Customer
  sales: Sales
  crmTask: CrmTask
  crmCustomer: CrmCustomer
  order: Order
  orderArchieve: OrderArchive
  transfer: Transfer
  transferArchieve: TransferArchive
}

const dataDefault: DataDefault = {
  customer: {
    employee: 1,
    last_purchase_date: moment(new Date()).format('YYYY-MM-DD')
  },
  sales: {
    per_page: 10,
    sales_date_range: moment(new Date()).format('YYYY-MM-DD')
  },
  crmTask: {
    last_purchase_date: moment(new Date()).format('YYYY-MM-DD')
  },
  crmCustomer: {
    per_page: 10
  },
  order: {
    per_page: 10,
    date: moment(new Date()).format('YYYY-MM-DD')
  },
  orderArchieve: {
    per_page: 10,
    sale_status: 'all'
  },
  transfer: {
    per_page: 10,
    date: moment(new Date()).format('YYYY-MM-DD')
  },
  transferArchieve: {
    per_page: 10,
    sale_status: 1
  }
}

export const useParamsStore = defineStore('params', {
  state: (): DataDefault => ({
    ...dataDefault
  }),
  actions: {
    // changeParams(type: keyof DataDefault, data: DataDefault[keyof DataDefault]) {
    //   this[type] = data
    // },
    // resetParams(type: keyof DataDefault) {
    //   this[type] = dataDefault[type]
    // },
    changeParams<K extends keyof DataDefault>(this: DataDefault, type: K, data: DataDefault[K]) {
      this[type] = data
    },
    resetParams<K extends keyof DataDefault>(this: DataDefault, type: K) {
      this[type] = dataDefault[type]
    }
  }
})
