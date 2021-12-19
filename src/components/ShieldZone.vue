<template>
  <div class="shield-zone" :class="side">
    <div
      v-for="(card, index) in countableShieldCards" :key="index"
      class="shield"
      :class="{'is-selectMode': selectMode && workSpace.player === player}"
      @dragover.prevent="dragOver($event)"
      @dragleave="dragLeave($event)"
      @touchstart="dragOver($event)"
      @touchend="dragLeave($event)"
      @contextmenu="dragLeave($event)"
      @drop="dropCard($event, card, 'shieldCards')"
      @click="clickShield($event, card)"
    >
      <div class="shield-wrapper">
        <span class="shield-id">{{ card.shieldId }}</span>
        <!-- 裏向きのカードの場合表示されない。 -->
        <img v-if="!card.faceDown" :src="card.imageUrl" />
        <span class="shield-reverse" v-else />
        <div
          v-if="card.groupId && group(card).cardIds.length > 1"
          class="shield-num"
        >{{ group(card).cardIds.length }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// Dropdownを使うと、スクロールゾーンの中にメニューが表示されて何も見えない問題があった。
import mixin from "../helpers/mixin";

export default {
  props: ['player', 'shieldCards', 'shieldCardGroups', 'side'],
  mixins: [mixin.zone, mixin.droppable],
  computed: {
    countableShieldCards() {
      // グループ化されているカードは一つとカウントする。
      const firstCardIds = this.shieldCardGroups.map(g => g.cardIds[0])
      return this.shieldCards.filter((c) => {
        return !c.groupId || firstCardIds.includes(c.id)
      })
    },
  },
  methods: {
    // リレーション
    group(card) {
      if (!card.groupId) {
        return null
      }
      const group = {
        ...this.shieldCardGroups.find(g => g.id === card.groupId)
      }
      group.cards = this.shieldCards.filter(c => c.groupId === group.id)
      return group
    },
    dropCard(event, card) {
      event.target.style.opacity = 1;
      if (card.id === this.draggingCard.id) return
      this.moveCard('battleCards', 'shieldCards', this.draggingCard)
      this.$emit('group-card', {
        from: 'shieldCards',
        to: 'shieldCardGroups',
        fromCard: this.draggingCard,
        toCard: card,
        player: this.player,
      })
    },
    clickShield(event, card) {
      if (!this.selectMode) {
        this.openWorkSpace({
          zone: 'shieldCards',
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
@function cardHeight($value) {
  @return calc($value * 908 / 650);
}
.shield-zone {
  width: 275px;
  height: cardHeight(50px);
  display: flex;
  flex-direction: row-reverse;
  position: relative;
  overflow-x: scroll;
  > * {
    margin-right: 5px;
  }
  &.upper {
    .shield-wrapper {
      transform: rotate(180deg);
    }
  }
  .shield {
    position: relative;
    &.is-selectMode {
      border: 3px solid orange;
      border-radius: 5px;
    }
  }
  .shield-num {
    color: rgb(37, 37, 37);
    position: absolute;
    bottom: 3px;
    right: 5px;
    font-size: 10px;
  }
  .shield-reverse {
    display: block;
    width: 50px;
    height: cardHeight(50px);
    background-color: rgb(79, 205, 255);
  }
}
</style>
