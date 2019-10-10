<template>
  <div
    class="path"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="fixed" v-if="!editing">{{ path }}</div>
    <VueInput
      class="fixing"
      v-if="editing"
      v-model="value"
      @keydown.enter="onKeydownEnter"
      @keyup.esc="onClickCancel"
      @compositionstart="composing = true"
      @compositionend="composing = false"
      @input="onInputPath"
      ref="path"
      :status="status"
      :icon-right="icon"
      :placeholder="$t('org.kazupon.vue-i18n.path-field.placeholder')"
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
      <VueButton
        class="danger round icon-button"
        v-if="isShowEdit"
        @click="onClickDelete"
        icon-left="delete"
      />
    </div>

    <VueModal
      v-if="modal"
      :title="$t('org.kazupon.vue-i18n.path-field.modal.title')"
      class="medium"
      @close="onCloseModal"
    >
      <div class="default-body">
        <p>{{ $t('org.kazupon.vue-i18n.path-field.modal.body') }}</p>
      </div>
      <div slot="footer" class="actions">
        <VueButton
          class="primary big"
          @click="onUpdateModal"
        >
          {{ $t('org.kazupon.vue-i18n.path-field.modal.button') }}
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
      required: true
    }
  },

  data () {
    return {
      editing: false,
      shown: false,
      value: this.path,
      composing: false,
      icon: '',
      status: '',
      modal: false
    }
  },

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

    isShowEdit () {
      return !this.editing && this.shown
    },

    hasError () {
      return this.icon === 'error' && this.status === 'danger'
    },

    hasWarning () {
      return this.icon === 'warning' && this.status === 'warning'
    },

    disable () {
      return !this.value || this.hasError
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

    onUpdateModal () {
      this.modal = false
      this.updatePath()
    },

    onMouseEnter () {
      if (this.editing) { return }
      this.shown = true
    },

    onMouseLeave () {
      if (this.editing) { return }
      this.shown = false
    },

    onInputPath () {
      if (this.value !== this.path && ~this.currentPaths.indexOf(this.value)) {
        this.icon = 'error'
        this.status = 'danger'
      } else if (hasChildPaths(this.value, this.currentPaths)) {
        this.icon = 'warning'
        this.status = 'warning'
      } else {
        this.icon = ''
        this.status = ''
      }
    },

    onClickEdit () {
      this.value = this.path
      this.editing = true
      this.icon = ''
      this.status = ''
      this.focus()
    },

    onClickDelete () {
      this.$callPluginAction('delete-path-action', {
        path: this.value,
        locale: this.current
      }).catch(error => {
        console.error(`failed delete path: ${error.message}`)
        this.icon = 'error'
        this.status = 'danger'
      })
    },

    onClickCancel () {
      this.editing = false
    },

    updatePath () {
      this.$callPluginAction('update-path-action', {
        path: this.value,
        old: this.path,
        locale: this.current
      }).then(data => {
        this.path = this.value
        this.editing = false
      }).catch(error => {
        console.error(`failed update path: ${error.message}`)
        this.icon = 'error'
        this.status = 'danger'
        this.focus()
      })
    },

    onClickSave () {
      if (this.hasWarning) {
        this.modal = true
      } else {
        this.updatePath()
      }
    },

    onKeydownEnter () {
      if (this.composing) { return }
      this.onClickSave()
    }
  }
}
</script>

<style scoped>
.path {
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

.path:hover {
  background: #dbebec;
}

.path .fixed,
.path .fixing {
  flex: 100% 0 1;
}

.path .actions {
  display: flex;
}

.vue-ui-button.primary {
  margin-right: 6px;
}

.vue-ui-dark-mode .path {
  background: #1d2935;
  border-bottom-color: #344a5f;
}

.vue-ui-dark-mode .path:hover {
  background: rgba(66, 185, 131, .1);
}
</style>
