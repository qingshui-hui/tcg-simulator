<template>
  <div>
    <div id="app" style="padding: 20px; background-color: white">
      <p>部屋を選択してください</p>
      <table class="roomTable" style="margin-top: 20px">
        <thead>
          <th></th>
          <th><div>プレイヤーA</div></th>
          <th><div>プレイヤーB</div></th>
        </thead>
        <tr v-for="room in rooms" :key="room.id">
          <td>
            <div>部屋{{ room.id }}</div>
          </td>
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
        <tr>
          <td>部屋x</td>
          <td colspan="2">
            <router-link
              :to="{
                path: '/room',
                query: { roomId: randomRoomId(), player: 'a' },
              }"
            >
              <o-button variant="info" size="small">部屋を作る</o-button>
            </router-link>
          </td>
        </tr>
      </table>
      <div class="index_links">
        <p v-if="decks.length > 0">
          <router-link to="/builder">自分のデッキを編集</router-link>
        </p>
        <p><router-link to="/about">このサイトについて</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { makeRandomString } from "@/helpers/makeRandomString";

export default {
  data() {
    return {
      rooms: [{ id: "1" }, { id: "2" }, { id: "3" }],
    };
  },
  computed: {
    decks() {
      return this.$store.state.decks.data;
    },
  },
  methods: {
    randomRoomId() {
      return makeRandomString(4) + "-" + makeRandomString(3);
    },
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
    > * {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
a {
  text-decoration: none;
  color: #000;
  &:hover {
    opacity: 0.8;
  }
}
.index_links {
  margin-top: 2rem;
  * + * {
    margin-top: 1rem;
  }
}
</style>
