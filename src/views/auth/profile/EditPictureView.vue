<script>
/* eslint-disable */
import { Cropper, CircleStencil, Preview } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  setup(){
    const profileStore = useProfileStore()
    const { updateUsersImage } = profileStore

    return {
      updateUsersImage
    }
  },
  components: {
    Cropper,
    CircleStencil,
    Preview,
  },
  data() {
    return {
      checked: false,
      showModal: false,
      preview: null,
      croppedImage: null,
      pictureSelected: null,
      result: {
        coordinates: null,
        image: null,
      },
    };
  },
  computed: {
    ...profileComputed,
  },
  methods: {
    ...profileMethods,

    modalOpen() {
      this.showModal = true;
    },

    editData() {
      const result = this.result;

      if (result.image) {
        const { canvas } = this.$refs.cropper.getResult();

        if (canvas) {
          const form = new FormData();
          canvas.toBlob((blob) => {
            form.append("avatar", blob);
            this.updateUsersImage(form);
          }, "image/jpeg");
        }

        this.showModal = false;
      } else {
        console.error("No valid image data available for update");
      }
    },

    imagePreview: function (event) {
      var input = event.target;
      if (input.files) {
        this.pictureSelected = input.files[0];
        var reader = new FileReader();
        reader.onload = (e) => {
          this.preview = e.target.result;
        };
        this.pictureSelected = input.files[0];
        reader.readAsDataURL(input.files[0]);
      }
    },

    onChange({ coordinates, image }) {
      this.result = {
        coordinates,
        image,
      };
    },

    cropImage() {
      const result = this.$refs.cropper.getResult();
      this.editData(result.image);
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${result.canvas.toDataURL(
        "image/jpeg"
      )}"></img>`;
    },

    reset: function () {
      this.pictureSelected = null;
      this.preview = null;
      this.image_list = [];
      this.preview_list = [];
    },
  },
};
</script>
<template>
  <div>
    <button class="btn btn-success" @click="modalOpen">
      <i class="ri-user-line align-middle me-1"></i> Update Avatar
    </button>
    <BModal
      v-model="showModal"
      hide-footer
      title="Update Password"
      class="v-modal-custom"
    >
      <form @submit.prevent="editData">
        <div class="row g-3">
          <div class="image-wrapper">
            <div class="image-container">
              <!-- <b-img
                alt="Image Preview"
                :src="preview"
                class="img-fluid image-item">
              </b-img> -->
              <Cropper
                ref="cropper"
                :src="preview"
                @change="onChange"
                :debounce="false"
                :stencil-props="{
                  aspectRatio: 1,
                }"
                :stencil-component="$options.components.CircleStencil"
              />
              <preview
                :width="120"
                :height="120"
                :image="result.image"
                :coordinates="result.coordinates"
              />
            </div>
          </div>
          <div>
            <label for="formFile" class="form-label mt-4">Select Image</label>
            <input
              class="form-control"
              type="file"
              id="formFile"
              accept="image/*"
              @change="imagePreview"
            />
          </div>
          <div class="col mt-4" lg="5">
            <input
              type="checkbox"
              id="checkboxEditPassword"
              style="margin-right: 4px"
              v-model="checked"
              @change="handleCheckboxChange"
            />
            <label for="checkboxEditPassword">Confirm</label>
          </div>
          <div class="col hstack gap-2 justify-content-end" lg="7">
            <div>
              <BButton
                style="margin-right: 1em"
                type="button"
                variant="light"
                @click="showModal = false"
              >
                Close
              </BButton>
              <BButton v-if="checked" type="submit" variant="primary"
                >Update</BButton
              >
              <BButton v-else type="submit" variant="primary" class="disabled"
                >Update</BButton
              >
            </div>
          </div>
        </div>
      </form>
    </BModal>
  </div>
</template>
<style>
.image-wrapper {
  margin-top: 3%;
  width: 100%;
  height: 67%;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.image-container {
  width: 400px;
  min-height: 120px;
  max-height: auto;
  float: none;
  margin: 3px;
  padding: 3px;
}
.image-item {
  max-width: 50%;
  height: auto;
}
</style>
