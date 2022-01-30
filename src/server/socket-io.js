import { Server } from 'socket.io';
import { server as appServer } from './app.js'
import db from './db.js'

const socketIoConfig = process.env.CLIENT_ORIGIN ?
  {
    // https://socket.io/docs/v4/handling-cors/
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:8080',
      methods: ["GET", "POST"],
    }
  } : {}
const io = new Server(socketIoConfig)
io.attach(appServer)
// require('socket.io')(server, socketIoConfig);

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
