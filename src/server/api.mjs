import { Router } from 'express'
import deckList from '../helpers/data.js'
import sampleDeckList from '../helpers/data-sample.js'
import db from './db.mjs'
import { useConfig } from '../plugins/useConfig.js'

const router = Router()

router.get('/api/rooms/:roomId', async function (req, res) {
  await db.read()
  const data = db.data.rooms[req.params.roomId] || {}
  res.json(data)
})

import axios from 'axios'
router.get('/api/decks', async function (req, res) {
  // サンプルモードの場合は、サンプルのデッキのみを返す。
  if (useConfig().SAMPLE_MODE) {
    return res.json(sampleDeckList)
  }
  let response
  try {
    response = await axios.get(process.env.DECK_URL)
    res.json([...deckList, ...response.data])
  } catch (error) {
    // ex: Request failed with status code 404
    console.log(error.message)
    res.json(deckList)
  }
})

export default router
