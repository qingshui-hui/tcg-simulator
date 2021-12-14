<template>
  <div id="canvas" @mousemove="traceMouseMove">
    <div
      id="display"
      :class="{ hidden: display.hidden, blur: display.blur }"
      :style="[display.left ? { left: '5px' } : { right: '5px' }]"
    >
      <div v-if="display.imageUrl" class="card-image">
        <img :src="display.imageUrl" />
      </div>
    </div>
    <!-- slot -->
    <slot></slot>
  </div>
  <div class="tool-footer">
    <div>
      <label>
        <input type="checkbox" checked @change="switchDisplay" />ホバーで画像拡大
      </label>
      <label>
        <input type="checkbox" checked @change="switchDisplayBlur" />画像透過
      </label>
      <label>
        <input type="checkbox" checked @change="explanation.show = !explanation.show" />説明表示
      </label>
    </div>
    <div id="explanation" v-if="explanation.show">
      <p>f:バトルゾーン s:シールド m:マナ t:手札 開く:ゾーンを開く</p>
      <p>b:墓地 yt:山札上 yb:山札下 a:手札</p>
      <p>*バトルゾーンにあるカードはドラッグ可能、他のクリーチャーの下か、シールドの上にドロップ</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      display: {
        left: true,
        hidden: false,
        blur: true,
        imageUrl: "",
      },
      explanation: {
        show: true,
      },
    }
  },
  methods: {
    traceMouseMove(event) {
      const config = this.useConfig()
      if (this.display.hidden) {
        return;
      }
      const imageSrc = event.target.src;
      if (!imageSrc) {
        this.display.imageUrl = "";
        return;
      }
      // 表向きのカードだけ拡大表示する。
      if (imageSrc.includes(config.IMAGE_HOST)) {
        this.display.imageUrl = imageSrc;
      } else {
        this.display.imageUrl = "";
      }
      let mX = event.pageX;
      // let mY = event.pageY;
      if (mX < 400) {
        this.display.left = false;
      } else {
        this.display.left = true;
      }
    },
    switchDisplay() {
      this.display.hidden = !this.display.hidden
    }, switchDisplayBlur() {
      this.display.blur = !this.display.blur
    },
  },
}
</script>
