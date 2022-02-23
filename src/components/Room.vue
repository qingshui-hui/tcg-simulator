<template>
  <div id="app" style="background-color: lightgray">
    <CHeader @reset-game="resetGame"></CHeader>
    <div class="app-wrapper main">
      <ImageViewer>
        <WorkSpace
          :lowerPlayer="lowerPlayer"
          @move-cards="moveCards"
          @shuffle-cards="shuffleCards"
        ></WorkSpace>

        <DeckSelector
          v-model:active="deckSelectorActive"
          :upperPlayer="upperPlayer"
          :lowerPlayer="lowerPlayer"
          :roomId="roomId"
          @moveCards="moveCards"
          @selected="onDeckSelected"
        ></DeckSelector>

        <div id="js_gameBoard">
          <TefudaZone
            :side="'upper'"
            :player="upperPlayer"
            @move-cards="moveCards"
          ></TefudaZone>
          <ManaZone
            :side="'upper'"
            :player="upperPlayer"
            @move-cards="moveCards"
          ></ManaZone>
          <PlayerZone
            :side="'upper'"
            :player="upperPlayer"
            @move-cards="moveCards"
          >
            <template #shield-zone>
              <ShieldZone
                side="upper"
                :player="upperPlayer"
                @move-cards="moveCards"
                @group-card="groupCard"
              ></ShieldZone>
            </template>
            <template #deck-zone>
              <DeckZone
                side="upper"
                :player="upperPlayer"
                @move-cards="moveCards"
                @group-card="groupCard"
              ></DeckZone>
            </template>
            <template #chojigenZone>
              <ChojigenZone
                side="upper"
                :player="upperPlayer"
                @move-cards="moveCards"
              ></ChojigenZone>
            </template>
          </PlayerZone>
          <BattleZone
            :side="'upper'"
            :player="upperPlayer"
            @move-cards="moveCards"
            @group-card="groupCard"
          ></BattleZone>

          <!-- center -->

          <BattleZone
            :side="'lower'"
            :player="lowerPlayer"
            @move-cards="moveCards"
            @group-card="groupCard"
          ></BattleZone>

          <PlayerZone
            :side="'lower'"
            :player="lowerPlayer"
            @move-cards="moveCards"
          >
            <template #shield-zone>
              <ShieldZone
                side="lower"
                :player="lowerPlayer"
                @move-cards="moveCards"
                @group-card="groupCard"
              ></ShieldZone>
            </template>
            <template #deck-zone>
              <DeckZone
                side="lower"
                :player="lowerPlayer"
                @move-cards="moveCards"
                @group-card="groupCard"
              ></DeckZone>
            </template>
            <template #chojigenZone>
              <ChojigenZone
                side="lower"
                :player="lowerPlayer"
                @move-cards="moveCards"
              ></ChojigenZone>
            </template>
          </PlayerZone>
          <ManaZone
            :side="'lower'"
            :player="lowerPlayer"
            @move-cards="moveCards"
          ></ManaZone>
          <TefudaZone
            :side="'lower'"
            :player="lowerPlayer"
            @move-cards="moveCards"
          ></TefudaZone>
        </div>
      </ImageViewer>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue'
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

export default defineComponent({
  name: "c-app",
  props: {
    upperPlayerId: String,
    lowerPlayerId: String,
    roomId: String,
  },
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
    upperPlayer() {
      return this.$store.state.room.players[this.upperPlayerId];
    },
    lowerPlayer() {
      return this.$store.state.room.players[this.lowerPlayerId];
    },
  },
  methods: {
    onDeckSelected({ deck, player }) {
      this.players[player].isReady = true;
      this.players[player].hasChojigen = !!deck.hasChojigen;
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
    // デバッグのために公開
    window.$room = this;
  },
});
</script>
