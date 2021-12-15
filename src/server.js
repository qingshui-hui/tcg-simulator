const root = __dirname.split('/')
root.pop()
const filepath = root.join('/') + "/dist";


const express = require('express');
const app = express();
app.use(express.static(filepath + "/"))

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

app.get('/api/rooms/:roomId', async function (req, res) {
  // dbアダプタを取得
  const db = (await import('./server/db.mjs')).default
  await db.read()
  const data = db.data.rooms[req.params.roomId] || {}
  res.json(data)
})

io.on('connection', function (socket) {
  socket.on('room', (roomid) => {
    socket.join('room' + roomid);
    // console.log('room'+roomid+'に入室しました')
  })
  socket.on('cards-moved', async (data) => {
    // 送信者を除いく部屋のユーザーに送信。
    socket.to('room' + data.roomId).emit('cards-moved', data);
    // dbアダプタを取得
    const db = (await import('./server/db.mjs')).default
    await db.read()
    // data.nameはプレイヤー名
    if (!db.data.rooms[data.roomId]) {
      db.data.rooms[data.roomId] = { a: null, b: null }
    }
    db.data.rooms[data.roomId][data.name] = data
    await db.write()
  })
  socket.on('set-message', (data) => {
    // 部屋の全てのユーザーに送信
    io.in('room' + data.roomId).emit('set-message', data);
  })
  // socket.on('pull-deck', (data) => {
  //     const isPlayerA = data.playerData.name === 'a';
  //     const deck = Deck.getDeckById(data.deckId, isPlayerA);
  //     const playerData = data.playerData;
  //     playerData['cards']['shieldCards'] = deck.slice(0,5);
  //     playerData['cards']['tefudaCards'] = deck.slice(5,10);
  //     playerData['cards']['yamafudaCards'] = deck.slice(10,40);
  //     playerData['isReady'] = true;
  //     io.to('room'+playerData.roomId).emit('cards-moved', playerData);
  // })
  socket.on("disconnect", () => {
    console.log('ソケットの接続が切断されました。')
  });
})

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
})
