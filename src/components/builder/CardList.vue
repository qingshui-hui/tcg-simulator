<template>
  <div>
    <draggable
      class="card-list"
      :id="side + 'draggable'"
      :list="cards"
      @start="dragCardStart"
      @end="drag = false"
      :group="{ name: 'deck', pull: 'clone', put: true }"
      :clone="cloneNew"
      :move="checkMove"
      :data-side="side"
    >
      <template #item>
        <div class="card-wrapper" v-for="(card, index) in cards" :key="index">
          <div class="card">
            <!-- insted of prevent default -->
            <div draggable="true">
              <img :src="card.imageUrl" draggable="false" />
            </div>

            <div class="card-tool">
              <div class="num-card">
                <span>{{ 'x ' + card.time }}</span>
              </div>

              <div class="buttons">
                <div class="click" @click="addCardNum(card)">
                  <span>▲</span>
                </div>
                <div class="click" @click="decrementCardNum(card)">
                  <span>▼</span>
                </div>
              </div>
            </div>

            <div class="delele-button hidden" @click="deleteCard(card)">X</div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  props: ['cards', 'checkUniquness', 'side'],
  components: {
    draggable,
  },
  methods: {
    dragCardStart(event) {
      const card = this.cards[event.oldIndex];
      this.$parent.dragging = {
        card: card,
        side: this.side,
      };
    },
    cloneNew(original) {
      let after = Object.assign({}, original);
      after.time = 0;
      return after;
    },
    checkMove(event) {
      // 要検討
      // 他のデッキリストに移動したいかチェックしたい
      const targetZone = event.to.getAttribute('data-side');
      if (targetZone !== event.from.getAttribute('data-side')) {
        for (let c of this.$parent[targetZone]['deckData']['cards']) {
          if (c.imageUrl === event.draggedContext.element.imageUrl) {
            return false;
          }
        }
      }
      return true;
      // console.log(event.draggedContext.element);
    },
    addCardNum(card) {
      if (card.time <= 3) {
        card.time += 1;
      }
    },
    decrementCardNum(card) {
      if (card.time === 0) {
        if (window.confirm('削除してもよろしいですか?')) {
          // this.$emit('delete-card', card, this.side);
          this.deleteCard(card)
        }
      }
      if (card.time > 0) {
        card.time -= 1;
      }
    },
    deleteCard(card) {
      let filterd = [];
      for (let c of this.cards) {
        if (c.imageUrl !== card.imageUrl) {
          filterd.push(c);
        }
      }
      this.$parent[this.side]['deckData']['cards'] = filterd;
    }
  }
}
</script>

<style lang="scss">
.card-list {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  justify-content: space-around;
  /* ヘッダーとパディングの分だけ引く */
  height: calc(100vh - 121px);
  overflow: scroll;
}

.card-wrapper {
  width: 100px;
  margin: 0 10px 15px 0px;
  position: relative;

  &:hover {
    .delele-button {
      display: block;
    }
  }
  .delele-button {
    position: absolute;
    top: -5px;
    left: -5px;
    background-color: white;
    font-size: 18px;
    padding: 3px;
    font-weight: 800;
    cursor: pointer;
    &:hover {
      color: red;
    }
  }

  img {
    width: 100%;
  }
  .card-tool {
    /* background-color: red; */
    display: flex;
    justify-content: flex-end;
    height: 30px;
    width: 100%;
    .num-card {
      line-height: 30px;
      margin-right: 10px;
      font-weight: 500;
    }
    .buttons {
      margin-right: 5px;
    }
    .click {
      font-size: 15px;
      cursor: pointer;
      &:hover {
        color: orange;
      }
    }
  }
}
</style>
