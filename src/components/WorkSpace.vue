<template>
  <div v-if="workSpace.active">
    <div class="workSpace" :class="[{
      workSpace__minimum: workSpace.minimum
    }]">
      <o-icon
        class="minButton"
        :class="[{minButton__expand: workSpace.minimum}]"
        pack="fas"
        :icon="workSpace.minimum ? 'expand-alt' : 'minus-circle'"
        size="medium"
        @click="workSpace.minimum = !workSpace.minimum"
      ></o-icon>
      <o-icon
        v-if="!workSpace.minimum"
        class="closeButton"
        pack="far"
        icon="times-circle"
        size="large"
        @click="closeWorkSpace"
      ></o-icon>
      <!-- position absoluteで下につける -->
      <div class="bottomMenu" v-if="this.player === this.lowerPlayer">
        <div class="bottomMenu__overlay">
          <!-- single actions -->
          <template v-if="['battleCards'].includes(workSpace.zone) && workSpace.single">
            <o-button
              v-if="!workSpace.cards[0].tapped"
              class="bottomMenu__action"
              variant="primary"
              size="medium"
              @click="tapAllCards"
            >タップする</o-button>
            <o-button
              v-else
              class="bottomMenu__action"
              variant="primary"
              size="medium"
              @click="untapAllCards"
            >アンタップする</o-button>
          </template>
          <o-button
            v-if="['shieldCards'].includes(workSpace.zone) && workSpace.single"
            class="bottomMenu__action"
            variant="primary"
            size="large"
            @click="moveCard(orderedCards[0], 'tefudaCards')"
          >手札へ</o-button>
        </div>
      </div>
      <div class="workSpace_inner">
        <div class="workSpace_top">
          <div class="workSpace_top_1">
            <!-- ゾーン名をクリックしたときにも閉じる。 -->
            <o-button variant="grey-dark" outlined @click="closeWorkSpace">{{ zoneName }}</o-button>
            <template v-if="['manaCards', 'battleCards'].includes(workSpace.zone)">
              <o-button
                v-if="!workSpace.single"
                @click="untapAllCards"
              >全てアンタップする</o-button>
              <o-button
                v-else-if="workSpace.cards.length === 1"
                @click="startSelectMode"
              >重ねる</o-button>
            </template>
            <o-button
              v-if="['yamafudaCards'].includes(workSpace.zone) && !workSpace.single"
              @click="shuffleCards('yamafudaCards', workSpace.cards)"
            >シャッフル</o-button>
          </div>
        </div>
        <div class="workSpace_cardList gridCardList">
          <div v-for="(card, index) in orderedCards" :key="index">
            <Dropdown class="dropdown">
              <template #trigger>
                <div class="card with-info" :class="{ tapped: card.tapped }">
                  <o-icon
                    v-if="false"
                    class="card_checkedIcon"
                    pack="fas"
                    icon="check-circle"
                    size="medium"
                    variant="info"
                    :style="[{ position: 'absolute', top: '-5px', right: '0px', zIndex: '1' }]"
                  ></o-icon>
                  <span class="card-id card-info" v-if="card.groupId">{{ card.groupId }}</span>
                  <div>
                    <!-- ワークスペース内だけでみられる状態がある -->
                    <img
                      src="@/assets/images/card-back.jpg"
                      v-if="card.faceDown === true && !card.showInWorkSpace"
                    />
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
            <div class="card_bottomButton">
              <!-- 裏向きのカードを見るボタン -->
              <o-button
                v-if="card.faceDown && !card.showInWorkSpace"
                @click="card.showInWorkSpace = true"
              >見る</o-button>

              <!-- ショートカット -->
              <template v-else-if="['tefudaCards'].includes(workSpace.zone)">
                <o-button @click="moveCard(card, 'battleCards')">出す</o-button>
                <o-button @click="moveCard(card, 'manaCards')">マナ</o-button>
              </template>
              <o-button
                v-else-if="['bochiCards'].includes(workSpace.zone)"
                @click="moveCard(card, 'tefudaCards')"
              >手札へ</o-button>
              <template v-else-if="['manaCards'].includes(workSpace.zone)">
                <o-button v-if="!card.tapped" @click="card.tapped = true">タップ</o-button>
                <o-button v-else @click="card.tapped = false">アンタップ</o-button>
              </template>
            </div>
          </div>
        </div>
        <!-- 全て〇〇する系 -->
        <template v-if="!workSpace.single">
          <o-button
            v-if="['yamafudaCards', 'shieldCards'].includes(workSpace.zone)"
            @click="openAllCards"
          >全て見る</o-button>
          <o-button
            v-if="['manaCards', 'battleCards'].includes(workSpace.zone)"
            @click="tapAllCards"
          >全てタップする</o-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '../helpers/mixin.js'
import Dropdown from "./dropdown/Dropdown.vue";

export default {
  components: { Dropdown },
  mixins: [mixin.zone],
  props: ['lowerPlayer'],
  computed: {
    player() {
      return this.$store.state.workSpace.player;
    },
    orderedCards() {
      if (this.workSpace.zone === 'manaCards') {
        const tappedCards = this.workSpace.cards.filter(c => c.tapped)
        const untappedCards = this.workSpace.cards.filter(c => !c.tapped)
        return [...untappedCards, ...tappedCards]
      }
      // 相手の裏向きのカードは表示しないようにする。
      if (this.player !== this.lowerPlayer) {
        return this.workSpace.cards.filter(c => !c.faceDown)
      }
      return this.workSpace.cards
    },
    zoneName() {
      const map = {
        manaCards: 'マナゾーン',
        battleCards: 'フィールド',
        bochiCards: '墓地',
        shieldCards: 'シールドゾーン',
        tefudaCards: '手札',
        yamafudaCards: '山札',
      }
      if (Object.keys(map).includes(this.workSpace.zone)) {
        return map[this.workSpace.zone]
      }
      return ''
    },
  },
  watch: {
    // ワークスペースが開いている間は背景を薄くする。
    // ホバーで画像拡大はできるようにする。
    workSpace(newVal, oldVal) {
      // 開いたとき
      if (newVal.active) {
        document.querySelector('#js_gameBoard').style.opacity = 0.8
        // 閉じたとき
      } else {
        document.querySelector('#js_gameBoard').style.opacity = 1
        oldVal.cards.forEach(c => {
          c.showInWorkSpace = false
        })
        // セレクトモードをオフにする。
        this.setSelectMode(false)
      }
    },
  },
  methods: {
    openCard(card) {
      card.faceDown = !card.faceDown;
      this.$forceUpdate();
    },
    openAllCards() {
      // 山札とシールドでしか使わない想定
      this.workSpace.cards.forEach(c => {
        c.showInWorkSpace = true
      })
    },
    untapAllCards() {
      this.workSpace.cards.forEach(c => {
        c.tapped = false
      })
      this.closeWorkSpace()
    },
    tapAllCards() {
      this.workSpace.cards.forEach(c => {
        c.tapped = true
      })
      this.closeWorkSpace()
    },
    // 操作したプレイヤーだけが見ることができる。
    // カードを裏返すのとは違う。
    showAllInWorkSpace() {
      this.workSpace.cards.forEach(c => {
        c.showInWorkSpace = true
      })
    },
    moveCard(card, to, prepend = false) {
      // ワークスペースから移動したカードを消す。
      this.openWorkSpace({
        ...this.workSpace,
        cards: this.workSpace.cards.filter(c => c.id !== card.id),
      })
      const from = this.workSpace.zone;
      // 見られる状態を解除
      card.showInWorkSpace = false
      // バトルゾーン以外からシールドへ移動するときは裏向きにする。
      if (to === 'shieldCards' && from !== 'battleCards') {
        card.faceDown = true
      }
      this.$emit('move-cards', from, to, [card], this.workSpace.player, prepend);
      // カードが0枚になったらワークスペースを閉じる。
      if (this.workSpace.cards.length === 0) {
        this.closeWorkSpace()
      }
    },
    shuffleCards(from, cards) {
      this.$emit('shuffle-cards', from, cards, this.player)
      this.closeWorkSpace()
    },
    startSelectMode() {
      if (!this.selectMode) {
        this.setSelectMode(true)
        this.workSpace.minimum = true
      } else {
        this.setSelectMode(false)
      }
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
  max-width: 700px; // 800 - margin-left
  @media screen and (max-device-width: 700px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  > * {
    // flex-shrink: 0;
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
  top: 10%;
  margin-left: 10px;
  max-width: 600px;
  z-index: 10;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  @media screen and (max-device-width: 700px) {
    margin: 0;
  }
  &__minimum {
    .workSpace_inner {
      max-width: 100px;
      max-height: 100px;
      overflow-y: scroll;
    }
    .bottomMenu {
      display: none;
    }
  }
  &_inner {
    // height: 60vh;
    max-height: 60vh;
    overflow-y: scroll;
    @media screen and (max-device-width: 700px) {
      margin: 0;
      max-width: 100vw;
      overflow-x: scroll;
    }
  }
  .closeButton {
    position: absolute;
    z-index: 1;
    right: 0px;
    top: 0px;
    transform: translateY(-100%);
    background-color: #fff;
    border-radius: 50%;
  }
  .minButton {
    position: absolute;
    z-index: 1;
    right: 72px; // 48 + 24
    top: 0;
    transform: translateY(-48px);
    background-color: #fff;
    border-radius: 50%;
    &__expand {
      width: 40px;
      height: 40px;
      right: 0;
      color: white;
      background-color: black;
    }
  }
  &_top_1 {
    display: flex;
    align-items: center;
  }
  &_cardList {
    margin-top: 10px;
  }
  .card {
    position: relative;
    img {
      width: $card-width;
    }
    &_checkedIcon {
      background-color: #fff;
      border-radius: 50%;
    }
    &_bottomButton {
      display: flex;
      justify-content: center;
    }
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
    // padding: 12px 10px;
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
</style>
