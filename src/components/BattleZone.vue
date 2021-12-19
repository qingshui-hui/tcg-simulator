<template>
  <div class="battle-zone-wrapper">
    <o-icon
      class="openZoneButton battleZoneButton"
      :class="side"
      pack="fas"
      size="large"
      icon="arrow-circle-up"
      variant="primary"
      @click="openWorkSpace({
        zone: 'battleCards',
        cards: battleCards,
        player: player,
      })"
    ></o-icon>
    <div class="battle-zone" :class="{
      [side]: true,
    }">
      <div
        class="card in-battle"
        v-for="(card, index) in battleZoneCards"
        :key="index"
        :class="{ tapped: card.tapped,
          'is-group': !!card.groupId,
          'is-selectMode': selectMode && workSpace.player === player,
        }"
        :draggable="!card.groupId"
        @dragstart="dragCard(card)"
        @dragend="dragCard(null)"
        @drop="dropCard($event, card)"
        @dragover.prevent="dragOver($event)"
        @touchstart="dragOver($event)"
        @touchend="dragLeave($event)"
        @contextmenu="dragLeave($event)"
        @dragleave="dragLeave($event)"
        @click="clickCard($event, card)"
      >
        <img v-if="card.faceDown === true" src="@/assets/images/card-back.jpg" draggable="false" />
        <img v-else :src="card.imageUrl" draggable="false" />
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/helpers/mixin.js';

export default {
  props: ['player', 'battleCards', 'battleCardGroups', 'side'],
  mixins: [mixin.zone, mixin.droppable],
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
  methods: {
    // リレーション
    group(card) {
      if (!card.groupId) {
        return null
      }
      const group = {
        ...this.battleCardGroups.find(g => g.id === card.groupId)
      }
      group.cards = this.battleCards.filter(c => c.groupId === group.id)
      return group
    },
    dragCard(card) {
      this.setDraggingCard(card)
    },
    dropCard(event, card) {
      event.target.style.opacity = 1;
      if (card.id === this.draggingCard.id) return
      this.$emit('group-card', {
        from: 'battleCards',
        to: 'battleCardGroups',
        fromCard: this.draggingCard,
        toCard: card,
        player: this.player,
      })
    },
    tapCard(card) {
      card.tapped = !card.tapped;
      // this.$forceUpdate();
      this.$emit('move-cards', 'battleCards', 'battleCards', this.battleCards, this.player);
    },
    clickCard(event, card) {
      if (!this.selectMode) {
        this.openWorkSpace({
          zone: 'battleCards',
          cards: card.groupId ? this.group(card).cards : [card],
          player: this.player,
          single: true,
        })
        return
      }
      if (this.workSpace.player === this.player) {
        // Drag&Dropと同じ扱いをする。
        this.setDraggingCard(this.workSpace.cards[0])
        this.dropCard(event, card)
        this.closeWorkSpace()
        return
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/mixin.scss";
@function cardHeight($value) {
  @return calc($value * 908 / 650);
}
$card-width: 100px;
.battle-zone-wrapper {
  display: flex;
  img {
    width: $card-width;
  }
  .battleZoneButton {
    transform: rotate(45deg);
    align-self: flex-end;
    margin-left: 20px;
    cursor: pointer;
    &.upper {
      margin-top: 20px;
      align-self: flex-start;
    }
    &.lower {
      margin-bottom: 10px;
    }
  }
  .battle-zone {
    // スクロールをしないUIに変更
    display: flex;
    flex-wrap: wrap;
    margin-left: 30px;
    min-height: cardHeight($card-width);
    // overflow-x: scroll;
    // height: cardHeight($card-width);
    max-width: 700px; // 800 - margin-left
    > * {
      flex-shrink: 0;
      margin: 0 10px 10px 0;
    }
    &.upper {
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
          width: cardHeight($card-width);
        }
      }
    }
    &.lower {
      margin-top: 40px;
      // box-shadowが見えるようにするため。
      padding-bottom: 10px;
      .card.tapped {
        transform: rotate(-90deg) translateX(100%);
        transform-origin: right bottom;
        width: cardHeight($card-width);
      }
    }
  }
  .card.in-battle {
    position: relative;
    display: flex;
    &.is-group img {
      border: lightgray 1px solid;
      border-top-width: 0;
      border-left-width: 0;
      box-shadow: 2px 3px black;
      border-radius: 3px;
    }
    &.is-selectMode {
      img {
        border: 3px solid orange;
        border-radius: 5px;
      }
    }
  }
}
</style>
