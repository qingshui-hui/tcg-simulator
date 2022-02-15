<template>
  <div>
    <router-view />
    <o-notification
      v-if="deviseWidth < 900"
      class="alertBottom"
      closable
      variant="warning"
      aria-close-label="Close notification"
    >
      このサイトはPC(スクリーンの幅が900px以上)向けです。
    </o-notification>
  </div>
</template>

<script>
export default {
  computed: {
    deviseWidth() {
      return window.screen.width;
    },
  },
  mounted() {
    window.app = this;
  },
};
</script>

<style lang="scss" scoped>
.alertBottom {
  width: 100%;
  position: fixed;
  bottom: 0;
  margin-bottom: 0;
}
</style>
