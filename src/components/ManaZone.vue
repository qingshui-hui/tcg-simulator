<template>
  <div class="mana-zone-wrapper">
    <div class="mana-zone manaZone" :class="side">
      <div
        v-if="selectMode && selectMode.player === player"
        class="mana-counter manaButton"
        :class="[side, { 'is-selectMode': !!selectMode }]"
        @click="moveSelectedCard(zone)"
      >
        <div class="manaButton_text">マナ</div>
        <div class="mana-info manaButton_count">チャージ</div>
      </div>
      <div
        v-else
        class="mana-counter manaButton"
        :class="side"
        @click="
          openWorkSpace({
            zone: 'manaCards',
            cards: manaCards,
            player: player,
          })
        "
      >
        <div class="manaButton_text">マナ</div>
        <div class="mana-info manaButton_count">
          {{ countNormal }}/{{ manaCards.length }}
        </div>
      </div>
      <div class="green-wrapper" :class="{ reverse: side === 'upper' }">
        <div class="tapped">
          <div
            class="mana-card card"
            v-for="(card, index) in tappedCards"
            :key="index"
            :style="{ top: index * 50 + 'px' }"
          >
            <img v-if="!card.faceDown" :src="card.imageUrl" />
            <img v-else src="@/assets/images/card-back.jpg" />
          </div>
        </div>
        <div class="normal">
          <div
            class="mana-card card"
            v-for="(card, index) in normalCards"
            :key="index"
            :style="{ right: index * 30 + 'px' }"
          >
            <img v-if="!card.faceDown" :src="card.imageUrl" />
            <img v-else src="@/assets/images/card-back.jpg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/helpers/mixin.js";

export default {
  props: ["player", "manaCards", "side"],
  mixins: [mixin.zone],
  data() {
    return {
      zone: "manaCards",
    };
  },
  computed: {
    normalCards() {
      return this.manaCards.filter((card) => {
        return card.tapped !== true;
      });
    },
    tappedCards() {
      return this.manaCards.filter((card) => {
        return card.tapped === true;
      });
    },
    countNormal() {
      return this.normalCards.length;
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/mixin.scss";
@function cardHeight($value) {
  @return calc($value * 908 / 650);
}
$card-width: 50px;

.manaZone {
  display: flex;
  margin-left: 20px;
  align-items: center;
  &.upper {
    padding-top: 20px;
  }
  &.lower {
    margin-top: 20px;
  }
}

.mana-zone-wrapper {
  .green-wrapper {
    margin-left: 10px;
    // background-color: lightgreen;
    width: 330px;
    height: cardHeight($card-width);
    position: relative;
    // position: absolute;
    display: flex;
  }

  .mana-zone img {
    width: $card-width;
  }

  .manaButton {
    cursor: pointer;
    background-color: green;
    border-radius: 50%;
    height: 50px;
    width: 70px;
    color: beige;
    text-align: center;
    &.is-selectMode {
      border: 3px solid orange;
    }
    &_count {
    }
    &_text {
      padding: 5px 0;
      line-height: 10px;
      font-size: 10px;
    }
  }

  .mana-zone .tapped {
    width: 110px;
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    overflow: scroll;
  }
  .mana-zone .tapped .card {
    margin-left: 30px;
    position: absolute;
    transform: rotate(-90deg);
  }
  .mana-zone .normal {
    margin-left: 10px;
    height: 100%;
    width: 210px;
    position: relative;
    display: flex;
    /* 右へスクロールが可能 */
    flex-direction: row-reverse;
    overflow: scroll;
  }
  .mana-zone .normal .card {
    transform: rotate(180deg);
    position: absolute;
  }
  .card {
    position: relative;
  }
}
</style>
