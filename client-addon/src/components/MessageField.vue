<template>
  <div
    class="message"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="fixed" v-if="!editing">{{ message }}</div>
    <VueInput
      class="fixing"
      v-if="editing"
      v-model="value"
      @keydown.enter="onKeydownEnter"
      @keyup.esc="onClickCancel"
      @compositionstart="composing = true"
      @compositionend="composing = false"
      ref="message"
      :status="error ? 'danger' : ''"
      :icon-right="error ? 'error': ''"
      :placeholder="$t('org.kazupon.vue-i18n.message-field.placeholder')"
    />
    <div class="actions">
      <VueButton
        class="primary round icon-button"
        v-if="editing"
        @click="onClickCancel"
        icon-left="close"
      />
      <VueButton
        class="primary round icon-button"
        v-if="editing"
        @click="onClickSave"
        :disabled="disable"
        icon-left="save"
      />
      <VueButton
        class="primary round icon-button"
        v-if="isShowEdit"
        @click="onClickEdit"
        icon-left="edit"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
      default: ''
    }
  },

  data () {
    return {
      editing: false,
      shown: false,
      value: this.message,
      composing: false,
      error: ''
    }
  },

  sharedData () {
    return mapSharedData('org.kazupon.vue-i18n.', {
      current: 'current'
    })
  },

  computed: {
    disable () {
      return this.error.length > 0
    },

    isShowEdit () {
      return !this.editing && this.shown
    }
  },

  methods: {
    onMouseEnter () {
      if (this.editing) { return }
      this.shown = true
    },

    onMouseLeave () {
      if (this.editing) { return }
      this.shown = false
    },

    onClickEdit () {
      this.value = this.message
      this.editing = true
      this.error = ''
      this.$nextTick(() => {
        this.$refs.message.focus()
      })
    },

    onClickCancel () {
      this.editing = false
    },

    onClickSave () {
      this.$callPluginAction('edit-message-action', {
        path: this.path,
        value: this.value,
        locale: this.current
      }).then(data => {
        this.message = this.value
        this.editing = false
      }).catch(error => {
        this.error = error.message
      })
    },

    onKeydownEnter () {
      if (this.composing) { return }
      this.onClickSave()
    }
  }
}
</script>

<style scoped>
.message {
  height: 24px;
  padding: 12px 20px;
  background: #f8fbfb;
  border-bottom-color: #bbe6d6;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.message:hover {
  background: #dbebec;
}

.message p {
  margin-bottom: 0;
}

.message .fixed,
.message .fixing {
  flex: 100% 0 1;
}

.message .actions {
  display: flex;
}

.vue-ui-button.primary {
  margin-right: 6px;
}

.vue-ui-dark-mode .message {
  background: #1d2935;
  border-bottom-color: #344a5f;
}

.vue-ui-dark-mode .message:hover {
  background: rgba(66, 185, 131, .1);
}
</style>
