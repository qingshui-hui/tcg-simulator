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
      this.$emit('move-cards', from, to, [card], this.player, prepend);
    },
    toggleTap(card) {
      if (this.selectMode.zone === 'manaCards') {
        // マナゾーンの場合タップ後に位置が変わるため、配列にプッシュして移動先の最後に表示されるようにする。
        this.$emit('move-cards', 'manaCards', 'manaCards', [card], this.selectMode.player, false);
      }
      card.tapped = !card.tapped;
      this.setSelectMode(null);
      // 状態を送信
      this.emitState();
    },
    hasSelectedCard() {
      // セレクトモードと本人であることを確認
      return this.selectMode && this.selectMode.player === this.player
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
    changeCardsStateInZone(cards, cardState) { // shortcut
      this.changeCardsState({
        from: this.zone,
        player: this.player,
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
