import { Router } from 'express'
import { data } from '../helpers/data.js'
import db from './db.mjs'

const router = Router()

router.get('/api/rooms/:roomId', async function (req, res) {
  await db.read()
  const data = db.data.rooms[req.params.roomId] || {}
  res.json(data)
})

router.get('/api/decks', async function (req, res) {
  // dbアダプタを取得
  // const data = require('./data')
  // const data = (await import('../helpers/data.js')).data
  res.json(data.deckList)
})

export default router
