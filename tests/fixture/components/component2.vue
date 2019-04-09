<template>
  <p>{{ $t('messages.bar') }}</p>
</template>

<script>
export default {
  name: 'component2',
  created () {
    console.log(this.$t('messages.hoge'))
    console.log(this.$t('messages.fuga.foo'))
  }
}
</script>

