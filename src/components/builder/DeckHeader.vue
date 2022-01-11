<template>
  <div class="deck-header">
    <div class="deck-select">
      <select
        name="deckId"
        id="select-deck"
        @change="changeDeck"
        v-model="selected.index"
      >
        <option
          v-for="(deck, index) in deckList[selected.deckType]"
          :value="index"
          :key="index"
        >
          {{ deck.name }}
        </option>
      </select>
    </div>
    <div class="small">
      <span>合計枚数{{ totalNum }} カードの種類{{ cardNum }}</span>
      <span
        class="save-button click"
        @click.stop="updateDeck()"
        v-if="selected.deckType === 'custom'"
        >変更を保存</span
      >
      <span
        class="click"
        @click.stop="openModal(deckList['custom'][selected.index].name, 'update')"
        v-if="selected.deckType === 'custom'"
        >名前を変更</span
      >
      <span
        class="click"
        @click.stop="openModal('', 'create')"
        v-if="selected.deckType === 'custom'"
        >新規作成</span
      >
    </div>

    <Modal
      class="deck-header-modal"
      v-if="modal.update"
      @close-modal="modal.update = false"
    >
      <template v-slot:content>
        <div>
          <p>デッキの名前を入力してください</p>
        </div>
        <div>
          <input v-model="params.name" />
        </div>
      </template>
      <template v-slot:footer>
        <button @click.stop="updateDeckName">変更</button>
      </template>
    </Modal>

    <Modal
      class="deck-header-modal"
      v-if="modal.create"
      @close-modal="modal.create = false"
    >
      <template v-slot:content>
        <div>
          <p>デッキの名前を入力してください</p>
        </div>
        <div>
          <input v-model="params.name" />
        </div>
      </template>
      <template v-slot:footer>
        <button @click.stop="createDeck">送信</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "./Modal.vue";
export default {
  props: ["deckData", "deckList", "side", "deckIndex"],
  components: {
    Modal,
  },
  data() {
    return {
      selected: {
        deckType: "custom",
        index: this.deckIndex,
      },
      params: {
        name: "",
      },
      modal: {
        create: false,
        update: false,
      },
    };
  },
  computed: {
    totalNum() {
      let result = 0;
      for (let card of this.deckData.cards) {
        result += card.time;
      }
      return result;
    },
    cardNum() {
      return this.deckData.cards.length;
    },
  },
  created() {
    // console.log(this.deckList)
  },
  methods: {
    openModal(name, method) {
      this.params.name = name;
      this.modal[method] = true;
    },
    changeDeck() {
      this.$emit("change-deck", this.selected.deckType, this.selected.index, this.side);
      // this.$parent[this.side].deckData = this.$parent.deckList[index];
    },
    updateDeck() {
      this.$emit("update-deck", this.params, this.side);
    },
    updateDeckName() {
      // this.$parent.deckList[this.selected.deckType][
      //   this.selected.index
      // ].name = this.params.name;
      this.updateDeck();
      this.modal.update = false;
      this.params.name = "";
    },
    createDeck() {
      this.modal.create = false;
      this.$emit("create-deck", this.params, this.side, this.selected);
      this.params.name = "";
    },
  },
};
</script>

<style lang="scss">
.deck-header {
  .small {
    font-size: 12px;
  }
  .click {
    margin-left: 10px;
    cursor: pointer;
    &:hover {
      color: orange;
    }
  }

  .deck-header-modal {
    input {
      width: 100%;
    }
  }
}
</style>
