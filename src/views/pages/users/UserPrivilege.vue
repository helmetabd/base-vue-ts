<script setup lang="ts">
import Layout from '@/layouts/MainLayout.vue'
import Swal from 'sweetalert2'
import { onMounted } from 'vue'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { userService } from '@/service'
import type { Modules, Permission } from '@/interfaces/User'

const route = useRoute()
const data = reactive({
  userId: route.params.id,
  userName: '' as string,
  modules: [] as Modules[],
  permissions: [] as Permission[]
})
function submitForm() {
  userService.updatePrivileges(Number(data.userId), data.permissions)
}
function getPermissionValue(id: number) {
  const index = data.permissions.findIndex((e) => e.id == id)
  return index
}
function deselectChild(parentId: number) {
  const par = data.modules.find((e) => e.id == parentId)
  par?.childs.map((c) => {
    const perm = data.permissions[getPermissionValue(c.id)]
    if (perm) {
      perm.read = false
      perm.create = false
      perm.update = false
      perm.under_only = false
    }
  })
}

onMounted(async () => {
  await userService
    .privileges(Number(data.userId))
    .then((res) => {
      data.userName = res.data.name
      data.modules = res.params.modules
      data.permissions = res.data?.permissions?.map((a) => {
        const n = a
        n.create = n.create == 1 ? true : false
        n.read = n.read == 1 ? true : false
        n.update = n.update == 1 ? true : false
        return n
      })
    })
    .catch((error) => Swal.fire('error', error.response.message, 'error'))
})
</script>
<template>
  <Layout>
    <form id="updateForm" @submit.prevent="submitForm">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0 cnt-userName">Set Privileges ({{ data.userName }})</h5>
        </div>
        <div class="card-body">
          <div class="list-group" v-for="mod in data.modules" :key="mod.id">
            <label class="list-group-item active mt-1">
              <input :name="`${mod.name}_read`" :id="`${mod.name}_read`" :value="mod.id"
                :checked="!!data.permissions[getPermissionValue(mod.id)]?.read" @change="(e) => {
                  const perm = data.permissions[getPermissionValue(mod.id)];
                  if (perm) {
                    perm.read = (e.target as HTMLInputElement)?.checked || false;
                  }
                  if (!(e.target as HTMLInputElement)?.checked) {
                    deselectChild(mod.id)
                  }
                }" class="form-check-input me-1 submod" type="checkbox" />
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
                <div class="col-md-3 form-check-success">
                  <label class="pb-0 mb-0 fs-10 text-muted text-uppercase me-2">
                    <input class="form-check-input me-1" type="checkbox" :name="`${mod.name}.${child.name}.read`"
                      :id="`${mod.name}.${child.name}.read`"
                      :checked="!!data.permissions[getPermissionValue(child.id)]?.read" @change="(e) => {
                        const perm = data.permissions[getPermissionValue(child.id)];
                        if (perm) {
                          perm.read = (e.target as HTMLInputElement)?.checked || false;
                        }
                        if (child.parent_id) {
                          let par = data.permissions[getPermissionValue(child.parent_id)]?.read
                          let target = (e.target as HTMLInputElement)?.checked
                          if (target == true) {
                            if (par == false) {
                              const parentPerm = data.permissions[getPermissionValue(child.parent_id)];
                              if (parentPerm) {
                                parentPerm.read = true;
                              }
                            }
                          }
                        }
                      }" />
                    Read
                  </label>
                  <label class="pb-0 mb-0 fs-10 text-muted text-uppercase me-2" v-if="child.create == 1">
                    <input class="form-check-input me-1" type="checkbox" :name="`${mod.name}.${child.name}.create`"
                      :id="`${mod.name}.${child.name}.create`" :value="child.id"
                      :checked="!!data.permissions[getPermissionValue(child.id)]?.create" @change="(e) => {
                        const perm = data.permissions[getPermissionValue(child.id)];
                        if (perm) {
                          perm.create = (e.target as HTMLInputElement)?.checked || false;
                        }
                        if (child.parent_id) {
                          let par = data.permissions[getPermissionValue(child.parent_id)]?.read
                          let target = (e.target as HTMLInputElement)?.checked
                          if (target == true) {
                            if (par == false) {
                              const parentPerm = data.permissions[getPermissionValue(child.parent_id)];
                              if (parentPerm) {
                                parentPerm.read = true;
                              }
                            }
                          }
                        }
                      }" />
                    Create/Add
                  </label>
                  <label class="pb-0 mb-0 fs-10 text-muted text-uppercase me-2" v-if="child.update == 1">
                    <input class="form-check-input me-1" type="checkbox" :name="`${mod.name}.${child.name}.update`"
                      :id="`${mod.name}.${child.name}.update`" :value="child.id"
                      :checked="!!data.permissions[getPermissionValue(child.id)]?.update" @change="(e) => {
                        const perm = data.permissions[getPermissionValue(child.id)];
                        if (perm) {
                          perm.update = (e.target as HTMLInputElement)?.checked || false;
                        }
                        if (child.parent_id) {
                          let par = data.permissions[getPermissionValue(child.parent_id)]?.read
                          let target = (e.target as HTMLInputElement)?.checked
                          if (target == true) {
                            if (par == false) {
                              const parentPerm = data.permissions[getPermissionValue(child.parent_id)];
                              if (parentPerm) {
                                parentPerm.read = true;
                              }
                            }
                          }
                        }
                      }" />
                    Update
                  </label>
                </div>

                <!-- HOT stuff -->
                <div class="col-md-5 form-check-warning">
                  <label class="pb-0 mb-0 fs-10 text-muted text-uppercase me-2" v-if="child.under_only">
                    <input class="form-check-input me-1" type="checkbox" :name="`${mod.name}.${child.name}.under_only`"
                      :id="`${mod.name}.${child.name}.under_only`"
                      :checked="!!data.permissions[getPermissionValue(child.id)]?.under_only" @change="(e) => {
                        const perm = data.permissions[getPermissionValue(child.id)];
                        if (perm) {
                          perm.under_only = (e.target as HTMLInputElement)?.checked || false;
                        }
                      }" />
                    Under Only
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
        <div class="card-footer">
          <i class="ri-arrow-left-line"></i>
          <router-link :to="{ name: 'user.detail', params: { id: data.userId } }">Back to detail</router-link>
        </div>
      </div>
    </form>
  </Layout>
</template>
