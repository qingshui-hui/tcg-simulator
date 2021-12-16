<template>
  <div class="battle-zone-wrapper">
    <div
      class="battle-zone"
      :class="{
        reverse: side === 'upper',
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
        <span class="cost card-info">10</span>
        <span class="power card-info">12000</span>
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
      if (card.id === this.$store.state.draggingCard.id) return
      this.$emit('group-card', {
        from: 'battleCards',
        to: 'battleCardGroups',
        fromCard: this.$store.state.draggingCard,
        toCard: card,
        player: this.player,
      })
      event.target.style.opacity = 1;
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
.battle-zone-wrapper {
  img {
    width: 70px;
  }
  .battle-zone {
    // box-shadowが見えるようにするため。
    padding-bottom: 10px;
    display: flex;
    overflow-x: scroll;
    max-width: 600px;
  }
  .battle-zone .card {
    margin-right: 10px;
  }
  .battle-zone .tapped {
    /* 見た目だけが変わるみたい */
    transform: scale(0.8, 0.8) rotate(-90deg);
  }

  .card.in-battle {
    position: relative;
    display: flex;
    &.is-group {
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
  .card .card-info {
    background-color: black;
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    color: beige;
  }
  .card .cost {
    top: 2px;
    left: 2px;
  }
  .card .power {
    bottom: 2px;
    left: 2px;
  }
}
</style>
