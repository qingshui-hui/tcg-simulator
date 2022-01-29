<template>
  <div id="canvas" @mousemove="traceMouseMove">
    <div
      class="imageDisplay"
      :class="{ hidden: display.hidden, blur: display.blur }"
      :style="[
        display.left ? { left: '5px' } : { right: '5px' },
        { width: `${style.width}px` },
      ]"
    >
      <div v-if="display.imageUrl" class="imageDisplay_image">
        <!-- ディスプレイが邪魔をして操作ができない時のために、クリックで閉じる -->
        <img :src="display.imageUrl" @click.stop="display.imageUrl = ''" />
      </div>
    </div>
    <!-- slot -->
    <slot></slot>
  </div>
  <div class="tool-footer">
    <div>
      <label>
        <!-- v-modelだと値の更新が行われなかった。 -->
        <input
          type="checkbox"
          :checked="!display.hidden"
          @change="display.hidden = !$event.target.checked"
        />ホバーで画像拡大
      </label>
      <label>
        <input
          type="checkbox"
          :checked="display.blur"
          @change="display.blur = $event.target.checked"
        />画像透過
      </label>
      <!-- <label>
        <input
          type="checkbox"
          :checked="explanation.show"
          @change="explanation.show = $event.target.checked"
        />説明表示
      </label> -->
    </div>
    <div id="explanation" v-if="explanation.show">
      <p></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      display: {
        left: true,
        hidden: true,
        blur: false,
        imageUrl: "",
      },
      explanation: {
        show: true,
      },
      style: {
        width: 300,
      },
    };
  },
  methods: {
    traceMouseMove(event) {
      if (this.display.hidden) {
        return;
      }
      const imageSrc = event.target.src;
      if (!imageSrc) {
        this.display.imageUrl = "";
        return;
      }
      // ホストが異なる画像だけ拡大することで、カード画像だけが拡大できるようにする。
      if (!imageSrc.includes("card-back")) {
        this.display.imageUrl = imageSrc;
      } else {
        this.display.imageUrl = "";
      }
      let mX = event.pageX;
      // let mY = event.pageY;
      console.log(window.innerWidth - 350);
      // 右の余白が足りない時だけ左側に表示する。
      if (mX < window.innerWidth - this.style.width + 20) {
        this.display.left = false;
      } else {
        this.display.left = true;
      }
    },
  },
  mounted() {
    if (window.innerWidth > 800) {
      this.display.hidden = false;
    }
  },
};
</script>

<style lang="scss" scoped>
/* display */
.imageDisplay {
  // background-image: url('http://localhost:3333/dmbd07-a-010.jpg');
  // width: 300px;
  position: fixed;
  top: 10px;
  // left: 10px;
  z-index: 12; // ワークスペースより大きくする
  &.blur {
    opacity: 0.6;
  }
  &_image {
    width: 100%;
    img {
      width: 100%;
    }
  }
}
</style>
