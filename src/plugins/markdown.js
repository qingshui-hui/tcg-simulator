import Markdown from 'vue3-markdown-it'

export default {
  install: (app) => {
    app.component('Markdown', Markdown)
  }
}
