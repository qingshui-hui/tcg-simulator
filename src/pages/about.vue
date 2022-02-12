<template>
  <div class="markdownWrapper">
    <div style="margin-bottom: 20px">
      <router-link to="/">戻る</router-link>
    </div>
    <div v-html="compiledMarkdown" class="markdown-body"></div>
  </div>
</template>

<script>
import markdown from "raw-loader!../assets/markdown/about.md";
import { richmd } from "richmd"
import 'richmd/richmd.css'

export default {
  data() {
    return {
      markdown: markdown,
    };
  },
  created() {
    this.$store.commit("setting/set", {
      readAbout: true,
    });
  },
  computed: {
    compiledMarkdown () {
      return richmd(this.markdown)
    }
  }
};
</script>

<style lang="scss">
.markdownWrapper {
  ul,
  ol {
    list-style: initial;
  }
  max-width: 800px;
  padding: 20px 10px;
  @media screen and (min-device-width: 800px) {
    padding: 20px 40px;
  }
}
</style>
