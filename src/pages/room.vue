<template>
  <Room
    :upper-player="upperPlayer"
    :lower-player="lowerPlayer"
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
import { io } from 'socket.io-client'

export default {
  components: { Room },
  data() {
    return {
      upperPlayer: this.$route.query.player === "a" ? "b" : "a",
      lowerPlayer: this.$route.query.player,
      config: config,
      deckList: data.deckList,
      socket: config.development ? null : io(process.env.VUE_APP_WS_HOST),
    };
  },
}
</script>
