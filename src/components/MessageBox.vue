<template>
  <div class="message-box">
    <div class="upper" v-if="message[upperPlayer]['message']">
      <span>{{ message[upperPlayer]["message"] }}</span>
    </div>
    <div class="lower" v-if="message[lowerPlayer]['message']">
      <span>{{ message[lowerPlayer]["message"] }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['upperPlayer', 'lowerPlayer']
}
</script>

<script setup>
const message = useMessage()

// messageはいろいろな場所で変更され得るから、
// ここでwatchすると、vuexのwatchと同じような処理になる。
watch(message.value, (newValue) => {
  // 3秒後にメッセージを消す。
  const targetId = newValue.increment
  setTimeout(() => {
    if (message.value['a']["id"] === targetId) {
      message.value['a']["message"] = "";
    }
    if (message.value['b']["id"] === targetId) {
      message.value['b']["message"] = "";
    }
  }, 3000);
})
</script>
