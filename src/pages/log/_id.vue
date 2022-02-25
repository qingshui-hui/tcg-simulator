<template>
  <div>ログページ</div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      logs: [],
    }
  },
  computed: {
    logId() {
      return this.$route.params.id;
    }
  },
  created() {
    axios.get(`/api/logs/${this.logId}`).then(res => {
      console.log(res.data);
      this.logs = res.data;
    })
  }
}
</script>
