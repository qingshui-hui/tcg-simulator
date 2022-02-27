<template>
  <Room
    :upper-player-id="upperPlayer"
    :lower-player-id="lowerPlayer"
    :room-id="roomId"
  ></Room>
</template>

<script>
import Room from '../components/Room.vue';

export default {
  components: { Room },
  beforeRouteLeave (to, from, next) {
    this.$socket.emit('leave-room', this.roomId)
    console.log("room" + this.roomId + "から退室しました")
    next()
  },
  data() {
    return {
      upperPlayer: this.$route.query.player === "a" ? "b" : "a",
      lowerPlayer: this.$route.query.player,
    };
  },
  computed: {
    roomId() {
      return this.$route.query.roomId
    }
  },
  created() {
    if (this.$socket) {
      // room{Id}チャンネルに接続
      this.$socket.emit("room", this.roomId);
      console.log("room" + this.roomId + "に入室しました")
    }
  },
  unmounted() {
    this.$store.commit('resetGame');
  },
}
</script>
