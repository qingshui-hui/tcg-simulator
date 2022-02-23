<template>
  <div id="app" style="background-color: lightgray">
    <CHeader @reset-game="resetGame"></CHeader>
    <div class="app-wrapper main">
      <ImageViewer>
        <WorkSpace
          :lowerPlayer="lowerPlayerId"
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
            :player="upperPlayerId"
            :tefudaCards="players[upperPlayerId]['cards']['tefudaCards']"
            @move-cards="moveCards"
          ></TefudaZone>
          <ManaZone
            :side="'upper'"
            :player="upperPlayerId"
            :manaCards="players[upperPlayerId]['cards']['manaCards']"
            @move-cards="moveCards"
          ></ManaZone>
          <PlayerZone
            :side="'upper'"
            :player="upperPlayerId"
            :bochiCards="players[upperPlayerId]['cards']['bochiCards']"
            :yamafudaCards="players[upperPlayerId]['cards']['yamafudaCards']"
            :shieldCards="players[upperPlayerId]['cards']['shieldCards']"
            :shieldCardGroups="
              players[upperPlayerId]['cards']['shieldCardGroups']
            "
            @move-cards="moveCards"
          >
            <template #shield-zone>
              <ShieldZone
                side="upper"
                :player="upperPlayerId"
                :shieldCards="players[upperPlayerId]['cards']['shieldCards']"
                :shieldCardGroups="
                  players[upperPlayerId]['cards']['shieldCardGroups']
                "
                @move-cards="moveCards"
                @group-card="groupCard"
              ></ShieldZone>
            </template>
            <template #deck-zone>
              <DeckZone
                side="upper"
                :player="upperPlayerId"
                :yamafudaCards="players[upperPlayerId]['cards']['yamafudaCards']"
                @move-cards="moveCards"
                @group-card="groupCard"
              ></DeckZone>
            </template>
            <template #chojigenZone>
              <ChojigenZone
                side="upper"
                :player="upperPlayerId"
                :chojigenCards="players[upperPlayerId]['cards']['chojigenCards']"
                :hasChojigen="players[upperPlayerId].hasChojigen"
                @move-cards="moveCards"
              ></ChojigenZone>
            </template>
          </PlayerZone>
          <BattleZone
            :side="'upper'"
            :player="upperPlayerId"
            :battleCards="players[upperPlayerId]['cards']['battleCards']"
            :battleCardGroups="
              players[upperPlayerId]['cards']['battleCardGroups']
            "
            @move-cards="moveCards"
            @group-card="groupCard"
          ></BattleZone>

          <!-- <MessageBox :upper-player="upperPlayer"
            :lower-player="lowerPlayer"
          ></MessageBox>-->

          <!-- center -->
          <!-- <MessageButtons :player="lowerPlayer"></MessageButtons> -->

          <BattleZone
            :side="'lower'"
            :player="lowerPlayerId"
            :battleCards="players[lowerPlayerId]['cards']['battleCards']"
            :battleCardGroups="
              players[lowerPlayerId]['cards']['battleCardGroups']
            "
            @move-cards="moveCards"
            @group-card="groupCard"
          ></BattleZone>

          <player-zone
            :side="'lower'"
            :player="lowerPlayerId"
            :bochiCards="players[lowerPlayerId]['cards']['bochiCards']"
            :yamafudaCards="players[lowerPlayerId]['cards']['yamafudaCards']"
            :shieldCards="players[lowerPlayerId]['cards']['shieldCards']"
            :shieldCardGroups="
              players[lowerPlayerId]['cards']['shieldCardGroups']
            "
            @move-cards="moveCards"
          >
            <template #shield-zone>
              <ShieldZone
                side="lower"
                :player="lowerPlayerId"
                :shieldCards="players[lowerPlayerId]['cards']['shieldCards']"
                :shieldCardGroups="
                  players[lowerPlayerId]['cards']['shieldCardGroups']
                "
                @move-cards="moveCards"
                @group-card="groupCard"
              ></ShieldZone>
            </template>
            <template #deck-zone>
              <DeckZone
                side="lower"
                :player="lowerPlayerId"
                :yamafudaCards="players[lowerPlayerId]['cards']['yamafudaCards']"
                @move-cards="moveCards"
                @group-card="groupCard"
              ></DeckZone>
            </template>
            <template #chojigenZone>
              <ChojigenZone
                side="lower"
                :player="lowerPlayerId"
                :chojigenCards="players[lowerPlayerId]['cards']['chojigenCards']"
                :hasChojigen="players[lowerPlayerId].hasChojigen"
                @move-cards="moveCards"
              ></ChojigenZone>
            </template>
          </player-zone>
          <mana-zone
            :side="'lower'"
            :player="lowerPlayerId"
            :manaCards="players[lowerPlayerId]['cards']['manaCards']"
            @move-cards="moveCards"
          ></mana-zone>
          <tefuda-zone
            :side="'lower'"
            :player="lowerPlayerId"
            :tefudaCards="players[lowerPlayerId]['cards']['tefudaCards']"
            @move-cards="moveCards"
          ></tefuda-zone>
        </div>
      </ImageViewer>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck

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
  props: ["upperPlayerId", "lowerPlayerId", "roomId"],
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
};
</script>
