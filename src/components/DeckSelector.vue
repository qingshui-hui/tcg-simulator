<template>
  <o-modal :active="active" :canCancel="canCansel" @close="onClose" :width="600">
    <div id="deck-form" v-if="!isReady">
      <p>デッキを選択してください</p>
      <select name="deck" v-model="deckId">
        <option v-for="(value, deckId) in deckList" :key="deckId" :value="deckId">
          {{ value.name }}
        </option>
      </select>
      <o-button
        @click.stop="selectDeck"
        variant="info"
        size="medium"
        :style="{ marginTop: '20px' }"
        >選択</o-button
      >
    </div>

    <div v-else-if="!partnerIsReady" id="waiting-player">
      <p>相手プレイヤーが</p>
      <p>デッキを選択するのを待つか、</p>
      <p>ウィンドウをもう一つ開いて、</p>
      <p>同じ部屋番号の</p>
      <p>相手プレイヤーとして、</p>
      <p>デッキを選択してください</p>
      <!-- <o-button
        variant="info"
        size="medium"
        :style="{ marginTop: '20px' }"
        tag="a"
        :href="tabUrl"
        target="_blank"
      >
        <span>タブを開く</span>
        <o-icon
          pack="fas"
          icon="external-link-alt"
          :style="{ marginLeft: '10px' }"
        ></o-icon>
      </o-button> -->
    </div>
  </o-modal>
</template>

<script>
import { data } from "@/helpers/data";
import { Deck } from "@/helpers/Deck";

export default {
  props: ["isReady", "player", "partnerIsReady", "active"],
  data() {
    const deckList = data.deckList;
    return {
      deckId: Object.keys(deckList)[0],
      deckList,
    };
  },
  computed: {
    canCansel() {
      return this.isReady;
    },
    tabUrl() {
      // 相手プレイヤーのルームのURL
      const roomId = this.$route.query.roomId;
      const player = this.$route.query.player;
      return encodeURI(`/room?roomId=${roomId}&player=${player == "a" ? "b" : "a"}`);
    },
  },
  mounted() {
    // クエリストリングにdeckIdが存在したときのショートカット。
    if (this.$route.query.deckId) {
      this.deckId = this.$route.query.deckId;
      this.selectDeck();
    }
  },
  methods: {
    selectDeck() {
      const config = this.useConfig();
      const deck = Deck.getDeckById(config.IMAGE_HOST, this.deckId, this.player === "a");

      // fromのカードは存在しなくても良いため、仮にyamafudaCardsにしている。
      const shieldCards = deck.slice(0, 5);
      shieldCards.forEach((c) => {
        c.faceDown = true;
      });
      this.$emit("move-cards", "yamafudaCards", "shieldCards", shieldCards, this.player);
      this.$emit(
        "move-cards",
        "yamafudaCards",
        "tefudaCards",
        deck.slice(5, 10),
        this.player
      );
      const yamafudaCards = deck.slice(10, 40);
      yamafudaCards.forEach((c) => {
        c.faceDown = true;
      });
      this.$emit(
        "move-cards",
        "yamafudaCards",
        "yamafudaCards",
        yamafudaCards,
        this.player
      );
      this.$emit("selected", true);
      if (this.partnerIsReady) {
        this.$emit("update:active", false);
      }
    },
    onClose() {
      this.$emit("update:active", false);
    },
  },
};
</script>

<style lang="scss">
#deck-form {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    display: block;
  }
  p {
    font-size: 20px;
    margin: 20px 0;
  }
}
#waiting-player {
  text-align: center;
  line-height: 30px;
}
</style>
