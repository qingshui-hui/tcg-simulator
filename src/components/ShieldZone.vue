<template>
  <div class="shield-zone">
    <div
      class="shield"
      v-for="(card, index) in countableShieldCards"
      :key="index"
      @dragover.prevent="dragOver($event)"
      @dragleave="dragLeave($event)"
      @drop="dropCard($event, card, 'shieldCards')"
    >
      <div class="shield-wrapper">
        <div class="menu-list hidden" :class="{ reverse: side === 'upper' }">
          <div
            v-if="card.groupId"
            @click="openWorkSpace({
              zone: 'shieldCards',
              cards: group(card).cards,
              player: player
            })"
          >
            <span class="small">開く</span>
          </div>
          <div v-else @click="moveCard('shieldCards', 'tefudaCards', card)">
            <span class="small">ブレイク</span>
          </div>
        </div>
        <span class="shield-id">{{ card.shieldId }}</span>
        <!-- 裏向きのカードの場合表示されない。 -->
        <img v-if="!card.faceDown" :src="card.imageUrl" />
        <img src="@/assets/images/shield.jpg" v-else />
        <div v-if="card.groupId" class="shield-num">{{ group(card).cardIds.length }}</div>
      </div>
    </div>
  </div>
</template>

<script>

import mixin from "../helpers/mixin";
// このcomponentは、今のところ、playerを知っている必要がない
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
  }
}
</script>
