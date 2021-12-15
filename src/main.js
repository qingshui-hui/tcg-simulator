import { createApp } from 'vue'
import App from './app.vue'

import './assets/scss/reset.css'
import './assets/scss/layout.scss'

const vueApp = createApp(App)

// vue router
import router from './router'
vueApp.use(router)

// vuex
import store from './store'
vueApp.use(store)

// マウント
vueApp.mount('#app')
// global properties
function parseBool(val) {
  if (!val) {
    return false
  }
  if (val === 'false' || val === '0') {
    return false
  }
  return true
}
vueApp.config.globalProperties.useConfig = () => {
  // クライアント側の環境変数は閲覧可能なため、秘密の情報は使ってはいけない。
  // VUE_APP_が着いているものはクライアント側で使用可能。
  return {
    IMAGE_HOST: process.env.VUE_APP_IMAGE_HOST || 'http://localhost:3000',
    WS_ENABLED: parseBool(process.env.VUE_APP_WS_ENABLED || true),
    // WebSocketのホストとapiのホストは同一の設計にしている。
    API_HOST: process.env.VUE_APP_WS_HOST || '',
  }
}

// axios
import axios from 'axios'
if (process.env.VUE_APP_WS_HOST) {
  axios.defaults.baseURL = process.env.VUE_APP_WS_HOST
}

