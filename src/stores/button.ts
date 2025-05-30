import { defineStore } from 'pinia'

export const useButtonStore = defineStore('button', {
  state: () => ({
    button: false
  }),
})
