<template>
  <div class="shield-zone" :class="side">
    <div
      v-for="(card, index) in countableShieldCards" :key="index"
      class="shield"
      @dragover.prevent="dragOver($event)"
      @dragleave="dragLeave($event)"
      @drop="dropCard($event, card, 'shieldCards')"
      @click="clickShield(card)"
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
  mixins: [mixin.zone],
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
    dragOver: function (event) {
      event.target.style.opacity = 0.5;
    },
    dragLeave: function (event) {
      event.target.style.opacity = 1;
    },
    dropCard: function (event, card) {
      event.target.style.opacity = 1;
      if (card.id === this.$store.state.draggingCard.id) return
      this.moveCard('battleCards', 'shieldCards', this.$store.state.draggingCard)
      this.$emit('group-card', {
        from: 'shieldCards',
        to: 'shieldCardGroups',
        fromCard: this.$store.state.draggingCard,
        toCard: card,
        player: this.player,
      })
    },
    clickShield(card) {
      if (card.groupId) {
        this.openWorkSpace({
          zone: 'shieldCards',
          cards: this.group(card).cards,
          player: this.player
        })
        return
      }
      this.openWorkSpace({
        zone: 'shieldCards',
        cards: [card],
        player: this.player
      })
    },
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
  }
  .shield-num {
    color: whitesmoke;
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
