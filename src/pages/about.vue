<template>
  <div class="markdownWrapper">
    <div style="margin-bottom: 20px;">
      <router-link to="/">戻る</router-link>
    </div>
    <Markdown class="markdown-body" :source="markdown"></Markdown>
  </div>
</template>

<script>
import markdown from "raw-loader!../assets/markdown/about.md";

export default {
  data() {
    return {
      markdown: markdown,
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.querySelectorAll("a").forEach((link) => {
        if (link.href.includes("https://")) {
          link.target = "_blank";
          link.rel = "noopener";
        }
      });
    });
  },
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
