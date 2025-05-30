<template>
  <table cellpadding="0" cellspacing="0" border="0">
    <tbody>
      <tr class="node-cells">
        <td v-if="datasource" class="node-cell" :colspan="datasource.children && datasource.children.length ? datasource.children.length * 2 : 0
          ">
          <div class="node" :id="datasource.id.toString()">
            <!-- Use the default slot with a fallback content -->
            <slot name="nodeSlot" :nodeData="datasource">
              <div class="title">
                {{ datasource.name }}
              </div>
              <div class="content">{{ datasource.id }}</div>
            </slot>
          </div>
        </td>
      </tr>
      <template v-if="datasource.children && datasource.children.length">
        <tr>
          <td :colspan="datasource.children.length * 2">
            <div class="down"></div>
          </td>
        </tr>
        <tr>
          <td class="right">&nbsp;</td>
          <template v-for="n in datasource.children.length - 1" :key="n">
            <td class="left top">&nbsp;</td>
            <td class="right top">&nbsp;</td>
          </template>
          <td class="left">&nbsp;</td>
        </tr>
        <tr>
          <td class="node-container" colspan="2" v-for="child in datasource.children" :key="child.id">
            <organization-chart-node :datasource="child">
              <!-- Use v-slot to pass scoped slots -->
              <template v-for="(_, name) in $slots as {}" v-slot:[name]="scope">
                <slot :name="name" v-bind="scope" />
              </template>
            </organization-chart-node>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { DepartmentMap } from '@/interfaces/Department'

// Define the props
defineProps<{
  datasource: DepartmentMap
}>()
</script>
