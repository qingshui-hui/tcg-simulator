import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL || "redis://@localhost:6379",
});

const getRoomCache = async (roomId) => {
  try {
    /** @type { import("types").Room) } */
    const room = JSON.parse(await client.get(`json:room:${roomId}`));
    return room;
  } catch (err) {
    if (!client.isOpen) {
      client.connect().catch((err) => {
        console.log(err);
      });
    }
    console.log(err);
  }
};

/**
 * @param {String} roomId
 * @param {import("types").Room} roomData
 */
const setRoomCache = async (roomId, roomData) => {
  // 期限は1時間に設定。
  client
    .multi()
    .set(`json:room:${roomId}`, JSON.stringify(roomData))
    .expire(`json:room:${roomId}`, 24 * 60 * 60)
    .exec()
    .catch((err) => {
      console.log(err);
      if (!client.isOpen) {
        client.connect().catch((err) => {
          console.log(err);
        });
      }
    });
};

export { client, getRoomCache, setRoomCache };
