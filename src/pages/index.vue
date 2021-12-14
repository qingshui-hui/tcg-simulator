<template>
  <div>
    <div id="app" style="padding: 20px">
      <p>部屋とデッキを選択してください</p>
      <div style="margin-top: 10px;">
        <router-link
          class="send"
          :to="{
            path: '/room',
            query: { roomId: 1, player: 'a' },
          }"
        >room1 プレイヤーA</router-link>
        <router-link
          class="send"
          :to="{
            path: '/room',
            query: { roomId: 1, player: 'b' },
          }"
        >room1 プレイヤーB</router-link>
      </div>
      <div style="margin-top: 10px;">
        <router-link
          class="send"
          :to="{
            path: '/room',
            query: { roomId: 1, player: 'a', deckId: 5 },
          }"
        >room1 プレイヤーA デッキ5</router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.send {
  margin-left: 10px;
}
</style>
