<template>
  <div>
    <div id="app" style="padding: 20px">
      <p>部屋を選択してください</p>
      <div v-for="room in rooms" :key="room.id" style="margin-top: 10px;">
        <router-link
          class="send"
          :to="{
            path: '/room',
            query: { roomId: room.id, player: 'a' },
          }"
        >room{{ room.id }} プレイヤーA</router-link>
        <router-link
          class="send"
          :to="{
            path: '/room',
            query: { roomId: room.id, player: 'b' },
          }"
        >room{{ room.id }} プレイヤーB</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rooms: [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ]
    }
  }
}
</script>

<style lang="scss">
.send {
  margin-left: 10px;
}
</style>
