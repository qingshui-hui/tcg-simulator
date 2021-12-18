<template>
  <Room
    :upper-player="upperPlayer"
    :lower-player="lowerPlayer"
    :socket="socket"
  ></Room>
</template>

<script>
import Room from '../components/Room.vue';
import { io } from 'socket.io-client'

export default {
  components: { Room },
  beforeRouteLeave (to, from, next) {
    this.socket.emit('leave-room', this.roomId)
    console.log("room" + this.roomId + "から退室しました")
    next()
  },
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
      socket: socket,
    };
  },
  computed: {
    roomId() {
      return this.$route.query.roomId
    }
  },
  created() {
    if (this.socket) {
      // room{Id}チャンネルに接続
      this.socket.emit("room", this.roomId);
      console.log("room" + this.roomId + "に入室しました")
    }
  },
}
</script>
