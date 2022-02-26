<template>
  <LogPage v-if="!loading" :log="log" :upper-player-id="'b'" :lower-player-id="'a'" :room-id="logId"></LogPage>
  <div>ログページ</div>
</template>

<script>
import axios from "axios";
import LogPage from "../../components/log/LogPage.vue";

export default {
  components: { LogPage },
  data() {
    return {
      log: {
        players: {
          a: {},
          b: {},
        },
        gameHistories: [],
      },
      loading: true,
    };
  },
  computed: {
    logId() {
      return this.$route.params.id;
    }
  },
  created() {
    axios.get(`/api/logs/${this.logId}`).then(res => {
      console.log(res.data);
      this.log = res.data;
      this.loading = false;
    });
  },
}
</script>
