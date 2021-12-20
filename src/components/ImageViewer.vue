<template>
  <div id="canvas" @mousemove="traceMouseMove">
    <div
      class="imageDisplay"
      :class="{ hidden: display.hidden, blur: display.blur }"
      :style="[display.left ? { left: '5px' } : { right: '5px' }]"
    >
      <div v-if="display.imageUrl" class="imageDisplay_image">
        <!-- ディスプレイが邪魔をして操作ができない時のために、クリックで閉じる -->
        <img :src="display.imageUrl" @click="display.imageUrl = ''" />
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
        blur: true,
        imageUrl: "",
      },
      explanation: {
        show: true,
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
      if (!imageSrc.includes(window.location.origin)) {
        this.display.imageUrl = imageSrc;
      } else {
        this.display.imageUrl = "";
      }
      let mX = event.pageX;
      // let mY = event.pageY;
      if (mX < 550) {
        this.display.left = false;
      } else {
        this.display.left = true;
      }
    },
  },
};
</script>
