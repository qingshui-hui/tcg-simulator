import { server } from './server/app.js'
import './server/socket-io.js'

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`listening on *:${port}`)
})
