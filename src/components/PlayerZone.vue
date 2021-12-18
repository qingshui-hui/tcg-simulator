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
      <div class="blue-wrapper" :class="side">
        <!-- シールドゾーン -->
        <slot name="shield-zone"></slot>
        <!-- デッキゾーン -->
        <slot name="deck-zone"></slot>

        <Dropdown :triggers="dropdownTriggers">
          <template v-slot:trigger>
            <div class="bochi">
              <img v-if="lastCard(bochiCards)" :src="lastCard(bochiCards).imageUrl" />
            </div>
          </template>
          <o-dropdown-item
            aria-role="listitem"
            @click="openWorkSpace({
              zone: 'bochiCards',
              cards: bochiCards,
              player: player,
            })"
          >開く</o-dropdown-item>
        </Dropdown>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint vue/no-deprecated-slot-attribute: 0 */
/* eslint vue/no-deprecated-slot-scope-attribute: 0 */
import mixin from "@/helpers/mixin.js";
import Dropdown from "./dropdown/Dropdown.vue";

export default {
  props: [
    "player",
    "bochiCards",
    "shieldCards",
    "shieldCardGroups",
    "side",
  ],
  mixins: [mixin.zone],
  components: { Dropdown },
  computed: {
    countableShieldCards() {
      // グループ化されているカードは一つとカウントする。
      const firstCardIds = this.shieldCardGroups.map((g) => g.cardIds[0]);
      return this.shieldCards.filter((c) => {
        return !c.groupId || firstCardIds.includes(c.id);
      });
    },
    dropdownTriggers() {
      return this.$store.state.settings.dropdownTriggers
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
    &.upper {
      flex-direction: row-reverse;
      .bochi {
        transform: rotate(180deg);
      }
    }
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
