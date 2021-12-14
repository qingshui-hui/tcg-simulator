<template>
  <div id="app">
    <div class="app-wrapper">
      <ImageViewer>
        <form
          action
          method="get"
          id="deck-form"
          v-on:submit="selectDeck"
          v-if="players[lowerPlayer]['isReady'] === false"
        >
          <p>デッキを選択してください</p>
          <select name="deck">
            <option
              v-for="(value, deckId) in deckList"
              :key="deckId"
              :value="deckId"
            >{{ value.name }}</option>
          </select>
          <button>選択</button>
        </form>

        <div id="waiting-player" v-if="onPreparing">
          <span>プレイヤー{{ upperPlayer.toUpperCase() }}が</span>
          <br />
          <span>デッキを選択するのを待つか、</span>
          <br />
          <span>ウィンドウをもう一つ開いて、</span>
          <br />
          <span>同じ部屋番号の</span>
          <br />
          <span>プレイヤー{{ upperPlayer.toUpperCase() }}として、</span>
          <br />
          <span>デッキを選択してください</span>
          <br />
        </div>

        <WorkSpace
          :workSpace="workSpace"
          v-on:close-work-space="closeWorkSpace"
          v-on:move-cards="moveCards"
        ></WorkSpace>

        <TefudaZone
          :side="'upper'"
          :player="upperPlayer"
          :tefudaCards="players[upperPlayer]['cards']['tefudaCards']"
          v-on:move-cards="moveCards"
          v-on:open-work-space="openWorkSpace"
        ></TefudaZone>
        <ManaZone
          :side="'upper'"
          :player="upperPlayer"
          :manaCards="players[upperPlayer]['cards']['manaCards']"
          v-on:move-cards="moveCards"
          v-on:open-work-space="openWorkSpace"
        ></ManaZone>
        <PlayerZone
          :side="'upper'"
          :player="upperPlayer"
          :bochiCards="players[upperPlayer]['cards']['bochiCards']"
          :yamafudaCards="players[upperPlayer]['cards']['yamafudaCards']"
          :shieldCards="players[upperPlayer]['cards']['shieldCards']"
          v-on:move-cards="moveCards"
          v-on:open-work-space="openWorkSpace"
          v-on:shuffle-cards="shuffleCards"
          v-on:drop-card="dropCard"
        ></PlayerZone>
        <BattleZone
          :side="'upper'"
          :player="upperPlayer"
          :battleCards="players[upperPlayer]['cards']['battleCards']"
          v-on:move-cards="moveCards"
          v-on:drag-card="dragCard"
          v-on:drop-card="dropCard"
          v-on:open-work-space="openWorkSpace"
        ></BattleZone>

        <!-- <MessageBox :upper-player="upperPlayer"
          :lower-player="lowerPlayer"
        ></MessageBox>-->

        <!-- center -->
        <!-- <MessageButtons :player="lowerPlayer"></MessageButtons> -->

        <BattleZone
          :side="'lower'"
          :player="lowerPlayer"
          :battleCards="players[lowerPlayer]['cards']['battleCards']"
          v-on:move-cards="moveCards"
          v-on:drag-card="dragCard"
          v-on:drop-card="dropCard"
          v-on:open-work-space="openWorkSpace"
        ></BattleZone>

        <player-zone
          :side="'lower'"
          :player="lowerPlayer"
          :bochiCards="players[lowerPlayer]['cards']['bochiCards']"
          :yamafudaCards="players[lowerPlayer]['cards']['yamafudaCards']"
          :shieldCards="players[lowerPlayer]['cards']['shieldCards']"
          v-on:move-cards="moveCards"
          v-on:open-work-space="openWorkSpace"
          v-on:shuffle-cards="shuffleCards"
          v-on:drop-card="dropCard"
        ></player-zone>
        <mana-zone
          :side="'lower'"
          :player="lowerPlayer"
          :manaCards="players[lowerPlayer]['cards']['manaCards']"
          v-on:move-cards="moveCards"
          v-on:open-work-space="openWorkSpace"
        ></mana-zone>
        <tefuda-zone
          :side="'lower'"
          :player="lowerPlayer"
          :tefudaCards="players[lowerPlayer]['cards']['tefudaCards']"
          v-on:move-cards="moveCards"
          v-on:open-work-space="openWorkSpace"
        ></tefuda-zone>
      </ImageViewer>
    </div>
  </div>
</template>

<script>
import { Deck } from '@/helpers/Deck'
import { Util } from '@/helpers/Util'
import WorkSpace from './WorkSpace.vue';
import ImageViewer from './ImageViewer.vue';
import TefudaZone from './TefudaZone.vue';
import ManaZone from './ManaZone.vue';
import PlayerZone from './PlayerZone.vue';
import BattleZone from './BattleZone.vue';

export default {
  name: "c-app",
  props: ["upperPlayer", "lowerPlayer", "deckList", "socket", "config"],
  components: { WorkSpace, ImageViewer, TefudaZone, ManaZone, PlayerZone, BattleZone },
  data() {
    const roomId = this.$route.query.roomId;
    return {
      players: {
        a: {
          cards: {
            manaCards: [],
            battleCards: [],
            bochiCards: [],
            shieldCards: [],
            tefudaCards: [],
            yamafudaCards: [],
            childCards: [],
          },
          name: "a",
          roomId: roomId,
          isReady: false,
        },
        b: {
          cards: {
            manaCards: [],
            battleCards: [],
            bochiCards: [],
            shieldCards: [],
            tefudaCards: [],
            yamafudaCards: [],
            childCards: [],
          },
          name: "b",
          roomId: roomId,
          isReady: false,
        },
      },
      workSpace: {
        hidden: true,
        cards: [],
        selectedZone: "",
        player: "",
      },
      drag: {
        from: null,
        draggingCard: null,
      },
    };
  },
  computed: {
    roomId() {
      return this.$route.query.roomId;
    },
    onPreparing() {
      // 相手が準備できているか
      if (!this.players[this.lowerPlayer]["isReady"]) {
        return false;
      }
      return !this.players[this.upperPlayer]["isReady"];
    },
  },
  methods: {
    dragCard: function (from, card) {
      this.drag["from"] = from;
      this.drag["draggingCard"] = card;
    },
    dropCard: function (parentFrom, parentCard, player) {
      const childCard = this.drag.draggingCard;
      if (!childCard) {
        return;
      }
      if (childCard.id === parentCard.id) {
        return;
      }
      // このプロパティの寿命をどうするか、
      // 今のところshieldでのみ使う予定
      parentCard.childCards.push(childCard);
      childCard.parentId = parentCard.id;
      this.drag.draggingCard = null;
      this.moveCards(this.drag.from, "childCards", [childCard], player);
      // シールドの上側のカードを更新するために付け加えた
      if (parentFrom === "shieldCards") {
        // parentCardはずっと参照渡しのため、childCardsの増加が反映される
        this.moveCards(parentFrom, parentFrom, this.players[player]["cards"][parentFrom], player);
      }
    },
    moveCard: function (from, to, card, player, prepend = false) {
      // GRゾーン, 超次元ゾーンを考えると、一枚ずつの方が、処理しやすい
      this.moveCards(from, to, [card], player, prepend);
    },
    moveCards: function (from, to, selectedCards, player, prepend = false) {
      this.players[player]["cards"][from] = Util.arrayRemoveCards(this.players[player]["cards"][from], selectedCards);
      if (prepend) {
        this.players[player]["cards"][to] = Util.arrayPrependCards(this.players[player]["cards"][to], selectedCards);
      }
      else {
        this.players[player]["cards"][to] = Util.arrayAppendCards(this.players[player]["cards"][to], selectedCards);
      }
      // 少し待てば、レンダリングが完了しているため、うまくいった。
      if (to === "tefudaCards") {
        setTimeout(() => {
          this.scrollZone("tefuda-zone" + player, "left");
        }, 300);
      }
      if (this.config.development)
        return;
      this.socket.emit("cards-moved", this.players[player]);
    },
    shuffleCards: function (from, cards, player) {
      this.players[player]["cards"][from] = Deck.shuffle(cards);
      const shuffleMessage = {
        shieldCards: "シールド",
        yamafudaCards: "山札",
        tefudaCards: "手札",
      };
      this.setMessage(shuffleMessage[from] + "をシャッフル", player);
    },
    scrollZone: function (targetZoneId, direction) {
      // TefudaZone.vue > tefuda-zone の id に注意
      const target = document.getElementById(targetZoneId);
      target.scrollTo({
        behavior: "smooth",
        [direction]: target.scrollWidth,
        // 'top': scrolled.scrollHeight
      });
    },
    openWorkSpace: function (cards, from, player, faceDown = false) {
      if (faceDown) {
        for (let card of cards) {
          card.faceDown = true;
        }
      }
      else {
        for (let card of cards) {
          card.faceDown = false;
        }
      }
      this.workSpace.cards = Util.arrayAppendChildren(cards, this.players[player]["cards"]["childCards"]);
      this.workSpace.selectedZone = from;
      this.workSpace.player = player;
      this.workSpace.hidden = false;
    },
    closeWorkSpace: function () {
      this.cards = [];
      this.selectedZone = "";
      this.workSpace.hidden = true;
    },
    selectDeck() {
      event.preventDefault();
      const formData = new FormData(event.target);
      const deckId = formData.get("deck");
      this.pullDeck(deckId);
    },
    pullDeck(deckId) {
      const config = this.useConfig();
      if (this.config.development) {
        let deck = Deck.getDeckById(config.IMAGE_HOST, deckId, this.lowerPlayer === "a");
        this.players[this.lowerPlayer]["cards"]["shieldCards"] = deck.slice(0, 5);
        this.players[this.lowerPlayer]["cards"]["tefudaCards"] = deck.slice(5, 10);
        this.players[this.lowerPlayer]["cards"]["yamafudaCards"] = deck.slice(10, 40);
        this.players[this.lowerPlayer]["isReady"] = true;
        // this[this.lowerPlayer]['cards']['childCards'] = deck.slice(10,13).map((card) => {
        //     card.parentId = deck[0].id;
        //     return card;
        // });
        deck = Deck.getDeckById(config.IMAGE_HOST, 6, this.lowerPlayer !== "a");
        this.players[this.upperPlayer]["cards"]["shieldCards"] = deck.slice(0, 5);
        this.players[this.upperPlayer]["cards"]["tefudaCards"] = deck.slice(5, 10);
        this.players[this.upperPlayer]["cards"]["yamafudaCards"] = deck.slice(10, 40);
        this.players[this.upperPlayer]["isReady"] = true;
        return;
      }
      else {
        // const data = {};
        // data.deckId = deckId;
        // data.playerData = this[this.lowerPlayer];
        // this.socket.emit("pull-deck", data);
        return;
      }
    },
    connectSocket: function () {
      this.socket.emit("room", this.roomId);
      this.setMessage("room" + this.roomId + "に入室しました", this.lowerPlayer);
      this.socket.on("cards-moved", (playerData) => {
        this.players[playerData.name] = playerData;
      });
      this.socket.on("set-message", function (data) {
        // this.message[data.player] = data.message;
        this.expireMessage(data.message, data.player);
      }.bind(this));
    },
  },
  mounted() {
    if (this.$route.query.deckId) {
      this.pullDeck(this.$route.query.deckId);
    }
    if (this.config.development)
      return;
    // console.log("connected");
    // this.connectSocket();
  },
};
</script>

<style lang="scss">
#deck-form {
  position: absolute;
  text-align: center;
  width: 300px;
  height: 150px;
  top: 200px;
  left: 200px;
  border-radius: 20px;
  background-color: aqua;
  p {
    font-size: 20px;
    margin: 20px 0;
  }
}
#waiting-player {
  position: absolute;
  text-align: center;
  width: 300px;
  top: 200px;
  left: 200px;
  border-radius: 20px;
  background-color: lightgreen;
  line-height: 30px;
}
</style>
