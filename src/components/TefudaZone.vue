<template>
  <div class="tefuda-zone-wrapper" :class="side">
    <div class="tefuda-zone" :class="side">
      <div
        class="card"
        :class="[{ 'is-selected': selectMode && selectMode.card.id === card.id }]"
        v-for="(card, index) in tefudaCards"
        :key="index"
      >
        <!-- 対戦相手の手札は常に裏向き -->
        <div v-if="side === 'upper'">
          <img src="@/assets/images/card-back.jpg" @click="clickCard(card)" />
        </div>
        <div v-else @click="clickCard(card)">
          <img v-if="card.faceDown" src="@/assets/images/card-back.jpg" />
          <img v-else :src="card.imageUrl" />
        </div>
      </div>

      <template v-if="side == 'lower'">
        <o-icon
          v-if="!selectMode"
          class="openZoneButton"
          :class="side"
          pack="fas"
          size="large"
          icon="arrow-circle-up"
          variant="info"
          @click="
            openWorkSpace({
              zone,
              cards,
              player,
            })
          "
        ></o-icon>
        <o-button
          v-else
          class="tefudaZoneButton"
          variant="info"
          size="medium"
          rounded
          @click="moveSelectedCard(zone, true)"
        >
          手札へ
        </o-button>
      </template>
    </div>
  </div>
</template>

<script>
import mixin from "@/helpers/mixin.js";

export default {
  props: ["player", "tefudaCards", "side"],
  mixins: [mixin.zone],
  data() {
    return {
      zone: "tefudaCards",
      cards: this.tefudaCards,
    };
  },
  methods: {
    clickCard(card) {
      // すでに選択済みのカードであれば、選択解除
      if (this.selectMode && this.selectMode.card.id === card.id) {
        this.setSelectMode(null);
        this.setDraggingCard(null);
        return;
      }
      // 選択する
      this.setSelectMode({
        player: this.player,
        card,
        zone: this.zone,
      });
      this.setDraggingCard(card);
    },
  },
};
</script>

<style lang="scss">
.tefuda-zone-wrapper {
  .openZoneButton {
    transform: rotate(45deg);
    margin-left: 10px;
    cursor: pointer;
  }
  .tefudaZoneButton {
    align-self: center;
  }
  &.upper {
    margin-left: 100px;
    .card {
      transform: rotate(180deg);
    }
  }
  &.lower {
    margin-top: 20px;
    margin-left: 100px;
    .tefuda-zone {
      display: flex;
      flex-wrap: wrap;
      > * {
        margin-right: 5px;
        margin-top: 5px;
      }
    }
  }
  img {
    width: 70px;
  }
  .tefuda-zone {
    height: 100%;
    display: flex;
    overflow-x: scroll;
    max-width: 400px;
    .card {
      position: relative;
      margin-right: 5px;
      &.is-selected {
        img {
          border: 3px solid #b60000;
          border-radius: 5px;
        }
      }
    }
  }
}
// layout
.tefuda-zone-wrapper.upper {
  // position: absolute;
  // top: 5px;
  // right: 0px;
}
</style>
