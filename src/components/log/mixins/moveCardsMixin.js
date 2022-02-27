import { mapState } from "vuex";
import { ZONE_GROUP_MAP } from "@/entities/zones";
import { Util, ungroupCardResult } from "@/helpers/Util";
import { moveCardsRule } from "@/game/GameRules";

export default {
  computed: {
    ...mapState({
      gameHistories: (state) => state.room.gameHistories,
      cardData: (state) => state.room.cardData,
    }),
  },
  methods: {
    groupCard({ from, to, fromCard, toCard, player }) {
      // 正当な宛先かチェック
      if (!Object.keys(ZONE_GROUP_MAP).includes(to)) {
        throw new Error("target zone dose not have group");
      }
      // 移動元からカードを削除する。
      this.players[player]["cards"][from] = Util.arrayRemoveCards(
        this.players[player]["cards"][from],
        [fromCard]
      );
      // 移動先にカードを追加する。
      this.players[player]["cards"][to].push(fromCard);
      // 情報をカードに追加
      if (toCard.groupId) {
        // ターゲットのカードが既にグループ化されていた場合、
        // 既存のグループに追加する。
        const group = this.players[player]["cards"][ZONE_GROUP_MAP[to]].find(
          (g) => g.id === toCard.groupId
        );
        group.cardIds.unshift(fromCard.id);
        fromCard.groupId = toCard.groupId;
      } else {
        // 新しくグループを作成する。
        // TODO: 被らない文字列にする。
        const groupId = `${toCard.id}-${fromCard.id}`;
        this.players[player]["cards"][ZONE_GROUP_MAP[to]].push({
          id: groupId,
          cardIds: [fromCard.id, toCard.id],
        });
        fromCard.groupId = groupId;
        toCard.groupId = groupId;
      }
      // 並べ替え fromCardをtoCardの前に移す。
      this.players[player]["cards"][to] = Util.arrayInsertBefore(
        this.players[player]["cards"][to],
        toCard,
        fromCard
      );
    },
    moveCards({ from, to, cards, player, prepend = false }) {
      // 先頭のカードがグループに属していた場合、そのグループから抜ける。
      const card = cards[0];
      if (card.groupId) {
        // 正当な宛先かチェック
        if (!Object.keys(ZONE_GROUP_MAP).includes(from)) {
          throw new Error("target zone dose not have group");
        }
        const ungroupResult = ungroupCardResult({
          card,
          zoneCards: this.players[player]["cards"][from],
          zoneGroups: this.players[player]["cards"][ZONE_GROUP_MAP[from]],
        });
        this.players[player]["cards"][from] = ungroupResult.cards;
        this.players[player]["cards"][ZONE_GROUP_MAP[from]] =
          ungroupResult.groups;
      }
      // カードを移動する。
      cards = moveCardsRule({ cards, from, to });
      this.players[player]["cards"][from] = Util.arrayRemoveCards(
        this.players[player]["cards"][from],
        cards
      );
      if (prepend) {
        this.players[player]["cards"][to] = Util.arrayPrependCards(
          this.players[player]["cards"][to],
          cards
        );
      } else {
        this.players[player]["cards"][to] = Util.arrayAppendCards(
          this.players[player]["cards"][to],
          cards
        );
      }
    },
    changeCardsState({ from, cards, player, cardState }) {
      const cardIds = cards.map((c) => c.id);
      this.players[player]["cards"][from].forEach((c) => {
        if (!cardIds.includes(c.id)) return;
        Object.keys(cardState).forEach((key) => {
          if (["tapped", "faceDown", "markColor"].includes(key)) {
            c[key] = cardState[key];
          }
        });
      });
    },
    previousGameHistories(history) {
      const { player, from, to, oldState, command } = history;
      if (command === "moveCards") {
        this.players[player]["cards"][from] = oldState.fromCards;
        this.players[player]["cards"][to] = oldState.toCards;
        if (oldState.fromCardGropus) {
          this.players[player]["cards"][ZONE_GROUP_MAP[from]] =
            oldState.fromCardGropus;
        }
      }
      if (command === "groupCard") {
        this.players[player]["cards"][from] = oldState.fromCards;
        this.players[player]["cards"][to] = oldState.toCards;
        this.players[player]["cards"][ZONE_GROUP_MAP[to]] =
          oldState.toCardGroups;
      }
      if (command === "changeCardsState") {
        this.players[player]["cards"][from] = oldState.fromCards;
      }
    },
    nextGameHistory(history) {
      if (history.command === "moveCards") {
        const { from, to, cards, player, prepend } = history;
        console.log(`${cards[0].name}を${to}へ`);
        this.moveCards({ from, to, cards, player, prepend });
      }
      if (history.command === "groupCard") {
        const { from, to, fromCard, toCard, player } = history;
        this.groupCard({ from, to, fromCard, toCard, player });
      }
      if (history.command === "changeCardsState") {
        const { from, cards, player, cardState } = history;
        console.log(`${cards[0].name}を変更`);
        this.changeCardsState({ from, cards, player, cardState });
      }
    },
  },
  mounted() {
    addEventListener("keydown", (event) => {
      if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
        if (event.shiftKey) {
          console.log("redo");
        } else {
          console.log("undo");
        }
      }
      if (event.key === "n") {
        if (this.historyIndex >= this.gameHistories.length - 1) {
          return;
        }
        this.nextGameHistory(this.gameHistories[this.historyIndex + 1]);
        this.historyIndex = this.historyIndex + 1;
        console.log("next");
      }
      if (event.key === "p") {
        if (this.historyIndex == 0) {
          return;
        }
        this.previousGameHistories(this.gameHistories[this.historyIndex]);
        this.historyIndex = this.historyIndex - 1;
        console.log("previous");
      }
    });
    this.$socket.on("room-history-changed", ({ command, history }) => {
      if (command === "pushGameHistories") {
        this.$store.dispatch("pushGameHistories", { command, history });
      }
      if (command === "popGameHistories") {
        this.$store.commit("popGameHistories", { history });
      }
    });
  },
};
