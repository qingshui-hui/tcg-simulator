<template>
  <div id="app">
    <CHeader></CHeader>
    <div class="app-wrapper">
      <ImageViewer>
        <WorkSpace
          :lowerPlayer="lowerPlayer"
          @move-cards="moveCards"
          @shuffle-cards="shuffleCards"
        ></WorkSpace>

        <DeckSelector :player="lowerPlayer"
          :isReady="players[lowerPlayer].isReady"
          :partnerIsReady="players[this.upperPlayer].isReady"
          @moveCards="moveCards"
          @selected="players[lowerPlayer].isReady = true"
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
            :shieldCardGroups="players[upperPlayer]['cards']['shieldCardGroups']"
            v-on:move-cards="moveCards"
          >
            <template #shield-zone>
              <ShieldZone
                side="upper"
                :player="upperPlayer"
                :shieldCards="players[upperPlayer]['cards']['shieldCards']"
                :shieldCardGroups="players[upperPlayer]['cards']['shieldCardGroups']"
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
          </PlayerZone>
          <BattleZone
            :side="'upper'"
            :player="upperPlayer"
            :battleCards="players[upperPlayer]['cards']['battleCards']"
            :battleCardGroups="players[upperPlayer]['cards']['battleCardGroups']"
            v-on:move-cards="moveCards"
            @group-card="groupCard"
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
            :battleCardGroups="players[lowerPlayer]['cards']['battleCardGroups']"
            v-on:move-cards="moveCards"
            @group-card="groupCard"
          ></BattleZone>

          <player-zone
            :side="'lower'"
            :player="lowerPlayer"
            :bochiCards="players[lowerPlayer]['cards']['bochiCards']"
            :yamafudaCards="players[lowerPlayer]['cards']['yamafudaCards']"
            :shieldCards="players[lowerPlayer]['cards']['shieldCards']"
            :shieldCardGroups="players[lowerPlayer]['cards']['shieldCardGroups']"
            v-on:move-cards="moveCards"
          >
            <template #shield-zone>
              <ShieldZone
                side="lower"
                :player="lowerPlayer"
                :shieldCards="players[lowerPlayer]['cards']['shieldCards']"
                :shieldCardGroups="players[lowerPlayer]['cards']['shieldCardGroups']"
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
      <o-dropdown>
        <template #trigger>
          <button>ゲームをリセットする</button>
        </template>
        <o-dropdown-item @click="resetGame">ゲームをリセットする</o-dropdown-item>
      </o-dropdown>

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
import DeckSelector from './DeckSelector.vue';
import ShieldZone from './ShieldZone.vue';
import CHeader from './CHeader.vue';
import DeckZone from './DeckZone.vue';

function initialData({roomId}) {
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
          // cardGroups
          battleCardGroups: [],
          shieldCardGroups: [],
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
          // cardGroups
          battleCardGroups: [],
          shieldCardGroups: [],
        },
        name: "b",
        roomId: roomId,
        isReady: false,
      },
    },
  };
}

export default {
  name: "c-app",
  props: ["upperPlayer", "lowerPlayer", "socket"],
  components: { WorkSpace, ImageViewer, TefudaZone, ManaZone, PlayerZone, BattleZone, DeckSelector, ShieldZone, CHeader, DeckZone },
  data() {
    return initialData({
      roomId: this.roomId
    })
  },
  computed: {
    roomId() {
      return this.$route.query.roomId;
    },
  },
  methods: {
    groupCard({from, to, fromCard, toCard, player}) {
      // 情報をカードに追加
      // card.groupはできれば使いたくない。moveCards内でのみ使用。
      fromCard.group = to
      toCard.group = to
      if (toCard.groupId) {
        // ターゲットのカードが既にグループ化されていた場合、
        // 既存のグループに追加する。
        const group = this.players[player]["cards"][to].find(g => g.id === toCard.groupId)
        group.cardIds.unshift(fromCard.id)
        fromCard.groupId = toCard.groupId
      } else {
        // 新しくグループを作成する。
        // TODO: 被らない文字列にする。
        const groupId = `${toCard.id}-${fromCard.id}`
        this.players[player]["cards"][to].push({
          id: groupId,
          cardIds: [fromCard.id, toCard.id]
        })
        fromCard.groupId = groupId
        toCard.groupId = groupId
      }
      // 並べ替え
      if (['battleCardGroups', 'shieldCardGroups'].includes(to)) {
        // fromCardをtoCardの前に移す。
        Util.arrayInsertBefore(this.players[player]["cards"][from], toCard, fromCard)
      }
      // 状態の変更を送信する
      if (!this.useConfig().WS_ENABLED) return;
      this.socket.emit("cards-moved", this.players[player]);
    },
    // groupNameはbattleCardGroupsかshieldCardGroups
    ungroupCard({groupName, card, player}) {
      // シールドのグループの場合はカードの行き先がわからず、注意が必要。
      const groupIndex = this.players[player]["cards"][groupName].findIndex(g => g.id === card.groupId)
      const group = this.players[player]["cards"][groupName].find(g => g.id === card.groupId)
      this.players[player]["cards"][groupName][groupIndex].cardIds.splice(
        group.cardIds.findIndex(id => id === card.id),
        1
      )
      // cardIdsが0になったグループは自動で消す。
      if (group.cardIds.length === 0) {
        this.players[player]["cards"][groupName].splice(groupIndex, 1)
      }
      card.groupId = null
      card.group = null
    },
    moveCard: function (from, to, card, player, prepend = false) {
      // GRゾーン, 超次元ゾーンを考えると、一枚ずつの方が、処理しやすい
      this.moveCards(from, to, [card], player, prepend);
    },
    moveCards: function (from, to, selectedCards, player, prepend = false) {
      // 先頭のカードがグループに属していた場合、そのグループから抜ける。
      const card = selectedCards[0]
      if (card.groupId) {
        this.ungroupCard({
          groupName: card.group,
          card,
          player,
        })
        card.group = null
      }
      // 手札、マナ、墓地へ行く場合は表向きにする。
      if (['tefudaCards', 'manaCards', 'bochiCards'].includes(to)
        && to !== from
      ) {
        selectedCards.forEach((card) => {
          card.faceDown = false
        })
      }
      // 違うゾーンへ移動するときはタップを解除する。
      if (to !== from) {
        selectedCards.forEach((card) => {
          card.tapped = false
        })
      }
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
          this.scrollZone(".tefuda-zone." + (player === this.upperPlayer ? 'upper' : 'lower'), "left");
        }, 300)
      }
      if (!this.useConfig().WS_ENABLED)
        return;
      this.players[player].isReady = true
      this.socket.emit("cards-moved", this.players[player]);
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
      const target = document.querySelector(targetSelector)
      target.scrollTo({
        behavior: "smooth",
        [direction]: target.scrollWidth,
      });
    },
    setMessage() {
      //
    },
    async getRoomState() {
      const res = await fetch(`${this.useConfig().API_HOST}/api/rooms/${this.roomId}`)
      const room = await res.json()
      if (room.a) {
        this.players.a = room.a
      }
      if (room.b) {
        this.players.b = room.b
      }
    },
    resetGame() {
      this.players = initialData({roomId: this.roomId}).players
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      // 状態の変更を送信する
      if (!this.socket) return;
      this.socket.emit("cards-moved", this.players.a);
      this.socket.emit("cards-moved", this.players.b);
    },
  },
  created() {
    if (this.socket) {
      // サーバーからデータを取得する。
      this.getRoomState()

      //
      // イベントをリッスン
      this.socket.on("cards-moved", (playerData) => {
        this.players[playerData.name] = playerData;
      });
      this.socket.on("set-message", function (data) {
        // this.message[data.player] = data.message;
        this.expireMessage(data.message, data.player);
      }.bind(this));
    }
  },
};
</script>

