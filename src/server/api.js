import { Router } from 'express'
import deckList from '../helpers/data.js'
import sampleDeckList from '../helpers/data-sample.js'
import db from './db.js'
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

// https://elements.heroku.com/buildpacks/playwright-community/heroku-playwright-buildpack
// 特定のブラウザのみに対応するplaywrightを使用。
import { chromium } from 'playwright-chromium'

router.get('/api/scrape', async (req, res) => {
  const browser = await chromium.launch({
    // headless: false // setting this to true will not run the UI
  });

  const page = await browser.newPage();
  await page.goto(req.query.url);
  // たまに0件になるため、クリックで待つ。
  await page.locator('.deck-area-gachimatome [data-toggle=modal]').first().click()

  // https://playwright.dev/docs/api/class-locator#locator-element-handles
  // https://github.com/microsoft/playwright/issues/10648
  // Is there way to iterate the Locator elements?
  const cardImgsLocator = page.locator('.deck-area-gachimatome .modal-body img')

  const cardImgsCount = await cardImgsLocator.count()
  console.log(`cardImgsCount: ${cardImgsCount}`)

  const deck = {
    name: await page.locator('.deck-title-and-updateAt.p-1 .dm-deck-fontsize-middle').first().textContent(),
    from: 'deck-maker',
    cards: [],
  }
  for (let i = 0; i < cardImgsCount; i++) {
    // log.info(await cardImgsLocator.nth(i))
    deck.cards.push({
      imageUrl: await cardImgsLocator.nth(i).getAttribute('src')
    })
  }
  console.log(deck)
  await browser.close();
  res.json(deck)
})

export default router
