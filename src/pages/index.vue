<template>
  <div>
    <div id="app" style="padding: 20px">
      <p>部屋を選択してください</p>
      <table class="roomTable" style="margin-top: 20px">
        <thead>
          <th></th>
          <th>プレイヤーA</th>
          <th>プレイヤーB</th>
        </thead>
        <tr v-for="room in rooms" :key="room.id">
          <td>部屋{{ room.id }}</td>
          <td>
            <router-link
              :to="{
                path: '/room',
                query: { roomId: room.id, player: 'a' },
              }"
            >
              <o-button variant="info" size="small"> {{ room.id }}-A</o-button>
            </router-link>
          </td>
          <td>
            <router-link
              :to="{
                path: '/room',
                query: { roomId: room.id, player: 'b' },
              }"
            >
              <o-button variant="info" size="small"> {{ room.id }}-B</o-button>
            </router-link>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rooms: [{ id: "1" }, { id: "2" }, { id: "3" }],
    };
  },
};
</script>

<style lang="scss" scoped>
.send {
  margin-left: 10px;
}
.roomTable {
  border-collapse: collapse;
  th,
  td {
    border: 1px solid darkgray;
    padding: 5px 10px;
  }
}
a {
  text-decoration: none;
}
</style>
