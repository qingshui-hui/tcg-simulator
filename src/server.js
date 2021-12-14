const root = __dirname.split('/')
root.pop()
const filepath = root.join('/') + "/dist";


const express = require('express');
const app = express();
app.use(express.static(filepath + "/"))

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

io.on('connection', function (socket) {
  socket.on('room', (roomid) => {
    socket.join('room' + roomid);
    // console.log('room'+roomid+'に入室しました')
  })
  socket.on('cards-moved', (data) => {
    // 送信者を除いく部屋のユーザーに送信。
    socket.to('room' + data.roomId).emit('cards-moved', data);
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
