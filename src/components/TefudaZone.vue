<template>
  <div class="tefuda-zone-wrapper">
    <div class="tefuda-zone" :class="side">
      <div
        class="open-tefuda"
        v-if="side === 'lower'"
        @click="openWorkSpace({
          zone: 'tefudaCards',
          cards: tefudaCards,
          player: player
        })"
      >
        <span>開く</span>
      </div>

      <div
        class="scrollable-wrapper"
        :id="'tefuda-zone' + player"
        :class="{
          reverse: side === 'upper',
        }"
      >
        <div class="card in-battle" v-for="(card, index) in tefudaCards" :key="index">
          <span class="cost card-info">10</span>
          <span class="power card-info">12000</span>
          <!-- 対戦相手の手札は常に裏向き -->
          <img v-if="side === 'upper'" src="@/assets/images/card-back.jpg" />
          <img v-else-if="card.faceDown" src="@/assets/images/card-back.jpg" />
          <img v-else :src="card.imageUrl" />
          <div class="menu-list hidden" :class="{ reverse: side === 'upper' }">
            <div>
              <span @click="moveCard('tefudaCards', 'battleCards', card)">出す</span>
            </div>
            <div>
              <span @click="moveCard('tefudaCards', 'manaCards', card)">マナへ</span>
            </div>
            <div>
              <span @click="moveCard('tefudaCards', 'bochiCards', card)">墓地へ</span>
            </div>
          </div>
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
  img {
    width: 70px;
  }
  .tefuda-zone {
    height: 100%;
  }

  .open-tefuda {
    background-color: black;
    width: 40px;
    text-align: center;
    color: white;
    padding: 3px;
    position: absolute;
    top: -20px;
    cursor: pointer;
  }
  .open-tefuda:hover {
    color: orange;
  }
  .scrollable-wrapper {
    position: absolute;
    display: flex;
    overflow: scroll;
    max-width: 300px;
  }
  .tefuda-zone .card {
    margin-right: 5px;
  }
  .card:hover {
    .menu-list {
      position: absolute;
      left: 0px;
      top: 20px;
      display: unset;
      background-color: black;
      div {
        border: lightgray 1px solid;
        color: whitesmoke;
      }
      div span:hover {
        color: orange;
        cursor: pointer;
      }
    }
  }

  .card.in-battle {
    position: relative;
  }
  .card .card-info {
    background-color: black;
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    color: beige;
  }
  .card .cost {
    top: 2px;
    left: 2px;
  }
  .card .power {
    bottom: 2px;
    left: 2px;
  }
}
</style>
