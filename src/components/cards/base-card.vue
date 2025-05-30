<script>
export default {
  name: 'BaseCard',
  props: {
    title: {
      type: [String],
      default: ''
    },
    wrapperClass: {
      type: String,
      default: 'col-lg-12'
    },
    cardClass: {
      type: String,
      default: 'card'
    },
    bodyClass: {
      type: String,
      default: 'card-body'
    },
    headerClass: {
      type: String,
      default: 'card-header d-flex align-items-center'
    },
    footerClass: {
      type: String
    },
    titleClass: {
      type: String,
      default: 'mb-0 text-muted text-uppercase'
    },
    tableCard: {
      type: Boolean,
      default: false
    },
    noFooter: {
      type: Boolean,
      default: false
    },
    noHeader: {
      type: Boolean,
      default: false
    },
    noBody: {
      type: Boolean,
      default: false
    },
    noWrapper: {
      type: Boolean,
      default: false
    },
    defaultTitle: {
      type: Boolean,
      default: false
    },
    titleSize: {
      type: String,
      default: 'h5'
    }
  }
}
</script>
<template>
  <div :class="noWrapper ? '' : wrapperClass">
    <div :class="cardClass">
      <slot name="progressBar"></slot>
      <div :class="headerClass" v-if="!noHeader">
        <slot name="cardHeader"></slot>
        <component
          :is="titleSize"
          v-if="title"
          :class="defaultTitle ? 'card-title mb-0' : titleClass"
          class="flex-grow-1"
        >
          <slot name="titleIcon"></slot>{{ title }}
        </component>
        <div class="flex-shrink-0">
          <slot name="cardButton"></slot>
        </div>
      </div>
      <slot name="customHeader"></slot>
      <div :class="tableCard ? 'card-body table-responsive' : bodyClass" v-if="!noBody">
        <slot name="cardBody"></slot>
      </div>
      <slot name="customFooter"></slot>
      <div class="card-footer" v-if="!noFooter" :class="footerClass">
        <div class="row">
          <div class="col hstack gap-2">
            <slot name="cardFooterStart"></slot>
          </div>
          <div class="col hstack gap-2">
            <slot name="cardFooterEnd"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
