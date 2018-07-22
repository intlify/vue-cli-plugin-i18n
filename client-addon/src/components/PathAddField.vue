<template>
  <div class="path">
    <VueFormField
      v-if="shown"
      class="path-field"
    >
      <VueInput
        v-model="path"
        @keydown.enter="onClickAdd"
        @keyup.esc="onClickCancel"
        @compositionstart="composing = true"
        @compositionend="composing = false"
        @input="onInputPath"
        ref="path"
        :status="status"
        :icon-right="icon"
        :placeholder="$t('org.kazupon.vue-i18n.path-add-field.placeholder')"
      />
      <span slot="subtitle" v-if="message">{{ message }}</span>
    </VueFormField>
    <div class="actions">
      <VueButton
        v-if="shown"
        @click="onClickCancel"
        class="primary icon-button"
        icon-left="close"
      />
      <VueButton
        v-if="shown"
        @click="onClickAdd"
        class="primary icon-button"
        :disabled="disable"
        icon-left="save"
      />
      <VueButton
        v-if="!shown"
        @click="onClickAdding"
        class="primary"
        :label="$t('org.kazupon.vue-i18n.path-add-field.button')"
        icon-left="add"
      />
    </div>

    <VueModal
      v-if="modal"
      :title="$t('org.kazupon.vue-i18n.path-add-field.modal.title')"
      class="medium"
      @close="onCloseModal"
    >
      <div class="default-body">
        <p>{{ $t('org.kazupon.vue-i18n.path-add-field.modal.body') }}</p>
      </div>
      <div slot="footer" class="actions">
        <VueButton
          class="primary big"
          @click="onAddModal"
        >
          {{ $t('org.kazupon.vue-i18n.path-add-field.modal.button') }}
        </VueButton>
      </div>
    </VueModal>
  </div>
</template>

<script>
import { hasChildPaths } from '../utils'

export default {
  props: {
    path: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    shown: false,
    composing: false,
    message: '',
    icon: '',
    status: '',
    modal: false
  }),

  sharedData () {
    return mapSharedData('org.kazupon.vue-i18n.', {
      current: 'current',
      localePaths: 'localePaths'
    })
  },

  computed: {
    currentPaths () {
      if (!this.current) { return [] }
      return this.localePaths[this.current]
    },

    hasError () {
      return this.icon === 'error' && this.status === 'danger'
    },

    hasWarning () {
      return this.icon === 'warning' && this.status === 'warning'
    },

    disable () {
      return !this.path || this.hasError
    }
  },

  methods: {
    focus () {
      this.$nextTick(() => {
        this.$refs.path.focus()
      })
    },

    onCloseModal () {
      this.modal = false
      this.focus()
    },

    onAddModal () {
      this.modal = false
      this.addPath()
    },

    onClickAdding () {
      this.path = '' // reset
      this.message = ''
      this.icon = ''
      this.status = ''
      this.shown = true
      this.focus()
    },

    onClickCancel () {
      this.shown = false
    },

    onInputPath () {
      if (~this.currentPaths.indexOf(this.path)) {
        this.message = this.$t('org.kazupon.vue-i18n.path-add-field.modal.messages.already')
        this.icon = 'error'
        this.status = 'danger'
      } else if (hasChildPaths(this.path, this.currentPaths)) {
        this.message = this.$t('org.kazupon.vue-i18n.path-add-field.modal.messages.breaking')
        this.icon = 'warning'
        this.status = 'warning'
      } else {
        this.message = ''
        this.icon = ''
        this.status = ''
      }
    },

    addPath () {
      this.$callPluginAction('add-path-action', {
        path: this.path,
        locale: this.current
      }).then(data => {
        this.shown = false
      }).catch(error => {
        this.icon = 'error'
        this.status = 'danger'
        this.message = error.message
        this.focus()
      })
    },

    onClickAdd () {
      if (this.hasWarning) {
        this.modal = true
      } else if (!this.hasError) {
        this.addPath()
      }
    },

    onKeydownEnter () {
      if (this.composing) { return }
      this.onClickAdd()
    }
  }
}
</script>

<style scoped>
.path {
  padding: 12px;
  display: flex;
}

.path .path-field {
  flex: 1;
}

.path .actions {
  padding-top: 6px;
  width: 124px;
}

.path .actions button {
  margin-left: 2px;
}
</style>
