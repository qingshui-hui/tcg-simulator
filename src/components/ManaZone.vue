<template>
  <div class="mana-zone-wrapper">
    <div class="mana-zone" :class="side">
      <div class="mana-counter" :class="side">
        <div class="menu-list hidden">
          <div class="uptap-button" @click="untapAll">
            <span>アンタップ</span>
          </div>
          <div class="not-visible" @click="openWorkSpace(manaCards, 'manaCards')">
            <span>開く</span>
          </div>
        </div>

        <span class="mana-info">{{ countNormal }}/{{ manaCards.length }}</span>
      </div>
      <div class="green-wrapper" :class="{ 'reverse': side === 'upper' }">
        <div class="tapped">
          <div
            class="mana-card card"
            v-for="(card, index) in tappedCards"
            :key="index"
            :style="{ top: (index) * 50 + 'px' }"
          >
            <!-- <span class="mana-num card-info">1</span> -->

            <div class="menu-list hidden" :class="{ reverse: side === 'lower' }">
              <div v-on:click="tapCard(card, false)">
                <span>アンタップ</span>
              </div>
              <div v-on:click="moveCard('manaCards', 'tefudaCards', card)">
                <span>手札へ</span>
              </div>
            </div>
            <img v-if="!card.faceDown" :src="card.imageUrl" />
            <img v-else src="@/assets/images/card-back.jpg" />
          </div>
        </div>
        <div class="normal">
          <div
            class="mana-card card"
            v-for="(card, index) in normalCards"
            :key="index"
            :style="{ right: (index) * 30 + 'px' }"
            :class="{ 'selected': card.selected }"
          >
            <!-- <span class="mana card-info">1</span> -->

            <div class="menu-list hidden" :class="{ reverse: side === 'lower' }">
              <div v-on:click="tapCard(card)">
                <span>タップ</span>
              </div>
              <div v-on:click="moveCard('manaCards', 'tefudaCards', card)">
                <span>手札へ</span>
              </div>
            </div>
            <img v-if="!card.faceDown" :src="card.imageUrl" />
            <img v-else src="@/assets/images/card-back.jpg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import mixin from '@/helpers/mixin.js';

export default {
  props: ['player', 'manaCards', 'side'],
  mixins: [mixin.zone],
  data() {
    return {
      selectedNormal: [],
      selectedTapped: [],
    };
  },
  computed: {
    normalCards() {
      return this.manaCards.filter((card) => {
        return card.tapped !== true;
      })
    },
    tappedCards() {
      return this.manaCards.filter((card) => {
        return card.tapped === true;
      })
    },
    countNormal() {
      return this.normalCards.length;
    },
  },
  methods: {
    tapCard: function (card, tap = true) {
      card.tapped = tap;
      this.moveCard('manaCards', 'manaCards', card);
    },
    untapAll: function () {
      for (let card of this.manaCards) {
        card.tapped = false;
      }
      this.moveCard('manaCards', 'manaCards', this.manaCards[this.countAll - 1]);
    },
    selectNormal: function (index) {
      const card = this.normalCards[index];
      if (card.selected) {
        card.selected = false;
        const removeIndex = this.selectedNormal.findIndex((item) => item.id === card.id);
        this.selectedNormal.splice(removeIndex, 1);
      } else {
        // selected undefined or
        card.selected = true;
        card.index = index;
        this.selectedNormal.push(card);
      }
      this.$forceUpdate()
    },
    tapNormal: function () {
      const selected = this.selectedNormal.map((card) => {
        card.tapped = true;
      });
      this.selectedNormal = [];
      this.$emit('move-cards', 'manaCards', 'manaCards', selected, this.player);
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/scss/mixin.scss";
.mana-zone-wrapper {
  .green-wrapper {
    background-color: lightgreen;
    width: 330px;
    height: 75px;
    position: absolute;
    display: flex;
  }

  .mana-zone img {
    width: 50px;
  }
  .uptap-button {
    // background-color: green;
    // position: absolute;
    // top: -10px;
    // left: -15px;
    // height: 15px;
    // width: fit-content;
    // line-height: 15px;
    // font-size: 12px;
    // border: 1px solid white;
    // cursor: pointer;
    // &:hover {
    //     color: orange;
    //     border: 1px solid orange;
    // }
  }
  .mana-counter {
    .menu-list {
      @include menu-list-hover;
      position: absolute;
      left: -5px;
      top: -5px;
      background-color: green;
      .not-visible {
        display: none;
      }
    }
    &:hover {
      .menu-list {
        @include menu-list-hover;
        position: absolute;
        left: -5px;
        top: -5px;
        background-color: green;
        .not-visible {
          display: block;
        }
      }
      .mana-info {
        display: none;
      }
    }
    background-color: green;
    height: 50px;
    width: 70px;
    position: absolute;
    color: beige;
    line-height: 50px;
    text-align: center;
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
    .card.selected {
      top: -5px;
    }
  }
  .mana-zone .normal .card {
    transform: rotate(180deg);
    position: absolute;
  }
  .card .card-info {
    position: absolute;
    font-size: 12px;
    font-weight: bold;
  }
  .card {
    position: relative;
  }
  .card:hover {
    .menu-list {
      @include menu-list-hover;
      position: absolute;
      top: 0px;
      background-color: black;
      div {
        min-width: unset;
        font-size: 12px;
      }
    }
  }
  .card .mana {
    background-color: beige;
    color: green;
    transform: rotate(180deg);
    bottom: 2px;
    left: 8px;
  }
}
</style>
