import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL || 'redis://@localhost:6379',
})

const getRoomCache = async (roomId) => {
  const room = JSON.parse(await client.get(`json:room:${roomId}`))
  return room
}

const setRoomCache = async (roomId, roomData) => {
  let room = JSON.parse(await client.get(`json:room:${roomId}`))
  if (!room) {
    room = { a: null, b: null }
  }
  await client.connec
  room[roomData.name] = roomData
  await client.set(`json:room:${roomId}`, JSON.stringify(room))
}

export {
  client,
  getRoomCache,
  setRoomCache,
}
