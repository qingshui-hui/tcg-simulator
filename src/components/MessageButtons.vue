<template>
  <div class="message-buttons">
    <div class="click" @click="setMessage('ターンエンド', player)">
      <span>ターンエンド</span>
    </div>
    <div class="click" @click="setMessage('不具合が...', player)">
      <span>不具合が...</span>
    </div>
    <div class="click" @click="setMessage('参りました', player)">
      <span>参りました</span>
    </div>
    <div class="click" @click="setMessage('', player)">
      <span>削除</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['player'],
}
</script>
<script setup>
// setMessageStateをそのままtemplateで使うとエラーになった。
const setMessage = setMessageState
</script>
