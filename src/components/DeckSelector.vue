<template>
  <div id="deck-form" v-if="!isReady">
    <p>デッキを選択してください</p>
    <select name="deck" v-model="deckId">
      <option v-for="(value, deckId) in deckList" :key="deckId" :value="deckId">{{ value.name }}</option>
    </select>
    <button @click="selectDeck">選択</button>
  </div>

  <div v-else-if="!partnerIsReady" id="waiting-player">
    <span>相手プレイヤーが</span>
    <br />
    <span>デッキを選択するのを待つか、</span>
    <br />
    <span>ウィンドウをもう一つ開いて、</span>
    <br />
    <span>同じ部屋番号の</span>
    <br />
    <span>相手プレイヤーとして、</span>
    <br />
    <span>デッキを選択してください</span>
    <br />
  </div>
</template>

<script>
import { data } from '@/helpers/data';
import { Deck } from '@/helpers/Deck'

export default {
  props: ['isReady', 'player', 'partnerIsReady'],
  data() {
    const deckList = data.deckList
    return {
      deckId: Object.keys(deckList)[0],
      deckList,
    }
  },
  mounted() {
    // クエリストリングにdeckIdが存在したときのショートカット。
    if (this.$route.query.deckId) {
      this.deckId = this.$route.query.deckId
      this.selectDeck()
    }
  },
  methods: {
    selectDeck() {
      const config = this.useConfig()
      const deck = Deck.getDeckById(config.IMAGE_HOST, this.deckId, this.player === "a");

      // fromのカードは存在しなくても良いため、仮にyamafudaCardsにしている。
      this.$emit('move-cards', 'yamafudaCards', 'shieldCards', deck.slice(0, 5), this.player);
      this.$emit('move-cards', 'yamafudaCards', 'tefudaCards', deck.slice(5, 10), this.player);
      this.$emit('move-cards', 'yamafudaCards', 'yamafudaCards', deck.slice(10, 40), this.player);
      this.$emit('selected', true)
    },
  },
}
</script>

<style lang="scss">
#deck-form {
  position: absolute;
  text-align: center;
  width: 300px;
  height: 150px;
  top: 200px;
  left: 200px;
  border-radius: 20px;
  background-color: aqua;
  p {
    font-size: 20px;
    margin: 20px 0;
  }
}
#waiting-player {
  position: absolute;
  text-align: center;
  width: 300px;
  top: 200px;
  left: 200px;
  border-radius: 20px;
  background-color: lightgreen;
  line-height: 30px;
}
</style>
