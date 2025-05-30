import { defineStore } from 'pinia'
import { departmentService, positionService } from '@/service'
import type { Department } from '@/interfaces/Department'
import type { Option } from '@/interfaces/Utils'

export const useDepartmentStore = defineStore('departments', {
  state: () => ({
    departments: [] as Department[],
    levels: [] as Option[],
    positionGroups: [] as Option[]
  }),
  getters: {
    getDepartmentList(state): Option[] {
      const sortedDepartments: Option[] = []

      // Helper function to recursively add children and sub-children
      function addChildren(parentId: number | null, prefix = '') {
        state.departments.forEach((department: Department) => {
          if (department.parent === null && parentId === null) {
            sortedDepartments.push({ value: department.id, label: `${prefix}${department.name}` })
            addChildren(department.id, '-- ')
          } else if (department.parent?.id === parentId) {
            sortedDepartments.push({ value: department.id, label: `${prefix}${department.name}` })
            addChildren(department.id, prefix + '-- ')
          }
        })
      }

      // Start with root departments (those with no parent)
      addChildren(null)

      return sortedDepartments
    }
  },
  actions: {
    async fetchDepartments() {
      this.departments = await departmentService.index()
    },
    async fetchPositionLevels() {
      const result = await positionService.create()
      this.levels = result.level
      this.positionGroups = result.position_groups
    }
  }
})
