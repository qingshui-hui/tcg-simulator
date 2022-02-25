<template>
  <div>
    <div v-for="log in logs" :key="log.id">
      <router-link :to="`/log/${log.id}`">
        <o-button>{{ log.id }}</o-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      logs: [],
    }
  },
  created() {
    axios.get("/api/logs").then(res => {
      console.log(res.data);
      this.logs = res.data;
    })
  }
}
</script>
