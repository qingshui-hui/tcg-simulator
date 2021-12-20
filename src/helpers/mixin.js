import { mapMutations, mapState } from "vuex/dist/vuex.cjs";

const mixin = {}
mixin.zone = {
  computed: {
    // mapStateヘルパー
    // https://vuex.vuejs.org/ja/guide/state.html#mapstate-%E3%83%98%E3%83%AB%E3%83%8F%E3%82%9A%E3%83%BC
    ...mapState(['workSpace', 'selectMode', 'draggingCard'])
  },
  methods: {
    moveCard(from, to, card, prepend = false) {
      this.$emit('move-cards', from, to, [card], this.player, prepend);
    },
    moveSelectedCard(to, prepend = false) {
      if (!this.selectMode) return
      // 本人確認
      if (this.selectMode.player !== this.player) return
      this.$emit('move-cards', this.selectMode.zone, to, [this.selectMode.card], this.player, prepend)
      this.setSelectMode(null)
    },
    shuffleCards(from, cards) {
      this.$emit('shuffle-cards', from, cards, this.player)
    },
    emitState() {
      this.$emit('emit-room-state', this.player)
    },
    // openWorkSpace: function (cards, from, faceDown = null) {
    //   this.$emit('open-work-space', cards, from, this.player, faceDown);
    // },
    ...mapMutations(['openWorkSpace', 'closeWorkSpace', 'setSelectMode', 'setDraggingCard']),
  }
}
mixin.droppable = {
  methods: {
    dropCard(event, card) {
      event.target.style.opacity = 1;
      if (card.id === this.$store.state.draggingCard.id) return
      // 上書きが必要。
    },
    dragOver(event) {
      event.target.style.opacity = 0.5;
    },
    dragLeave(event) {
      event.target.style.opacity = 1;
    },
  }
}

export default mixin
