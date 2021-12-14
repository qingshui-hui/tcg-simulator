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
import { io } from 'socket.io-client'

export default {
  components: { Room },
  data() {
    const config = this.useConfig()
    let socket
    if (!config.WS_ENABLED) {
      socket = null
    } else if (process.env.VUE_APP_WS_HOST) {
      socket = io(process.env.VUE_APP_WS_HOST)
    } else {
      socket = io()
    }
    return {
      upperPlayer: this.$route.query.player === "a" ? "b" : "a",
      lowerPlayer: this.$route.query.player,
      config: config,
      deckList: data.deckList,
      socket: socket,
    };
  },
}
</script>
