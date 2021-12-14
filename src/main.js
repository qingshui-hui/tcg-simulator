import { createApp } from 'vue'
import App from './app.vue'

import './assets/scss/reset.css'
import './assets/scss/layout.scss'

const vueApp = createApp(App)

import router from './router'
vueApp.use(router)

// マウント
vueApp.mount('#app')
console.log('VUE_APP_WS_ENABLED', process.env.VUE_APP_WS_ENABLED)
// global properties
vueApp.config.globalProperties.useConfig = () => {
  // クライアント側の環境変数は閲覧可能なため、秘密の情報は使ってはいけない。
  // VUE_APP_が着いているものはクライアント側で使用可能。
  return {
    IMAGE_HOST: process.env.VUE_APP_IMAGE_HOST || 'http://localhost:3000',
    WS_ENABLED: process.env.VUE_APP_WS_ENABLED ? true : false,
  }
}
