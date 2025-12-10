import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    checkRole: (...args: any[]) => any
    checkOwner: (...args: any[]) => any
    checkPermission: (...args: any[]) => any
    thousandSeparator: (x: any) => any
  }
}

export {}
