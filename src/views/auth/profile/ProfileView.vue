<script>
import Layout from '@/layouts/MainLayout.vue'
import BaseInput from '@/components/partials/base-input.vue'
import ModalEditPicture from './EditPictureView.vue'
import BaseCard from '@/components/cards/base-card.vue'
import { useProfileStore } from '../../../stores/profile'
import { storeToRefs } from 'pinia'
import { getAvatar } from '../../../utils/assetsHelper'

export default {
  setup() {
    const profileStore = useProfileStore()
    const { fetchProfiles, updateUsersProfile, updateUsersPassword } = profileStore

    fetchProfiles()

    return {
      ...storeToRefs(profileStore),
      fetchProfiles,
      updateUsersProfile,
      updateUsersPassword
    }
  },
  data() {
    return {
      formData: {
        name: this.profile.name,
        phone: this.profile.phone,
        email: this.profile.email,
        gender: this.genders.filter((data) => {
          return data.value === this.profile.gender
        })
      },
      inputFields: [
        {
          id: 1,
          label: 'Name',
          name: 'name',
          inputType: 'text',
          modelValue: ''
        },
        {
          id: 2,
          label: 'Email',
          name: 'email',
          inputType: 'text',
          modelValue: ''
        },
        {
          id: 3,
          label: 'Phone',
          name: 'phone',
          inputType: 'number',
          modelValue: ''
        }
      ],
      passsword: '',
      passwordConfirmation: '',
      genders: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ],
      showModal: false,
      checked: false,
      passwordChecked: false
    }
  },
  components: {
    Layout,
    BaseInput,
    BaseCard,
    ModalEditPicture
  },
  computed: {
    // ...profileComputed,
    // ...mapState('profile', ['profile']),
  },
  methods: {
    searchAvatar: (avatar) => getAvatar(avatar),
    // ...profileMethods,
    // ...mapActions('profile', ['fetchProfiles']),
    getRoleBadgeClass(name) {
      switch (name) {
        case 'super_admin':
          return 'bg-danger-subtle text-danger'
        case 'admin':
          return 'bg-primary-subtle text-primary'
        case 'user':
          return 'bg-warning-subtle text-warning'
        default:
          return ''
      }
    },

    editProfileData() {
      this.formData.gender = this.formData.gender.value
      // const profileData = {
      //   name: this.nameValue,
      //   phone: this.phoneValue,
      //   email: this.emailValue,
      //   gender: this.genderSelect.value
      // }

      // this.$store.commit('updateProfileData', profileData)
      this.updateUsersProfile(this.formData)
    },

    editPassword() {
      const passwordData = {
        password: this.password,
        password_confirmation: this.passwordConfirmation
      }

      this.updateUsersPassword(passwordData)
    }
  }
  // mounted() {
  //   this.fetchProfile()
  // }
}
</script>
<template>
  <Layout>
    <div>
      <div class="row">
        <BaseCard wrapperClass="col-lg-3" noHeader>
          <template #cardBody>
            <div class="card-body p-4 text-center">
              <div class="mx-auto avatar-md mb-3">
                <img
                  :src="searchAvatar(avatar)"
                  style="height: 100%; width: 100%"
                  alt="user-image-profile"
                  class="myAvatar img-fluid rounded-circle"
                />
              </div>
              <template v-if="roleValue">
                <h5 class="card-title mb-2">{{ nameValue }}</h5>
                <p class="text-muted">
                  <span class="rounded p-1" :class="getRoleBadgeClass(roleValue.name)">
                    {{ roleValue.display_name }}
                  </span>
                </p>
              </template>
            </div>
          </template>
          <template #cardFooterStart>
            <ModalEditPicture />
          </template>
        </BaseCard>
        <div class="col-lg-9">
          <form action="" method="post" id="updateForm" @submit.prevent="editProfileData">
            <div class="card" id="userDetail">
              <div class="card-header">
                <h5 class="card-title mb-0 cnt-userName">User Data</h5>
              </div>
              <div class="card-body">
                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_name">Name</label>
                  </div>
                  <div class="col-md-9">
                    <BaseInput v-model="nameValue" :modelValue="nameValue" :inputType="'text'" />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_email">Email</label>
                  </div>
                  <div class="col-md-9">
                    <BaseInput v-model="emailValue" :modelValue="emailValue" :inputType="'email'" />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_email">Gender</label>
                  </div>
                  <div class="col-md-9">
                    <v-select
                      v-model="genderSelect"
                      :options="genders"
                      :placeholder="'Select Gender'"
                      label="label"
                    />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_phone">Contact (Phone/WA)</label>
                  </div>
                  <div class="col-md-9">
                    <BaseInput v-model="phoneValue" :modelValue="phoneValue" :inputType="'phone'" />
                  </div>
                </div>
                <input type="hidden" name="uid" value="349" />
              </div>
              <div class="card-footer">
                <button :class="checked ? '' : 'disabled'" class="btn btn-primary">
                  <i class="ri-check-line align-middle me-1"></i>
                  Update/Save
                </button>
                <input
                  style="margin-left: 30px"
                  type="checkbox"
                  id="checkboxDetail"
                  v-model="checked"
                />
                <!-- @change="(e) => handleCheckbox(checked, e)" -->
                <label style="padding-left: 11px" for="checkboxDetail">Confirm</label>
              </div>
            </div>
          </form>

          <form @submit.prevent="editPassword">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0 cnt-userName">Change Password</h5>
              </div>
              <div class="card-body">
                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_pass">New Password</label>
                  </div>
                  <div class="col-md-9">
                    <input id="user_pass" v-model="password" class="form-control" type="password" />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-3">
                    <label class="form-label" for="user_pass_confrm"
                      >New Password Confrmation</label
                    >
                  </div>
                  <div class="col-md-9">
                    <input
                      id="user_pass_confrm"
                      v-model="passwordConfirmation"
                      class="form-control"
                      type="password"
                    />
                  </div>
                </div>

                <input type="hidden" name="uid" value="349" />
              </div>
              <!--End Card Body-->
              <div class="card-footer">
                <button :class="passwordChecked ? '' : 'disabled'" class="btn btn-danger">
                  <i class="ri-check-line align-middle me-1"></i>
                  Update/Save
                </button>
                <input
                  style="margin-left: 30px"
                  type="checkbox"
                  id="checkboxPassword"
                  v-model="passwordChecked"
                />
                <!-- @change="(e) => handleCheckbox(passwordChecked, e)" -->
                <label style="padding-left: 11px" for="checkboxPassword">Confirm</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style>
.tamp {
  position: absolute;
  top: 17px;
  right: 16px;
}
.form-select {
  width: 96%;
  margin-left: 2%;
}
.vs__search,
.vs__search:focus {
  font-size: 1em;
  padding: 5px 12px;
}
</style>
