// これによりほぼcjsの構文で、部分的にejsのimportが使える。
import { createRequire } from 'module'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
// 1階層上がルートディレクトリ
const root = __dirname.split('/').slice(0, -1).join('/')
const filepath = root + '/dist'

const express = require('express');
const app = express();
app.use(express.static(filepath))

// cors
if (process.env.CLIENT_ORIGIN) {
  const cors = require('cors')
  // 全てのクロスオリジンリクエストを許可する。
  app.use(cors())
}

const server = require('http').createServer(app);

const socketIoConfig = process.env.CLIENT_ORIGIN ?
  {
    // https://socket.io/docs/v4/handling-cors/
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:8080',
      methods: ["GET", "POST"],
    }
  } : {}
const io = require('socket.io')(server, socketIoConfig);

app.get('/', function (req, res) {
  res.sendFile(filepath + '/index.html');
});
// /roomへの直接アクセスを許可する。
app.get('/room', function (req, res) {
  res.sendFile(filepath + '/index.html');
});

import apiRouter from './server/api.mjs'
import db from './server/db.mjs'
app.use(apiRouter)

io.on('connection', function (socket) {
  socket.on('room', (roomId) => {
    socket.join('room' + roomId);
    // console.log('room'+roomId+'に入室しました')
    console.log(socket.rooms)
  })
  socket.on('leave-room', (roomId) => {
    socket.leave('room' + roomId)
    // console.log(socket.rooms)
  })
  socket.on('cards-moved', async (data) => {
    // 送信者を除いく部屋のユーザーに送信。
    socket.to('room' + data.roomId).emit('cards-moved', data);
    console.log(`cards-moved room${data.roomId}`)
    // dbアダプタを取得
    await db.read()
    // data.nameはプレイヤー名
    if (!db.data.rooms[data.roomId]) {
      db.data.rooms[data.roomId] = { a: null, b: null }
    }
    db.data.rooms[data.roomId][data.name] = data
    await db.write()
    console.log(`stored-data room${data.roomId}`)
  })
  socket.on('set-message', (data) => {
    console.log(data)
    // 部屋の全てのユーザーに送信
    // io.in('room' + data.roomId).emit('set-message', data);
  })
  socket.on("disconnect", () => {
    console.log('ソケットの接続が切断されました。')
  });
})

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
})
