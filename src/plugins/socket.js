import { io } from 'socket.io-client'

export default {
  install: (app) => {
    let socket
    // 環境変数がfalseか0ならsocketを使わない。
    if (['false', '0'].includes(process.env.VUE_APP_WS_ENABLED)) {
      socket = null
    } else if (process.env.VUE_APP_WS_HOST) {
      socket = io(process.env.VUE_APP_WS_HOST)
    } else {
      socket = io()
    }
    app.config.globalProperties.$socket = socket
  }
}
