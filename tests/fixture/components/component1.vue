<template>
  <p>{{ $t('messages.foo') }}</p>
</template>

<script>
export default {
  name: 'component1',
  created () {
    console.log(this.$t('messages.buz'))
  }
}
</script>
