<script setup>
import Layout from '@/layouts/MainLayout.vue'
import { onMounted } from 'vue'
import { reactive } from 'vue'
import { userService } from '@/service'

const data = reactive({
  position_id: null,
  position_options: []
})
function submitForm() {
  let formData = {
    position_id: data.position_id,
    permissions: data.permissions
  }
  userService.updateTemplate(formData)
}
function getPermissionValue(id) {
  let index = data.permissions.findIndex((e) => e.id == id)
  return index
}
function deselectChild(parentId) {
  const par = data.modules.find((e) => e.id == parentId)
  par.childs.map((c) => {
    data.permissions[getPermissionValue(c.id)].read = false
    data.permissions[getPermissionValue(c.id)].create = false
    data.permissions[getPermissionValue(c.id)].update = false
    data.permissions[getPermissionValue(c.id)].under_only = false
    data.permissions[getPermissionValue(c.id)].cross_department = false
    data.permissions[getPermissionValue(c.id)].marketing_only = false
  })
}

onMounted(async () => {
  await userService.templatePrivileges().then((res) => {
    data.position_options = res.data.positions
    data.modules = res.data.modules
    data.permissions = res.data.permissions.map((a) => {
      let n = a
      n.create = false
      n.read = false
      n.update = false
      n.under_only = false
      n.cross_department = false
      n.marketing_only = false
      return n
    })
  })
})
</script>
<template>
  <Layout>
    <form id="updateForm" @submit.prevent="submitForm">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col col-lg-2">
              <h5 class="card-title mb-0 cnt-userName">Create Template For:</h5>
              <vSelect id="position_id" label="text" placeholder="Select Position" v-model="data.position_id"
                :options="data.position_options" :reduce="(data) => data.value">
                <template #search="{ attributes, events }">
                  <input class="vs__search" :required="!data.position_id" v-bind="attributes" v-on="events" />
                </template>
              </vSelect>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="list-group" v-for="mod in data.modules" :key="mod.id">
            <label class="list-group-item active mt-1">
              <input :name="mod.name" :id="mod.name" :value="mod.id"
                v-model="data.permissions[getPermissionValue(mod.id)].read" class="form-check-input me-1 submod"
                type="checkbox" @change="(e) => {
                  if (!e.target.checked) {
                    deselectChild(mod.id)
                  }
                }
                  " />
              {{ mod.display_name }} <code>[{{ mod.name }}]</code>
            </label>
            <div class="list-group-item" v-for="child in mod.childs" :key="child.id">
              <div class="row pt-1">
                <div class="col-md-4">
                  <label class="pb-0 mb-0">
                    {{ child.display_name }}
                    <code>[{{ mod.name + '.' + child.name }}]</code>
                  </label>
                </div>
                <div class="col-md-3 form-check-success" id="priv_access_departments">
                  <label class="pb-0 mb-0 fs-10 text-muted text-uppercase me-2">
                    <input class="form-check-input me-1" type="checkbox" :name="mod.name + '.' + child.name + '.read'"
                      :id="mod.name + '.' + child.name" @change="() => {
                        let par = data.permissions[getPermissionValue(child.parent_id)].read
                        let target = data.permissions[getPermissionValue(child.id)].read
                        if (target == true) {
                          if (par == false) {
                            data.permissions[getPermissionValue(child.parent_id)].read = true
                          }
                        }
                      }
                        " v-model="data.permissions[getPermissionValue(child.id)].read" />
                    Read
                  </label>
                  <label class="pb-0 mb-0 fs-10 text-muted text-uppercase me-2" v-if="child.create == 1">
                    <input class="form-check-input me-1" type="checkbox" :name="mod.name + '.' + child.name + '.read'"
                      :id="mod.name + '.' + child.name" :value="child.id"
                      v-model="data.permissions[getPermissionValue(child.id)].create" @change="() => {
                        let par = data.permissions[getPermissionValue(child.parent_id)].read
                        let target = data.permissions[getPermissionValue(child.id)].create
                        if (target == true) {
                          if (par == false) {
                            data.permissions[getPermissionValue(child.parent_id)].read = true
                          }
                        }
                      }
                        " />
                    Create/Add
                  </label>
                  <label class="pb-0 mb-0 fs-10 text-muted text-uppercase me-2" v-if="child.update == 1">
                    <input class="form-check-input me-1" type="checkbox" :name="mod.name + '.' + child.name + '.read'"
                      :id="mod.name + '.' + child.name" :value="child.id"
                      v-model="data.permissions[getPermissionValue(child.id)].update" @change="() => {
                        let par = data.permissions[getPermissionValue(child.parent_id)].read
                        let target = data.permissions[getPermissionValue(child.id)].update
                        if (target == true) {
                          if (par == false) {
                            data.permissions[getPermissionValue(child.parent_id)].read = true
                          }
                        }
                      }
                        " />
                    Update
                  </label>
                </div>

                <!-- HOT stuff -->
                <div class="col-md-5 form-check-warning">
                  <label class="pb-0 mb-0 fs-10 text-muted text-uppercase me-2" v-if="child.under_only">
                    <input class="form-check-input me-1" type="checkbox"
                      :name="mod.name + '.' + child.name + '.under_only'" :id="mod.name + '.' + child.name"
                      v-model="data.permissions[getPermissionValue(child.id)].under_only" />
                    Under Only
                  </label>
                  <label class="pb-0 mb-0 fs-10 text-muted text-uppercase me-2" v-if="child.cross_department == 1">
                    <input class="form-check-input me-1" type="checkbox"
                      :name="mod.name + '.' + child.name + '.cross_department'" :id="mod.name + '.' + child.name"
                      :value="child.id" v-model="data.permissions[getPermissionValue(child.id)].cross_department" />
                    Cross Department
                  </label>
                  <label class="pb-0 mb-0 fs-10 text-muted text-uppercase me-2" v-if="child.marketing_only == 1">
                    <input class="form-check-input me-1" type="checkbox"
                      :name="mod.name + '.' + child.name + '.marketing_only'" :id="mod.name + '.' + child.name"
                      :value="child.id" v-model="data.permissions[getPermissionValue(child.id)].marketing_only" />
                    Marketing Only
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button type="submit" class="btn btn-success" name="goUpdate">
            <i class="ri-check-line align-bottom me-1"></i>
            Update/Save
          </button>
        </div>
      </div>
    </form>
  </Layout>
</template>
