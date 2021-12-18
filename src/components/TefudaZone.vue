<template>
  <div class="tefuda-zone-wrapper" :class="side">
    <div class="tefuda-zone" :class="side">
      <div class="card" v-for="(card, index) in tefudaCards" :key="index">
        <!-- 対戦相手の手札は常に裏向き -->
        <div v-if="side === 'upper'">
          <img src="@/assets/images/card-back.jpg" />
        </div>
        <!-- カードをクリックすると手札のメニューを開く -->
        <div
          v-else
          @click="openWorkSpace({
            zone: 'tefudaCards',
            cards: tefudaCards,
            player: player
          })"
        >
          <img v-if="card.faceDown" src="@/assets/images/card-back.jpg" />
          <img v-else :src="card.imageUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/helpers/mixin.js'

export default {
  props: ['player', 'tefudaCards', 'side'],
  mixins: [mixin.zone],
}
</script>

<style lang="scss">
.tefuda-zone-wrapper {
  &.upper {
    .card {
      transform: rotate(180deg);
    }
  }
  img {
    width: 70px;
  }
  .tefuda-zone {
    height: 100%;
    display: flex;
    overflow-x: scroll;
    max-width: 300px;
    .card {
      position: relative;
      margin-right: 5px;
    }
  }
}
</style>
