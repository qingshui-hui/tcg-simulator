export default {
  methods: {
    groupCard({ from, to, fromCard, toCard, player }) {
      // vuexにコミット
      this.$store.commit("groupCard", {
        from, fromCard,
        to, toCard,
        player,
      });
      // 状態の変更を送信する
      if (!this.useConfig().WS_ENABLED) return;
      this.$socket.emit("cards-moved", this.players[player]);
    },
    moveCard: function (from, to, card, player, prepend = false) {
      // GRゾーン, 超次元ゾーンを考えると、一枚ずつの方が、処理しやすい
      this.moveCards(from, to, [card], player, prepend);
    },
    moveCards: function (from, to, selectedCards, player, prepend = false) {
      // vuexにコミット
      this.$store.commit("moveCards", {
        from,
        to,
        cards: selectedCards,
        player,
        prepend,
      });
      // 少し待てば、レンダリングが完了しているため、うまくいった。
      if (to === "tefudaCards") {
        setTimeout(() => {
          this.scrollZone(
            ".tefuda-zone." + (player === this.upperPlayer ? "upper" : "lower"),
            "left"
          );
        }, 300);
      }
      if (!this.useConfig().WS_ENABLED) return;
      this.players[player].isReady = true;
      this.$socket.emit("cards-moved", this.players[player]);
    },
  },
  mounted() {
    addEventListener('keydown', (event) => {
      if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
        this.$store.commit("popGameHistories")
      }
    });
  },
}
