<template>
  <p>{{ $t('hello') }}</p>
</template>

<%_ if (lang === 'ts') { _%>
<script lang="ts">
<%_ } else { _%>
<script>
<%_ } _%>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloI18n'
})
</script>

<i18n>
{
  "en": {
    "hello": "Hello i18n in SFC!"
  }
}
</i18n>
