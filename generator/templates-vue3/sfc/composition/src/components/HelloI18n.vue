<template>
  <p>{{ t('hello') }}</p>
</template>

<%_ if (lang === 'ts') { _%>
<script lang="ts">
<%_ } else { _%>
<script>
<%_ } _%>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'HelloI18n',
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'local'
    })

    // Something todo ..

    return { t }
  }
})
</script>

<i18n>
{
  "en": {
    "hello": "Hello i18n in SFC!"
  }
}
</i18n>
