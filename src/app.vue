<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    window.app = this
  },
}
</script>
