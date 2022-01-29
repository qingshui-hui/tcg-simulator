<template>
  <div class="c-header">
    <o-icon
      class="c-header__bars"
      pack="fas"
      icon="bars"
      size="medium"
      style="color: white; margin-left: 30px"
      @click.stop="sidebarOpen = !sidebarOpen"
    ></o-icon>
  </div>
  <div
    class="sidebar"
    :class="{
      'sidebar--open': sidebarOpen,
    }"
  >
    <nav class="nav-links">
      <div class="nav-item">
        <router-link to="/">退出する</router-link>
      </div>
    </nav>
    <nav class="nav-links">
      <div class="nav-item">
        <a @click="openResetGameModal()">ゲームをリセットする</a>
      </div>
    </nav>
  </div>
  <!-- サイドバーのために使用する仮のモーダル -->
  <o-modal
    class="sidebarModal"
    v-model:active="sidebarOpen"
    contentClass="sidebarModal__content"
  >
  </o-modal>
  <o-modal v-model:active="resetGameModal" class="resetGameModal">
    <o-button variant="grey-dark" @click="resetGame()"
      >ゲームをリセットする</o-button
    >
  </o-modal>
</template>

<script>
export default {
  data() {
    return {
      sidebarOpen: false,
      resetGameModal: false,
    };
  },
  methods: {
    openResetGameModal() {
      this.sidebarOpen = false;
      this.resetGameModal = true;
    },
    resetGame() {
      this.resetGameModal = false;
      this.$emit('reset-game');
    },
  },
};
</script>

<style lang="scss" scoped>
.c-header {
  height: 60px;
  background-color: #005c98;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  align-items: center;
  &--fixed {
    position: fixed;
    top: 0;
    z-index: 11;
  }
  &__bars {
    cursor: pointer;
  }
}
.sidebar {
  &.sidebar--open {
    transform: translateX(0%);
  }
  top: 60px;
  left: 0;
  bottom: 0;
  padding-top: 20px;
  transform: translateX(-100%);
  transition: transform 0.2s ease;
  font-size: 16px;
  background-color: #fff;
  width: 20rem;
  position: fixed;
  z-index: 41;
  border-right: 1px solid #eaecef;
  overflow-y: auto;
}
.sidebarModal {
  :deep(.sidebarModal__content) {
    display: none;
  }
}
.nav-links {
  .nav-item {
    > * {
      cursor: pointer;
    }
    line-height: 1.25rem;
    font-size: 1.1rem;
    padding: 0.5rem 0 0.5rem 1.5rem;
  }
}
.resetGameModal {
  :deep(.o-modal__content) {
    width: fit-content;
  }
}
</style>
