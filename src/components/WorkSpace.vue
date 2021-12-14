<template>
  <div :class="{ hidden: workSpace.hidden }">
    <div class="close-button-work-space" v-on:click="closeWorkSpace">x</div>

    <div id="work-space" class>
      <div>
        <p>player:{{ workSpace.player }}</p>
        <p>from:{{ workSpace.selectedZone }}</p>
      </div>
      <div class="card with-info" v-for="(card, index) in workSpace.cards" :key="index">
        <span class="cost card-info">10</span>
        <span class="power card-info">12000</span>
        <span class="card-id card-info" v-if="card.parentId">{{ card.parentId + '&lt;&lt;' + card.id }}</span>
        <span class="card-id card-info">{{ card.id }}</span>
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
    </div>
  </div>
</template>

<script>
export default {
  props: ['workSpace', 'side'],
  computed: {
    player() {
      return this.workSpace.player;
    },
  },
  methods: {
    openCard(card) {
      card.faceDown = !card.faceDown;
      this.$forceUpdate();
    },
    moveCard(card, to, prepend = false) {
      let from = this.workSpace.selectedZone;
      // childCardsはworkSpaceからしか移動できない使用
      if (this.handleParentCard(card)) {
        from = 'childCards';
      }
      // workSpaceに限っては、自身のデータを変更したいだけなので、$parentを使用
      this.$parent.workSpace.cards = this.workSpace.cards.filter((c) => {
        return c.id !== card.id;
      })

      const cards = [card];
      this.$emit('move-cards', from, to, cards, this.workSpace.player, prepend);
    },
    closeWorkSpace: function () {
      this.$emit('close-work-space');
    },
    handleParentCard: function (card) {
      // parentId は card の drop 時にのみ、つけられる
      const from = this.workSpace.selectedZone;
      if (card.parentId) {
        let parentCard;
        for (let c of this.workSpace.cards) {
          if (c.id === card.parentId) {
            parentCard = c;
            break;
          }
        }
        if (parentCard) {
          parentCard.childCards = parentCard.childCards.filter((c) => {
            return c.id !== card.id;
          });
          // これは、相手にも見える操作のため、move-cardsであるべき
          this.$emit('move-cards', from, from, this.$parent[this.player]['cards'][from], this.player);
        }
        card.parentId = null;
        return true;
      }
      return false;
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
