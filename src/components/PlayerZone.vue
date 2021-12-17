<template>
  <div class="player-zone-wrapper">
    <div class="player-zone" :class="side">
      <div class="player-counter" :class="side">
        <div
          class="shieldButton"
          @click="openWorkSpace({
            zone: 'shieldCards',
            cards: shieldCards,
            player: player,
          })"
        >
          <div class="shieldButton_text">シールド</div>
          <div class="shieldButton_count">{{ countableShieldCards.length }}</div>
        </div>
      </div>
      <div class="blue-wrapper" :class="{ reverse: side === 'upper' }">
        <!-- シールドゾーン -->
        <slot name="shield-zone"></slot>

        <div class="yamafuda-zone">
          <div v-if="yamafudaCards.length > 0">
            <div class="menu-list hidden" :class="{ reverse: side === 'upper' }">
              <div @click="moveCard('yamafudaCards', 'tefudaCards', yamafudaCards[0])">
                <span class="small">ドロー</span>
              </div>
              <div @click="openDeck">
                <span class="small">開く</span>
              </div>
              <div @click="shuffleCards('yamafudaCards', yamafudaCards)">
                <span class="small">シャッフル</span>
              </div>
            </div>
            <img v-if="side === 'upper'" src="@/assets/images/deck1.png" />
            <img v-else src="@/assets/images/deck2.png" />
          </div>
        </div>

        <div class="bochi">
          <div class="menu-list hidden" :class="{ reverse: side === 'upper' }">
            <div
              @click="openWorkSpace({
                zone: 'bochiCards',
                cards: bochiCards,
                player: player,
              })"
            >
              <span class="small">開く</span>
            </div>
          </div>
          <img v-if="lastCard(bochiCards)" :src="lastCard(bochiCards).imageUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/helpers/mixin.js";

export default {
  props: [
    "player",
    "bochiCards",
    "shieldCards",
    "shieldCardGroups",
    "yamafudaCards",
    "side",
  ],
  mixins: [mixin.zone],
  computed: {
    countableShieldCards() {
      // グループ化されているカードは一つとカウントする。
      const firstCardIds = this.shieldCardGroups.map((g) => g.cardIds[0]);
      return this.shieldCards.filter((c) => {
        return !c.groupId || firstCardIds.includes(c.id);
      });
    },
  },
  methods: {
    lastCard: function (cards) {
      const length = cards.length;
      if (length && 0 < length) {
        return cards[length - 1];
      }
      return null;
    },
    // デッキを開くときはデフォルトで全て裏にする。
    openDeck() {
      this.yamafudaCards.forEach(c => {
        c.faceDown = true
      })
      this.openWorkSpace({
        zone: 'yamafudaCards',
        cards: this.yamafudaCards,
        player: this.player,
      })
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/mixin.scss";
@function cardHeight($value) {
  @return calc($value * 908 / 650);
}
$card-width: 50px;
.player-zone-wrapper {
  .player-zone {
    // background-color: blue;
    display: flex;
    width: 380px;
    > * {
      align-self: center;
    }
    margin-left: 20px;
    &.upper {
      margin-top: 20px;
    }
    &.lower {
      margin-top: 10px;
    }
  }
  .blue-wrapper {
    margin-left: 10px;
    background-color: blue;
    display: flex;
    align-items: center;
    width: 380px;
    > * {
      align-self: center;
    }
  }
  .player-zone img {
    width: 50px;
  }
  .shieldButton {
    align-self: center;
    background-color: blue;
    color: white;
    border-radius: 50%;
    width: 70px;
    height: 50px;
    text-align: center;
    cursor: pointer;
    &_text {
      padding-top: 10px;
      margin: 0px 0 5px;
      font-size: 10px;
    }
    &_count {
    }
  }
  .player-zone .shield-zone {
    width: 275px;
    display: flex;
    flex-direction: row-reverse;
    overflow: scroll;
  }
  .player-zone .shield-zone .shield {
    position: relative;
    margin-right: 5px;
    .shield-num {
      color: whitesmoke;
      position: absolute;
      bottom: 3px;
      right: 5px;
      font-size: 10px;
    }
    .shield-reverse {
      display: block;
      width: 50px;
      height: cardHeight(50px);
      background-color: rgb(79, 205, 255);
    }
  }
  .player-zone .yamafuda-zone {
    width: 60px;
    height: cardHeight(50px);
    text-align: center;
  }

  .yamafuda-zone:hover,
  .bochi:hover,
  .shield-zone .shield:hover {
    .menu-list {
      @include menu-list-hover;
      position: absolute;
    }
  }
  .shield-zone:hover {
    .menu-list {
      top: 0;
    }
  }
  .bochi:hover {
    .menu-list {
      left: 0px;
    }
  }
  .player-counter .shield:hover {
    .shield-info {
      display: none;
    }
    .menu-list {
      @include menu-list-hover;
      position: absolute;
      left: 0px;
      background-color: blue;
      div {
        height: 15px;
        line-height: 15px;
        font-size: 12px;
      }
    }
  }

  .player-zone .bochi {
    position: relative;
    text-align: center;
    width: 60px;
    height: cardHeight(50px);
    background-color: purple;
    margin-left: 5px;
    img {
    }
  }
}
</style>
