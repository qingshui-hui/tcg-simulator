import { Server } from "socket.io";
import { server as appServer } from "./app.js";
import { setLog } from "./db.js";
import { getRoomCache, setRoomCache } from "./redisClient.js";

const socketIoConfig = process.env.CLIENT_ORIGIN
  ? {
      // https://socket.io/docs/v4/handling-cors/
      cors: {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:8080",
        methods: ["GET", "POST"],
      },
    }
  : {};
const io = new Server(socketIoConfig);
io.attach(appServer);
// require('socket.io')(server, socketIoConfig);

io.on("connection", function (socket) {
  socket.on("room", (roomId) => {
    socket.join("room" + roomId);
    // console.log('room'+roomId+'に入室しました')
    console.log(socket.rooms);
  });
  socket.on("leave-room", (roomId) => {
    socket.leave("room" + roomId);
    // console.log(socket.rooms)
  });
  socket.on("cards-moved", async (data) => {
    // 送信者を除いく部屋のユーザーに送信。
    socket.to("room" + data.roomId).emit("cards-moved", data);
    // setRoomCache(data.roomId, data)
  });
  socket.on("add-card-data", async (data) => {
    const room = await getRoomCache(data.roomId);
    if (!room.cardData) {
      room.cardData = {};
    }
    room.cardData = {
      ...room.cardData,
      ...data.cardData,
    };
    setRoomCache(data.roomId, room);
    socket.to("room" + data.roomId).emit("add-card-data", data);
  });
  socket.on("room-history-changed", (data) => {
    socket.to("room" + data.roomId).emit("room-history-changed", data);
    // {
    //   command: 'pushGameHistories',
    //   history: {
    //     id: 'y0LjHpwqbFb3',
    //     from: 'battleCards',
    //     cards: [ [Object] ],
    //     player: 'a',
    //     command: 'changeCardsState',
    //     oldState: { fromCards: [Array], cards: [Array] }
    //   },
    //   roomId: '1'
    // }
  });
  socket.on("save-room-state", (data) => {
    setRoomCache(data.roomId, data);
    // TODO: 開発の場合と本番環境の場合で処理を変える。
    setLog(data.roomId, data);
  });
  socket.on("disconnect", () => {
    console.log("ソケットの接続が切断されました。");
  });
});
