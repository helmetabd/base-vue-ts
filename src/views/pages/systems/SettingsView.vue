<script setup>
import Layout from '@/layouts/MainLayout.vue'
import apiClient from '@/service/ApiClientService'
import Swal from 'sweetalert2'
import { onMounted, reactive } from 'vue'

const state = reactive({
  settings: null,
  users: [],
})

function fetch() {
  apiClient
    .get('/settings')
    .then((res) => {
      state.settings = res.data
    })
    .catch((e) =>
      Swal.fire('Error', e.response?.data?.message ?? 'Gagal menghubungi server', 'error')
    )
}

function fetchUser() {
  apiClient.getUsers
  apiClient
    .get('/settings/get-users')
    .then((res) => {
      state.users = res.data
    })
    .catch((e) =>
      Swal.fire('Error', e.response?.data?.message ?? 'Gagal menghubungi server', 'error')
    )
}

function update(event) {
  let formData = new FormData(event.target)
  apiClient
    .put('/settings', formData)
    .then((res) => Swal.fire('Success', res.message, 'success'))
    .catch((e) => Swal.fire('Error', e.response.data?.message ?? 'Internal Server Error', 'error'))
}
onMounted(() => {
  fetch()
  fetchUser()
})
</script>

<template>
  <Layout>
    <h5 class="mb-3">Settings</h5>
    <div class="card">
      <div class="card-body">
        <p class="text-muted">Here you can customize system level parameters.</p>
      </div>
      <div class="border">
        <ul class="nav nav-pills custom-hover-nav-tabs">
          <li class="nav-item">
            <a href="#global" data-bs-toggle="tab" aria-expanded="false" class="nav-link active">
              <i class="las la-cog align-middle nav-icon nav-tab-position"></i>
              <h5 class="nav-titl nav-tab-position m-0">Globals</h5>
            </a>
          </li>
          <li class="nav-item">
            <a href="#broadcast" data-bs-toggle="tab" aria-expanded="true" class="nav-link">
              <i class="lab la-whatsapp align-middle nav-icon nav-tab-position"></i>
              <h5 class="nav-titl nav-tab-position m-0">Broadcast</h5>
            </a>
          </li>
          <li class="nav-item">
            <a href="#rabbit-mq" data-bs-toggle="tab" aria-expanded="false" class="nav-link">
              <i class="las la-network-wired nav-icon nav-tab-position"></i>
              <h5 class="nav-titl nav-tab-position m-0">Rabbit MQ</h5>
            </a>
          </li>
          <li class="nav-item">
            <a href="#danger-zone" data-bs-toggle="tab" aria-expanded="false" class="nav-link">
              <i class="las la-exclamation-triangle nav-icon nav-tab-position text-danger"></i>
              <h5 class="nav-titl nav-tab-position m-0">Danger Zone</h5>
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="tab-content text-muted">
          <div class="tab-pane show active" id="global">
            <h6 class="mb-3">Global Settings</h6>
            <div class="card-body table-responsive">
              <form class="form" id="globalForm" @submit.prevent="(e) => update(e)">
                <table class="table table-striped nowrap align-middle fs-12">
                  <tbody>
                    <tr v-for="setting in state.settings" :key="setting.id">
                      <template v-if="setting.scope == 'system'">
                        <td width="25%">
                          <strong>
                            <i class="las la-long-arrow-alt-right me-1"></i>
                            {{ setting.display_name }}
                          </strong>
                        </td>
                        <td>
                          <input :name="`settings[${setting.name}]`" type="text" class="form-control"
                            :value="setting.value" style="min-width: 300px" v-if="setting.type == 'string'" />
                          <div class="form-check form-switch form-switch-success" v-if="setting.type == 'bool'">
                            <input :name="`settings[${setting.name}]`" class="form-check-input form-switch-md"
                              type="checkbox" value="1" :checked="parseInt(setting.value) == 1" />
                            <input type="hidden" :name="`settings[${setting.name}]`" value="0" />
                          </div>
                        </td>
                      </template>
                    </tr>
                    <tr>
                      <td width="20%">&nbsp;</td>
                      <td colspan="2">
                        <button class="btn btn-info" type="submit" id="goUpdate" name="goUpdate">
                          <i class="ri-check-line align-middle me-1"></i>
                          Update/Save
                        </button>
                        <label style="padding-left: 11px">
                          <input type="checkbox" name="confirm" value="1" class="ace accessroot" required="" />
                          <span class="lbl"> Confirm.</span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
          </div>
          <div class="tab-pane" id="broadcast">
            <h6>Broadcast</h6>
            <div class="card-body table-responsive">
              <form class="form" id="globalForm" @submit.prevent="(e) => update(e)">
                <table class="table table-striped nowrap align-middle fs-12">
                  <tbody>
                    <tr v-for="setting in state.settings" :key="setting.id">
                      <template v-if="setting.scope == 'broadcast'">
                        <td width="25%">
                          <strong>
                            <i class="las la-long-arrow-alt-right me-1"></i>
                            {{ setting.display_name }}
                          </strong>
                        </td>
                        <td>
                          <input :name="`settings[${setting.name}]`" type="text" class="form-control"
                            :value="setting.value" style="min-width: 300px" v-if="setting.type == 'string'" />
                          <div class="form-check form-switch form-switch-success" v-if="setting.type == 'bool'">
                            <input :name="`settings[${setting.name}]`" class="form-check-input form-switch-md"
                              type="checkbox" value="1" :checked="parseInt(setting.value) == 1" />
                            <input type="hidden" :name="`settings[${setting.name}]`" value="0" />
                          </div>
                        </td>
                      </template>
                    </tr>
                    <tr>
                      <td width="20%">&nbsp;</td>
                      <td colspan="2">
                        <button class="btn btn-info" type="submit" id="goUpdate" name="goUpdate">
                          <i class="ri-check-line align-middle me-1"></i>
                          Update/Save
                        </button>
                        <label style="padding-left: 11px">
                          <input type="checkbox" name="confirm" value="1" class="ace accessroot" required="" />
                          <span class="lbl"> Confirm.</span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
          </div>
          <div class="tab-pane" id="rabbit-mq">
            <h6>Rabbit MQ</h6>
            <div class="card-body table-responsive">
              <form class="form" id="globalForm" @submit.prevent="(e) => update(e)">
                <table class="table table-striped nowrap align-middle fs-12">
                  <tbody>
                    <tr v-for="setting in state.settings" :key="setting.id">
                      <template v-if="setting.scope == 'rabbit-mq'">
                        <td width="25%">
                          <strong>
                            <i class="las la-long-arrow-alt-right me-1"></i>
                            {{ setting.display_name }}
                          </strong>
                        </td>
                        <td>
                          <input :name="`settings[${setting.name}]`" type="text" class="form-control"
                            :value="setting.value" style="min-width: 300px" v-if="setting.type == 'string'" />
                          <div class="form-check form-switch form-switch-success" v-if="setting.type == 'bool'">
                            <input :name="`settings[${setting.name}]`" class="form-check-input form-switch-md"
                              type="checkbox" value="1" :checked="parseInt(setting.value) == 1" />
                            <input type="hidden" :name="`settings[${setting.name}]`" value="0" />
                          </div>
                        </td>
                      </template>
                    </tr>
                    <tr>
                      <td width="20%">&nbsp;</td>
                      <td colspan="2">
                        <button class="btn btn-info" type="submit" id="goUpdate" name="goUpdate">
                          <i class="ri-check-line align-middle me-1"></i>
                          Update/Save
                        </button>
                        <label style="padding-left: 11px">
                          <input type="checkbox" name="confirm" value="1" class="ace accessroot" required="" />
                          <span class="lbl"> Confirm.</span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
          </div>
          <div class="tab-pane" id="danger-zone">
            <div class="d-flex justify-content-center align-items-center bg-danger-subtle py-2">
              <h5 class="text-danger align-text-bottom">Danger Zone</h5>
            </div>
            <div class="card-body table-responsive">
              <form class="form" id="globalForm" @submit.prevent="(e) => update(e)">
                <table class="table table-striped nowrap align-middle fs-12">
                  <tbody>
                    <tr v-for="setting in state.settings" :key="setting.id">
                      <template v-if="setting.scope == 'danger-zone'">
                        <td width="25%">
                          <strong>
                            <i class="las la-long-arrow-alt-right me-1"></i>
                            {{ setting.display_name }}
                          </strong>
                        </td>
                        <td>
                          <input v-if="setting.type == 'string'" :name="`settings[${setting.name}]`" type="text"
                            class="form-control" :value="setting.value" style="min-width: 300px" />
                          <div v-if="setting.type == 'bool'" class="form-check form-switch form-switch-success">
                            <input :name="`settings[${setting.name}]`" class="form-check-input form-switch-md"
                              type="checkbox" value="1" :checked="parseInt(setting.value) == 1" />
                            <input type="hidden" :name="`settings[${setting.name}]`" value="0" />
                          </div>
                          <MultiSelect v-if="setting.type == 'select_multiple'"
                            name="telo_godog"
                            mode="tags" 
                            placeholder="Select maintainer"
                            v-model="setting.value" 
                            :close-on-select="true" 
                            :searchable="true" 
                            :object="false"
                            :delay="300" 
                            :min-chars="1" 
                            :options="state.users" />
                          <input v-if="setting.type == 'select_multiple'" :name="`settings[${setting.name}]`" type="hidden" :value="setting.value">
                        </td>
                      </template>
                    </tr>
                    <tr>
                      <td width="20%">&nbsp;</td>
                      <td colspan="2">
                        <button class="btn btn-info" type="submit" id="goUpdate" name="goUpdate">
                          <i class="ri-check-line align-middle me-1"></i>
                          Update/Save
                        </button>
                        <label style="padding-left: 11px">
                          <input type="checkbox" name="confirm" value="1" class="ace accessroot" required="" />
                          <span class="lbl"> Confirm.</span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- end card-body -->
    </div>
  </Layout>
</template>
