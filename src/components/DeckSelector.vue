<template>
  <o-modal :active="active" :canCancel="canCansel" @close="onClose" :width="600">
    <div id="deck-form" v-if="!isReady">
      <p class="deckForm_p">デッキを選択してください</p>
      <select name="deck" v-model="deckId">
        <option v-for="(deck, index) in allDecks" :key="index" :value="index">
          {{ deck.name }}
        </option>
      </select>
      <o-button
        @click.stop="selectDeck"
        variant="info"
        size="medium"
        :style="{ marginTop: '20px' }"
        >選択</o-button
      >
      <div :style="{ marginTop: '20px', width: '250px' }">
        <o-field
          :variant="errors.scrapeUrl ? 'danger' : ''"
          :message="scraping ? 'デッキ取得中です' : errors.scrapeUrl"
        >
          <o-input
            v-model="scrapeUrl"
            placeholder="デッキメーカーのURLを貼り付ける"
            type="text"
            icon="search"
            :icon-clickable="!scraping"
            size="small"
            :expanded="true"
            :disabled="scraping"
            @icon-click="scrape"
          >
          </o-input>
        </o-field>
      </div>
    </div>

    <div v-else-if="!partnerIsReady" id="waiting-player">
      <p class="deckForm_p">相手プレイヤーが</p>
      <p class="deckForm_p">デッキを選択するのを待つか、</p>
      <p class="deckForm_p">ウィンドウをもう一つ開いて、</p>
      <p class="deckForm_p">同じ部屋番号の</p>
      <p class="deckForm_p">相手プレイヤーとして、</p>
      <p class="deckForm_p">デッキを選択してください</p>
    </div>
  </o-modal>
</template>

<script>
import { Deck } from "@/helpers/Deck";
import axios from "axios";

export default {
  props: ["isReady", "player", "partnerIsReady", "active"],
  data() {
    return {
      deckId: 0,
      deckList: [],
      scrapeUrl: "",
      scraping: false,
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
    errors() {
      return {
        scrapeUrl: (() => {
          if (this.scrapeUrl) {
            if (
              !this.scrapeUrl.includes("https://gachi-matome.com/deckrecipe-detail-dm")
            ) {
              return "不適切なURLです";
            }
          }
          return "";
        })(),
      };
    },
    allDecks() {
      return [...this.$store.state.decks.data, ...this.deckList];
    },
  },
  mounted() {
    // クエリストリングにdeckIdが存在したときのショートカット。
    if (this.$route.query.deckId) {
      this.deckId = this.$route.query.deckId;
      this.selectDeck();
    }
    // GC Storageからデータを取得する。
    // httpsとhttpの場合でcorsの挙動に差があり、httpの方を利用した。
    const deckUrl = `${this.useConfig().API_HOST}/api/decks`;
    axios
      .get(deckUrl)
      .then((res) => {
        this.deckList = [...this.deckList, ...res.data];
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    selectDeck() {
      const deck = Deck.prepareDeck(
        this.allDecks[this.deckId].cards,
        this.player === "a"
      );

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
    scrape() {
      if (!this.scrapeUrl || this.scraping || this.errors.scrapeUrl) return;
      this.scraping = true;
      const url = `${this.useConfig().API_HOST}/api/scrape?url=${encodeURI(
        this.scrapeUrl
      )}`;
      axios
        .get(url)
        .then((res) => {
          console.log(res);
          this.$store.commit("decks/setData", [
            res.data,
            ...this.$store.state.decks.data,
          ]);
          this.scrapeUrl = "";
          this.scraping = false;
        })
        .catch((err) => {
          this.scraping = false;
          console.log(err);
        });
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
  p.deckForm_p {
    font-size: 20px;
    margin: 20px 0;
  }
}
#waiting-player {
  text-align: center;
  line-height: 30px;
}
</style>
