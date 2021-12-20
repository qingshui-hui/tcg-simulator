<template>
  <div class="battle-zone-wrapper">
    <template
      v-if="
        selectMode && selectMode.zone !== 'battleCards' && selectMode.player === player
      "
    >
      <o-button
        class="battleZoneButton"
        variant="danger"
        size="medium"
        rounded
        @click="moveSelectedCard('battleCards', true)"
      >
        出す
      </o-button>
    </template>
    <template v-else>
      <o-icon
        class="openZoneButton battleZoneButton"
        :class="side"
        pack="fas"
        size="large"
        icon="arrow-circle-up"
        variant="primary"
        @click="
          openWorkSpace({
            zone: 'battleCards',
            cards: battleCards,
            player: player,
          })
        "
      ></o-icon>
    </template>
    <div
      class="battle-zone"
      :class="{
        [side]: true,
      }"
    >
      <div v-for="(card, index) in battleZoneCards" :key="index">
        <div
          class="card in-battle"
          :class="{
            tapped: card.tapped,
            'is-group': !!card.groupId,
            'is-selectMode': selectMode && selectMode.player === player,
            'is-selected': selectMode && selectMode.card.id === card.id,
          }"
          :draggable="!card.groupId"
          @click="clickCard($event, card)"
        >
          <img
            v-if="card.faceDown === true"
            src="@/assets/images/card-back.jpg"
            draggable="false"
          />
          <img v-else :src="card.imageUrl" draggable="false" />
        </div>
        <div v-if="side === 'lower' && !!selectMode" class="card_bottomButton">
          <o-button v-if="card.tapped" variant="grey-dark" @click="toggleTap(card)"
            >アンタップ</o-button
          >
          <o-button v-else variant="grey-dark" @click="toggleTap(card)">タップ</o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/helpers/mixin.js";

export default {
  props: ["player", "battleCards", "battleCardGroups", "side"],
  mixins: [mixin.zone],
  computed: {
    battleZoneCards() {
      // 表示するカードのIDのリスト
      const firstCardIds = this.battleCardGroups.map((g) => g.cardIds[0]);
      const visibleCards = this.battleCards.filter((c) => {
        return !c.groupId || firstCardIds.includes(c.id);
      });
      return visibleCards;
    },
  },
  methods: {
    // リレーション
    group(card) {
      if (!card.groupId) {
        return null;
      }
      const group = {
        ...this.battleCardGroups.find((g) => g.id === card.groupId),
      };
      group.cards = this.battleCards.filter((c) => c.groupId === group.id);
      return group;
    },
    toggleTap(card) {
      card.tapped = !card.tapped;
      // 状態を送信
      this.emitState();
    },
    clickCard(event, card) {
      if (!this.selectMode) {
        if (!card.groupId) {
          this.setSelectMode({
            card,
            zone: "battleCards",
            player: this.player,
          });
          return;
        }
        this.openWorkSpace({
          zone: "battleCards",
          cards: card.groupId ? this.group(card).cards : [card],
          player: this.player,
          single: true,
        });
        return;
      }
      // 本人確認
      if (this.selectMode.player === this.player) {
        // 選択中のカードと同じカードがクリックされた場合、
        if (this.selectMode.card.id === card.id) {
          // セレクトモードを終了。
          this.setSelectMode(null);
          return;
        }
        // カードを重ねる。
        // moveSelectedCardでselectModeがnullになるので、情報を残しておく。
        const fromCard = this.selectMode.card;
        this.moveSelectedCard("battleCards");
        this.$emit("group-card", {
          from: "battleCards",
          to: "battleCardGroups",
          fromCard: fromCard,
          toCard: card,
          player: this.player,
        });
        return;
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/mixin.scss";
@function cardHeight($value) {
  @return calc($value * 908 / 650);
}
$card-width: 100px;
.battle-zone-wrapper {
  display: flex;
  img {
    width: $card-width;
  }
  .openZoneButton {
    transform: rotate(45deg);
    cursor: pointer;
    &.upper {
      margin-top: 20px;
      align-self: flex-start;
    }
  }
  .battleZoneButton {
    align-self: flex-end;
    margin-left: 20px;
    &.lower {
      margin-bottom: 10px;
    }
  }
  .battle-zone {
    // スクロールをしないUIに変更
    display: flex;
    flex-wrap: wrap;
    margin-left: 30px;
    min-height: cardHeight($card-width);
    // overflow-x: scroll;
    // height: cardHeight($card-width);
    max-width: 700px; // 800 - margin-left
    > * {
      flex-shrink: 0;
      margin: 0 10px 10px 0;
    }
    &.upper {
      margin-top: 10px;
      // box-shadowが見えるようにするため。
      padding-top: 10px;
      .card {
        transform: rotate(180deg);
        &.tapped {
          // 回転中心が左下の時ちょうど、回転後の位置がx軸方向について中心になる。
          // あとはtranslateXでy座標を調整する。
          transform: rotate(90deg) translateX(-100%);
          transform-origin: left bottom;
          width: cardHeight($card-width);
        }
      }
    }
    &.lower {
      margin-top: 40px;
      // box-shadowが見えるようにするため。
      padding-bottom: 10px;
      .card.tapped {
        transform: rotate(-90deg) translateX(100%);
        transform-origin: right bottom;
        width: cardHeight($card-width);
      }
    }
  }
  .card {
    position: relative;
    display: flex;
    &.is-group img {
      border: lightgray 1px solid;
      border-top-width: 0;
      border-left-width: 0;
      box-shadow: 2px 3px black;
      border-radius: 3px;
    }
    &.is-selectMode {
      img {
        border: 3px solid orange;
        border-radius: 5px;
      }
    }
    &.is-selected {
      img {
        border-color: #b60000;
      }
    }
    &_bottomButton {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
