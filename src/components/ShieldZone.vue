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
          <div
            v-if="lastCard(card.childCards)"
            @click="openWorkSpace([card], 'shieldCards', true)"
          >
            <span class="small">開く(うら)</span>
          </div>
          <div v-else @click="moveCard('shieldCards', 'tefudaCards', card)">
            <span class="small">ブレイク</span>
          </div>
        </div>
        <span class="shield-id">{{ card.shieldId }}</span>
        <!-- 裏向きのカードの場合表示されない。 -->
        <img v-if="lastCard(card.childCards) && !lastCard(card.childCards).faceDown"
          :src="lastCard(card.childCards).imageUrl"
        />
        <img src="@/assets/images/shield.jpg" v-else />
        <div v-if="lastCard(card.childCards)" class="shield-num" >{{ card.childCards.length + 1 }}</div>
      </div>
    </div>
  </div>
</template>

<script>

import mixin from "../helpers/mixin";
// このcomponentは、今のところ、playerを知っている必要がない
export default {
  props: ['player', 'shieldCards', 'side'],
  mixins: [mixin.zone],
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
      this.$emit('drop-card', droppedIn, card, this.player);
      // event.target.style.opacity = 1;
      // this.$emit('drop-card', card, droppedIn);
    },
  }
}
</script>
