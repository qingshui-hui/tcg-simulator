
function parseBool(val) {
  if (!val) {
    return false
  }
  if (val === 'false' || val === '0') {
    return false
  }
  return true
}

import { io } from 'socket.io-client'

export default {
  install: (app) => {
    let socket
    if (!parseBool(process.env.VUE_APP_WS_ENABLED)) {
      socket = null
    } else if (process.env.VUE_APP_WS_HOST) {
      socket = io(process.env.VUE_APP_WS_HOST)
    } else {
      socket = io()
    }
    app.config.globalProperties.$socket = socket
  }
}
