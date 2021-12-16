<template>
  <div :class="{ hidden: !workSpace.active }">
    <div class="close-button-work-space" @click="closeWorkSpace">x</div>

    <div id="work-space" class>
      <div>
        <p>player:{{ workSpace.player }}</p>
        <p>from:{{ workSpace.zone }}</p>
      </div>
      <div class="card with-info" v-for="(card, index) in workSpace.cards" :key="index">
        <span class="cost card-info">10</span>
        <span class="power card-info">12000</span>
        <span class="card-id card-info" v-if="card.groupId">{{ card.groupId }}</span>
        <!-- <span v-else class="card-id card-info">{{ card.id }}</span> -->
        <img src="@/assets/images/card-back.jpg" v-if="card.faceDown === true" />
        <img :src="card.imageUrl" v-else />
        <div class="menu-list hidden">
          <div>
            <span>|</span>
            <span class="click" v-on:click="moveCard(card, 'battleCards')">f</span>
            <span>|</span>
            <span class="click" v-on:click="moveCard(card, 'shieldCards')">s</span>
            <span>|</span>
            <span class="click" v-on:click="moveCard(card, 'manaCards')">m</span>
            <span>|</span>
            <span class="click" v-on:click="moveCard(card, 'tefudaCards')">t</span>
          </div>
          <div>
            <span>|</span>
            <span class="click" v-on:click="moveCard(card, 'bochiCards')">b</span>
            <span>|</span>
            <span class="click" v-on:click="moveCard(card, 'yamafudaCards', true)">yt</span>
            <span>|</span>
            <span class="click" v-on:click="moveCard(card, 'yamafudaCards')">yb</span>
          </div>
          <div>
            <span class="click" v-on:click="openCard(card)">open</span>
          </div>
        </div>
      </div>
      <button v-if="workSpace.zone === 'yamafudaCards'" @click="openAllCards">全て表にする</button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    workSpace() {
      return this.$store.state.workSpace
    },
    player() {
      return this.$store.state.workSpace.player;
    },
  },
  methods: {
    ...mapMutations(['closeWorkSpace', 'openWorkSpace']),
    openCard(card) {
      card.faceDown = !card.faceDown;
      this.$forceUpdate();
    },
    openAllCards() {
      this.workSpace.cards.forEach(c => {
        c.faceDown = false
      })
    },
    moveCard(card, to, prepend = false) {
      // ワークスペースから移動したカードを消す。
      this.openWorkSpace({
        ...this.workSpace,
        cards: this.workSpace.cards.filter(c => c.id !== card.id),
      })
      const from = this.workSpace.zone;
      // バトルゾーン以外からシールドへ移動するときは裏向きにする。
      if (to === 'shieldCards' && from !== 'battleCards') {
        card.faceDown = true
      }
      this.$emit('move-cards', from, to, [card], this.workSpace.player, prepend);
    },
  }
}
</script>

<style lang="scss">
#work-space {
  .card:hover {
    .menu-list {
      position: absolute;
      left: 0px;
      top: 20px;
      display: unset;
      background-color: black;
      div {
        border: lightgray 1px solid;
        color: whitesmoke;
      }
      div span.click:hover {
        color: orange;
        cursor: pointer;
      }
    }
  }
}
</style>
