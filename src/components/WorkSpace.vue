<template>
  <div v-if="workSpace.active">
    <div class="workSpace">
      <o-icon
        class="closeButton"
        pack="far"
        icon="times-circle"
        size="large"
        @click="closeWorkSpace"
      ></o-icon>
      <!-- position absoluteで下につける -->
      <div class="bottomMenu">
        <div class="bottomMenu__overlay">
          <o-button class="bottomMenu__action" variant="primary" size="large" @click="action">タップする</o-button>
        </div>
      </div>
      <div class="workSpace_inner">
        <div class="workSpace_top">
          <div class="workSpace_top_1">
            <o-button variant="grey-dark" outlined disabled>{{ workSpace.zone }}</o-button>
            <o-button v-if="['manaCards', 'battleCards'].includes(workSpace.zone)" @click="untapAllCards">全てアンタップする</o-button>
          </div>
          <div class="workSpace_top_2">
            <o-select v-model="manaZoneMode">
              <option value="1">タップするカードを選択</option>
              <option value="2">個別に操作する</option>
            </o-select>
          </div>
        </div>
        <div class="workSpace_cardList gridCardList">
          <Dropdown v-for="(card, index) in orderedCards" :key="index" class="dropdown">
            <template #trigger>
              <div class="card with-info" :class="{ tapped: card.tapped }">
                <o-icon
                  v-if="card.selected"
                  class="card_checkedIcon"
                  pack="fas"
                  icon="check-circle"
                  size="medium"
                  variant="info"
                  :style="[{ position: 'absolute', top: '-5px', right: '0px', zIndex: '1' }]"
                ></o-icon>
                <span class="card-id card-info" v-if="card.groupId">{{ card.groupId }}</span>
                <div @click="clickCard(card)">
                  <img src="@/assets/images/card-back.jpg" v-if="card.faceDown === true" />
                  <img :src="card.imageUrl" v-else />
                </div>
              </div>
            </template>
            <o-dropdown-item>
              <span class="drop-item-2" @click="moveCard(card, 'battleCards')">出す</span>
              <span class="drop-item-2" @click="moveCard(card, 'tefudaCards')">手札へ</span>
            </o-dropdown-item>
            <o-dropdown-item>
              <span class="drop-item-2" @click="moveCard(card, 'yamafudaCards', true)">山札の上へ</span>
              <span class="drop-item-2" @click="moveCard(card, 'yamafudaCards')">/ 下へ</span>
            </o-dropdown-item>
            <o-dropdown-item>
              <span class="drop-item-2" @click="moveCard(card, 'shieldCards')">シールドへ</span>
              <span class="drop-item-2" @click="openCard(card)">裏返す</span>
            </o-dropdown-item>
            <o-dropdown-item>
              <span class="drop-item-2" @click="moveCard(card, 'manaCards')">マナ</span>
              <span class="drop-item-2" @click="moveCard(card, 'bochiCards')">墓地へ</span>
            </o-dropdown-item>
          </Dropdown>
        </div>
        <o-button v-if="workSpace.zone === 'yamafudaCards'" @click="openAllCards">全て表にする</o-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Dropdown from "./dropdown/Dropdown.vue";

export default {
  components: { Dropdown },
  computed: {
    workSpace() {
      return this.$store.state.workSpace
    },
    player() {
      return this.$store.state.workSpace.player;
    },
    orderedCards() {
      if (this.workSpace.zone === 'manaCards') {
        const tappedCards = this.workSpace.cards.filter(c => c.tapped)
        const untappedCards = this.workSpace.cards.filter(c => !c.tapped)
        return [...untappedCards, ...tappedCards]
      }
      return this.workSpace.cards
    },
  },
  watch: {
    // ワークスペースが開いている間は背景を薄くする。
    // ホバーで画像拡大はできるようにする。
    workSpace(newVal) {
      if (newVal.active) {
        document.querySelector('#js_gameBoard').style.opacity = 0.8
      } else {
        document.querySelector('#js_gameBoard').style.opacity = 1
      }
    },
  },
  methods: {
    ...mapMutations(['closeWorkSpace', 'openWorkSpace']),
    clickCard(card) {
      if (this.workSpace.zone === 'manaCards') {
        card.selected = !card.selected
      }
    },
    openCard(card) {
      card.faceDown = !card.faceDown;
      this.$forceUpdate();
    },
    openAllCards() {
      this.workSpace.cards.forEach(c => {
        c.faceDown = false
      })
    },
    untapAllCards() {
      this.workSpace.cards.forEach(c => {
        c.tapped = false
      })
    },
    moveCard(card, to, prepend = false) {
      // ワークスペースから移動したカードを消す。
      this.openWorkSpace({
        ...this.workSpace,
        cards: this.workSpace.cards.filter(c => c.id !== card.id),
      })
      const from = this.workSpace.zone;
      // 選択は解除
      card.selected = false
      // バトルゾーン以外からシールドへ移動するときは裏向きにする。
      if (to === 'shieldCards' && from !== 'battleCards') {
        card.faceDown = true
      }
      this.$emit('move-cards', from, to, [card], this.workSpace.player, prepend);
    },
    action() {
      const selectedCards = this.workSpace.cards.filter(c => c.selected)
      selectedCards.forEach(c => {
        c.selected = false
        c.tapped = true
      })
      this.closeWorkSpace()
    },
  }
}
</script>

<style lang="scss">
@function cardHeight($value) {
  @return calc($value * 908 / 650);
}
$card-width: 120px;
.gridCardList {
  // スクロールをしないUIに変更
  display: flex;
  flex-wrap: wrap;
  // overflow-x: scroll;
  // height: cardHeight($card-width);
  max-width: 700px; // 800 - margin-left
  > * {
    flex-shrink: 0;
    margin: 0 10px 10px 0;
  }
  .card {
    &.tapped {
      // 回転中心が左下の時ちょうど、回転後の位置がx軸方向について中心になる。
      // あとはtranslateXでy座標を調整する。
      transform: rotate(-90deg) translateX(100%);
      transform-origin: right bottom;
      width: cardHeight($card-width);
      // .o-drop__menu {
      //   z-index: 2;
      //   transform: rotate(90deg) translateY(100%) translateX(-175%);
      //   transform-origin: left bottom;
      // }
    }
  }
}
.workSpace {
  position: fixed;
  top: 10vh;
  left: 10px;
  max-width: 600px;
  z-index: 10;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  &_inner {
    height: 60vh;
    overflow-y: scroll;
  }
  .closeButton {
    position: absolute;
    right: 0;
    top: -20px;
    background-color: #fff;
    border-radius: 50%;
  }
  &_top_1 {
    display: flex;
    align-items: center;
  }
  &_cardList {
    margin-top: 10px;
    display: flex;
  }
  .card {
    position: relative;
    img {
      width: $card-width;
    }
  }
  .card_checkedIcon {
    background-color: #fff;
    border-radius: 50%;
  }
  .card-info {
    background-color: black;
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 12px;
    font-weight: bold;
    color: beige;
  }
  .o-drop__item {
    display: flex;
    justify-content: space-between;
  }
  .drop-item-2 {
    display: inline-block;
    &:not(:first-child) {
      margin-left: auto;
    }
    &:hover {
      background-color: lightgray;
    }
  }
}
.bottomMenu {
  position: absolute;
  z-index: 10;
  left: 0;
  bottom: 0;
  width: fit-content;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  &__overlay {
    padding: 12px 10px;
    background-color: rgba(0, 0, 0, 0.35);
    display: flex;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    justify-content: center;
  }
  &__action {
    align-self: center;
  }
}
#work-space {
  .card:hover {
    .menu-list {
      position: absolute;
      left: 0px;
      top: 20px;
      display: unset;
      background-color: black;
      div {
        border: lightgray 1px solid;
        color: whitesmoke;
      }
      div span.click:hover {
        color: orange;
        cursor: pointer;
      }
    }
  }
  .card {
    position: relative;
  }
}
</style>
