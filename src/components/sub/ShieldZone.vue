<template>
  <div class="shield-zone">
    <div
      class="shield"
      v-for="(card, index) in shieldCards"
      :key="index"
      @dragover="dragOver"
      @dragleave="dragLeave"
      @drop="dropCard(card, 'shieldCards')"
    >
      <div class="shield-wrapper">
        <div class="menu-list hidden" :class="{ reverse: side === 'upper' }">
          <div v-if="lastCard(card.childCards)" @click="openWorkSpace([card], 'shieldCards', true)">
            <span class="small">開く(うら)</span>
          </div>
          <div v-else @click="moveCard('shieldCards', 'tefudaCards', card)">
            <span class="small">ブレイク</span>
          </div>
        </div>
        <span class="shield-id">{{ card.shieldId }}</span>
        <img v-if="lastCard(card.childCards)" :src="lastCard(card.childCards).imageUrl" />
        <img src="@/assets/images/shield.jpg" v-else />
      </div>
    </div>
  </div>
</template>

<script>
// このcomponentは、今のところ、playerを知っている必要がない
export default {
  props: ['player', 'shieldCards', 'side'],
  methods: {
    lastCard: function (cards) {
      const length = cards.length;
      if (length && 0 < length) {
        return cards[length - 1];
      }
      return null;
    },
    dragOver: function () {
      event.preventDefault();
      event.target.style.opacity = 0.5;
    },
    dragLeave: function () {
      event.target.style.opacity = 1;
    },
    dropCard: function (card, droppedIn) {
      event.target.style.opacity = 1;
      this.$emit('drop-card', card, droppedIn);
    },
    moveCard: function (from, to, card) {
      this.$emit('move-card', from, to, card);
    },
    openWorkSpace: function (cards, from, faceDown = false) {
      this.$emit('open-work-space', cards, from, faceDown);
    },
  }
}
</script>
