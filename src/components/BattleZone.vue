<template>
  <div class="battle-zone-wrapper">
    <div
      class="battle-zone"
      :class="{
        [side]: true,
      }"
    >
      <div
        class="card in-battle"
        v-for="(card, index) in battleZoneCards"
        :key="index"
        :class="{ tapped: card.tapped, 'is-group': !!card.groupId }"
        :draggable="!card.groupId"
        @dragstart="dragCard(card)"
        @dragend="dragCard(null)"
        @drop="dropCard($event, card)"
        @dragover.prevent="dragOver($event)"
        @dragleave="dragLeave($event)"
      >
        <img v-if="card.faceDown === true" src="@/assets/images/card-back.jpg" draggable="false" />
        <img v-else :src="card.imageUrl" draggable="false" />

        <div class="menu-list hidden" :class="{ reverse: side === 'upper' }">
          <!-- グループ化されている場合は、タップかアンタップしかできない -->
          <div v-if="card.tapped" @click="tapCard(card)">
            <span>アンタップ</span>
          </div>
          <div v-else @click="tapCard(card)">
            <span>タップ</span>
          </div>
          <template v-if="!card.groupId">
            <div @click="moveCard('battleCards', 'tefudaCards', card)">
              <span>手札へ</span>
            </div>
            <div @click="moveCard('battleCards', 'bochiCards', card)">
              <span>墓地へ</span>
            </div>
          </template>
          <div
            @click="openWorkSpace({
              zone: 'battleCards',
              cards: battleCards,
              player: player,
            })"
          >
            <span>開く</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import mixin from '@/helpers/mixin.js';

export default {
  props: ['player', 'battleCards', 'battleCardGroups', 'side'],
  data() {
    return {
      draggingCard: null,
    }
  },
  computed: {
    battleZoneCards() {
      // 表示するカードのIDのリスト
      const firstCardIds = this.battleCardGroups.map(g => g.cardIds[0])
      const visibleCards = this.battleCards.filter((c) => {
        return !c.groupId || firstCardIds.includes(c.id)
      })
      return visibleCards
    },
  },
  mixins: [mixin.zone],
  methods: {
    dragCard(card) {
      this.$store.commit('setDraggingCard', card)
    },
    dropCard(event, card) {
      event.target.style.opacity = 1;
      if (card.id === this.$store.state.draggingCard.id) return
      this.$emit('group-card', {
        from: 'battleCards',
        to: 'battleCardGroups',
        fromCard: this.$store.state.draggingCard,
        toCard: card,
        player: this.player,
      })
    },
    dragOver(event) {
      event.target.style.opacity = 0.5;
    },
    dragLeave(event) {
      event.target.style.opacity = 1;
    },

    tapCard(card) {
      card.tapped = !card.tapped;
      // this.$forceUpdate();
      this.$emit('move-cards', 'battleCards', 'battleCards', this.battleCards, this.player);
    },

  }
}
</script>

<style lang="scss">
@import "@/assets/scss/mixin.scss";
@function cardHeight($value) {
  @return calc($value * 908 / 650);
}
$card-width: 50px;
.battle-zone-wrapper {
  img {
    width: 120px;
  }
  .battle-zone {
    display: flex;
    overflow-x: scroll;
    max-width: 700px; // 800 - margin-left
    > * {
      flex-shrink: 0;
    }
    &.upper {
      margin-left: 100px;
      margin-top: 10px;
      // box-shadowが見えるようにするため。
      padding-top: 10px;
      .card {
        transform: rotate(180deg);
        &.tapped {
          // 回転中心が左下の時ちょうど、回転後の位置がx軸方向について中心になる。
          // あとはtranslateXでy座標を調整する。
          transform: rotate(90deg) translateX(-100%);
          transform-origin: left bottom;
          width: cardHeight(120px);
        }
      }
    }
    &.lower {
      margin-left: 100px;
      margin-top: 40px;
      // box-shadowが見えるようにするため。
      padding-bottom: 10px;
      .card.tapped {
        transform: rotate(-90deg);
        transform-origin: center;
        width: cardHeight(120px);
      }
    }
  }
  .card.in-battle {
    position: relative;
    display: flex;
    margin-right: 10px;
    &.is-group img {
      border: lightgray 1px solid;
      border-top-width: 0;
      border-left-width: 0;
      box-shadow: 2px 3px black;
      border-radius: 3px;
    }
  }
  .card:hover {
    .menu-list {
      @include menu-list-hover;
      position: absolute;
      left: 0px;
      top: 20px;
      div {
        height: 18px;
        line-height: 18px;
        font-size: 13px;
      }
    }
  }
}
</style>
