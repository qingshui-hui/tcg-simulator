<template>
  <Room
    :upper-player="upperPlayer"
    :lower-player="lowerPlayer"
    :config="config"
    :deck-list="deckList"
    :socket="socket"
  ></Room>
</template>

<script>
import { data } from '../helpers/data';
import Room from '../components/Room.vue';
const config = {
  development: false,
}
if (!config.development) {
  // var io = require('socket.io-client')()
}
export default {
  components: { Room },
  data() {
    return {
      upperPlayer: this.$route.query.player === "a" ? "b" : "a",
      lowerPlayer: this.$route.query.player,
      config: config,
      deckList: data.deckList,
      socket: null,
    };
  },
}
</script>
