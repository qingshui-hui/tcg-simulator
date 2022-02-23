import { mapMutations, mapState } from "vuex/dist/vuex.cjs";

const mixin = {}
mixin.zone = {
  // props: ['player'],
  computed: {
    // mapStateヘルパー
    // https://vuex.vuejs.org/ja/guide/state.html#mapstate-%E3%83%98%E3%83%AB%E3%83%8F%E3%82%9A%E3%83%BC
    ...mapState(['workSpace', 'selectMode', 'selectedCard', 'hoveredCard']),
    ...mapState({
      gameHistories: state => state.room.gameHistories,
    }),
    roomId() {
      return this.$route.query.roomId;
    },
  },
  methods: {
    moveCard(from, to, card, prepend = false) {
      this.$emit('move-cards', from, to, [card], this.player.id, prepend);
    },
    toggleTap(card) {
      card.tapped = !card.tapped;
      if (this.selectMode.zone === 'manaCards') {
        // マナゾーンの場合タップ後に位置が変わるため、配列にプッシュして移動先の最後に表示されるようにする。
        this.$emit('move-cards', 'manaCards', 'manaCards', [card], this.selectMode.playerId, false);
      }
      this.setSelectMode(null);
    },
    hasSelectedCard() {
      // セレクトモードと本人であることを確認
      return this.selectMode && this.selectMode.playerId === this.player.id
    },
    // 重ねる先のカードを選ぶ状態
    selectTargetMode() {
      return this.hasSelectedCard()
        && !this.selectMode.card.groupId
        && this.selectMode.selectingTarget
    },
    cardIsSelected(card) {
      if (!card) return false
      if (this.hasSelectedCard() && this.selectMode.card.id === card.id) {
        return true;
      }
      return false;
    },
    moveSelectedCard(to, prepend = false) {
      if (!this.selectMode) return
      // 本人確認
      if (this.selectMode.playerId !== this.player.id) return
      this.$emit('move-cards', this.selectMode.zone, to, [this.selectMode.card], this.player.id, prepend)
      this.setSelectMode(null)
    },
    shuffleCards(from, cards) {
      this.$emit('shuffle-cards', from, cards, this.player.id)
    },
    changeCardsStateInZone(cards, cardState) { // shortcut
      this.changeCardsState({
        from: this.zone,
        player: this.player.id,
        cards,
        cardState,
      })
      this.setSelectMode(null);
      this.$socket.emit("room-history-changed", {
        command: 'pushGameHistories',
        history: this.gameHistories[this.gameHistories.length - 1],
        roomId: this.roomId,
      });
    },
    ...mapMutations(['openWorkSpace', 'closeWorkSpace', 'setSelectMode', 'setSelectedCard', 'setHoveredCard', 'changeCardsState']),
  }
}

export default mixin
