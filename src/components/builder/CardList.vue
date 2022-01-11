<template>
  <div>
    <draggable
      v-model="deckCards"
      class="card-list"
      :id="side + 'draggable'"
      item-key="id"
      :group="{ name: 'deck', pull: 'clone', put: true }"
      :data-side="side"
      :move="onMove"
      :sort="false"
      :clone="
        (origin) => {
          return { ...origin, time: 0 };
        }
      "
      @start="onDragstart"
      @end="setDraggingCard(null)"
    >
      <template #item="{ element }">
        <div class="card-wrapper">
          <div class="card">
            <!-- insted of prevent default -->
            <div draggable="true">
              <img :src="element.imageUrl" draggable="false" />
            </div>

            <div class="cardTool">
              <div class="cardTool_times">
                <span style="margin-right: 2px">x</span>
                <span>{{ element.time }}</span>
              </div>

              <div class="cardTool_buttonGroup">
                <div class="cardTool_plus" @click.stop="addCardNum(element)">
                  <!-- <o-icon pack="fas" icon="plus"> </o-icon> -->
                  <o-button variant="danger" icon-right="plus" size="small" />
                </div>
                <div class="cardTool_minus" @click.stop="decrementCardNum(element)">
                  <o-button variant="info" icon-right="minus" size="small" />
                </div>
              </div>
            </div>

            <div class="delele-button hidden" @click.stop="deleteCard(element)">X</div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import hasBuilderState from "./mixins/hasBuilderState.vue";

export default {
  props: ["cards", "checkUniquness", "side"],
  components: {
    draggable,
  },
  mixins: [hasBuilderState],
  computed: {
    deckCards: {
      get() {
        return this.cards;
      },
      set(newVal) {
        // すでに含まれているカードがあれば更新しない。
        if (
          this.cards.find(
            (c) => c.imageUrl === this.$store.state.builder.draggingCard.imageUrl
          )
        ) {
          console.log("すでに含まれているカードです。");
          return;
        }
        this.$emit("update:cards", newVal);
      },
    },
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
      const targetZone = event.to.getAttribute("data-side");
      if (targetZone !== event.from.getAttribute("data-side")) {
        for (let c of this.$parent[targetZone]["deckData"]["cards"]) {
          if (c.imageUrl === event.draggedContext.element.imageUrl) {
            return false;
          }
        }
      }
      return true;
    },
    addCardNum(card) {
      if (card.time <= 3) {
        card.time += 1;
      }
    },
    decrementCardNum(card) {
      if (card.time === 0) {
        if (window.confirm("削除してもよろしいですか?")) {
          // this.$emit('delete-card', card, this.side);
          this.deleteCard(card);
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
      this.$parent[this.side]["deckData"]["cards"] = filterd;
    },
    onMove(evt) {
      // https://github.com/SortableJS/vue.draggable.next#move
      // evt.draggedContext.element.time = 0;
      this.setDraggingCard(evt.draggedContext.element);
    },
    onDragstart(evt) {
      this.setDraggingCard(evt.item.__draggable_context);
    },
  },
};
</script>

<style lang="scss">
.card-list {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  > * {
    width: 100px;
    margin: 0 10px 15px 0px;
  }
}

.card-wrapper {
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
  .cardTool {
    /* background-color: red; */
    display: flex;
    align-items: center;
    height: 30px;
    width: 100%;
    &_times {
      margin-left: 5px;
      margin-right: auto;
      font-weight: 500;
    }
    &_buttonGroup {
      display: flex;
      > :first-child > * {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      > :last-child > * {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>
