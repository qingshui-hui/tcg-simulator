<template>
  <div id="app" style="background-color: lightgray">
    <CHeader @reset-game="resetGame"></CHeader>
    <div class="app-wrapper main">
      <ImageViewer>
        <WorkSpace
          :lowerPlayer="lowerPlayer"
          @move-cards="moveCards"
          @shuffle-cards="shuffleCards"
          @emit-room-state="emitRoomState"
        ></WorkSpace>

        <DeckSelector
          v-model:active="deckSelectorActive"
          :player="lowerPlayer"
          :isReady="players[lowerPlayer].isReady"
          :partnerIsReady="players[upperPlayer].isReady"
          @moveCards="moveCards"
          @selected="onDeckSelected"
        ></DeckSelector>

        <div id="js_gameBoard">
          <TefudaZone
            :side="'upper'"
            :player="upperPlayer"
            :tefudaCards="players[upperPlayer]['cards']['tefudaCards']"
            v-on:move-cards="moveCards"
          ></TefudaZone>
          <ManaZone
            :side="'upper'"
            :player="upperPlayer"
            :manaCards="players[upperPlayer]['cards']['manaCards']"
            v-on:move-cards="moveCards"
          ></ManaZone>
          <PlayerZone
            :side="'upper'"
            :player="upperPlayer"
            :bochiCards="players[upperPlayer]['cards']['bochiCards']"
            :yamafudaCards="players[upperPlayer]['cards']['yamafudaCards']"
            :shieldCards="players[upperPlayer]['cards']['shieldCards']"
            :shieldCardGroups="
              players[upperPlayer]['cards']['shieldCardGroups']
            "
            v-on:move-cards="moveCards"
          >
            <template #shield-zone>
              <ShieldZone
                side="upper"
                :player="upperPlayer"
                :shieldCards="players[upperPlayer]['cards']['shieldCards']"
                :shieldCardGroups="
                  players[upperPlayer]['cards']['shieldCardGroups']
                "
                v-on:move-cards="moveCards"
                @group-card="groupCard"
              ></ShieldZone>
            </template>
            <template #deck-zone>
              <DeckZone
                side="upper"
                :player="upperPlayer"
                :yamafudaCards="players[upperPlayer]['cards']['yamafudaCards']"
                v-on:move-cards="moveCards"
                @group-card="groupCard"
              ></DeckZone>
            </template>
            <template #chojigenZone>
              <ChojigenZone
                side="upper"
                :player="upperPlayer"
                :chojigenCards="players[upperPlayer]['cards']['chojigenCards']"
                :hasChojigen="players[upperPlayer].hasChojigen"
                @move-cards="moveCards"
              ></ChojigenZone>
            </template>
          </PlayerZone>
          <BattleZone
            :side="'upper'"
            :player="upperPlayer"
            :battleCards="players[upperPlayer]['cards']['battleCards']"
            :battleCardGroups="
              players[upperPlayer]['cards']['battleCardGroups']
            "
            v-on:move-cards="moveCards"
            @group-card="groupCard"
            @emit-room-state="emitRoomState"
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
            :battleCardGroups="
              players[lowerPlayer]['cards']['battleCardGroups']
            "
            v-on:move-cards="moveCards"
            @group-card="groupCard"
            @emit-room-state="emitRoomState"
          ></BattleZone>

          <player-zone
            :side="'lower'"
            :player="lowerPlayer"
            :bochiCards="players[lowerPlayer]['cards']['bochiCards']"
            :yamafudaCards="players[lowerPlayer]['cards']['yamafudaCards']"
            :shieldCards="players[lowerPlayer]['cards']['shieldCards']"
            :shieldCardGroups="
              players[lowerPlayer]['cards']['shieldCardGroups']
            "
            v-on:move-cards="moveCards"
          >
            <template #shield-zone>
              <ShieldZone
                side="lower"
                :player="lowerPlayer"
                :shieldCards="players[lowerPlayer]['cards']['shieldCards']"
                :shieldCardGroups="
                  players[lowerPlayer]['cards']['shieldCardGroups']
                "
                v-on:move-cards="moveCards"
                @group-card="groupCard"
              ></ShieldZone>
            </template>
            <template #deck-zone>
              <DeckZone
                side="lower"
                :player="lowerPlayer"
                :yamafudaCards="players[lowerPlayer]['cards']['yamafudaCards']"
                v-on:move-cards="moveCards"
                @group-card="groupCard"
              ></DeckZone>
            </template>
            <template #chojigenZone>
              <ChojigenZone
                side="lower"
                :player="lowerPlayer"
                :chojigenCards="players[lowerPlayer]['cards']['chojigenCards']"
                :hasChojigen="players[lowerPlayer].hasChojigen"
                @move-cards="moveCards"
              ></ChojigenZone>
            </template>
          </player-zone>
          <mana-zone
            :side="'lower'"
            :player="lowerPlayer"
            :manaCards="players[lowerPlayer]['cards']['manaCards']"
            v-on:move-cards="moveCards"
          ></mana-zone>
          <tefuda-zone
            :side="'lower'"
            :player="lowerPlayer"
            :tefudaCards="players[lowerPlayer]['cards']['tefudaCards']"
            v-on:move-cards="moveCards"
          ></tefuda-zone>
        </div>
      </ImageViewer>
    </div>
  </div>
</template>

<script>
import { Deck } from "@/helpers/Deck";
import WorkSpace from "./WorkSpace.vue";
import ImageViewer from "./ImageViewer.vue";
import TefudaZone from "./TefudaZone.vue";
import ManaZone from "./ManaZone.vue";
import PlayerZone from "./PlayerZone.vue";
import BattleZone from "./BattleZone.vue";
import DeckSelector from "./DeckSelector.vue";
import ShieldZone from "./ShieldZone.vue";
import CHeader from "./CHeader.vue";
import DeckZone from "./DeckZone.vue";
import ChojigenZone from "./ChojigenZone.vue";
import { mapState } from "vuex";
import moveCardsMixin from "./room/moveCardsMixin"

export default {
  name: "c-app",
  props: ["upperPlayer", "lowerPlayer"],
  mixins: [moveCardsMixin],
  components: {
    WorkSpace,
    ImageViewer,
    TefudaZone,
    ManaZone,
    PlayerZone,
    BattleZone,
    DeckSelector,
    ShieldZone,
    CHeader,
    DeckZone,
    ChojigenZone,
  },
  data() {
    return {
      deckSelectorActive: false,
    };
  },
  computed: {
    ...mapState({
      players: (state) => state.room.players,
    }),
    roomId() {
      return this.$route.query.roomId;
    },
  },
  methods: {
    onDeckSelected({ deck, player }) {
      this.players[player].isReady = true;
      this.players[player].hasChojigen = !!deck.hasChojigen;
    },
    emitRoomState() {
      if (this.$socket) {
        // 今のところバトルゾーンとマナゾーンのタップ状態を送信するために使用。
        this.$socket.emit("cards-moved", this.players[this.lowerPlayer]);
        // this.$socket.emit("cards-moved", this.players[this.upperPlayer])
      }
    },
    shuffleCards(from, cards, player) {
      this.players[player]["cards"][from] = Deck.shuffle(cards);
      const shuffleMessage = {
        shieldCards: "シールド",
        yamafudaCards: "山札",
        tefudaCards: "手札",
      };
      this.setMessage(shuffleMessage[from] + "をシャッフル", player);
    },
    scrollZone(targetSelector, direction) {
      const target = document.querySelector(targetSelector);
      target.scrollTo({
        behavior: "smooth",
        [direction]: target.scrollWidth,
      });
    },
    setMessage() {
      //
    },
    async getRoomState() {
      const res = await fetch(
        `${this.useConfig().API_HOST}/api/rooms/${this.roomId}`
      );
      const room = await res.json();
      if (room.a) {
        this.players.a = room.a;
      }
      if (room.b) {
        this.players.b = room.b;
      }
      // 片方がデッキ未選択であれば、モーダルを表示する。
      if (!this.players.a.isReady || !this.players.b.isReady) {
        this.deckSelectorActive = true;
      } else {
        this.deckSelectorActive = false;
      }
    },
    resetGame() {
      this.$store.commit("resetGame");
      window.scrollTo({
        top: 0,
        // behavior: "smooth",
      });
      this.deckSelectorActive = true;
      // 状態の変更を送信する
      if (!this.$socket) return;
      this.$socket.emit("cards-moved", this.players.a);
      this.$socket.emit("cards-moved", this.players.b);
    },
  },
  async mounted() {
    // サーバーからデータを取得する。
    await this.getRoomState();
    if (this.$socket) {
      //
      // イベントをリッスン
      this.$socket.on("cards-moved", (playerData) => {
        this.players[playerData.name] = playerData;
      });
      this.$socket.on(
        "set-message",
        function (data) {
          // this.message[data.player] = data.message;
          this.expireMessage(data.message, data.player);
        }.bind(this)
      );
    }
    // デバッグのために公開
    window.$room = this;
  },
};
</script>
