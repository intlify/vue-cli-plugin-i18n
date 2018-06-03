<template>
  <p>{{ $t('hello') }}</p>
</template>

<%_ if (lang === 'ts') { _%>
<script lang="ts">
<%_ if (!classComponent) { _%>
import Vue from 'vue'

export default Vue.extend({
  name: 'HelloI18n'
})
<%_ } else { _%>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class HelloI18n extends Vue {
}
<%_ } _%>
</script>
<%_ } else { _%>
<script>
export default {
  name: 'HelloI18n'
}
</script>
<%_ } _%>

<i18n>
{
  "en": {
    "hello": "Hello i18n in SFC!"
  }
}
</i18n>
