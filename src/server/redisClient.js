import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL || 'redis://@localhost:6379',
})

const getRoomCache = async (roomId) => {
  await client.connect()
  const room = JSON.parse(await client.get(`json:room:${roomId}`))
  await client.quit()
  return room
}

const setRoomCache = async (roomId, roomData) => {
  await client.connect()
  let room = JSON.parse(await client.get(`json:room:${roomId}`))
  if (!room) {
    room = { a: null, b: null }
  }
  await client.connec
  room[roomData.name] = roomData
  await client.set(`json:room:${roomId}`, JSON.stringify(room))
  client.quit()
}

export {
  client,
  getRoomCache,
  setRoomCache,
}
