import { Router } from "express";
import deckList from "../helpers/data.js";
import sampleDeckList from "../helpers/data-sample.js";
import { useConfig } from "../plugins/useConfig.js";
import { getRoomCache } from "./redisClient.js";

const router = Router();

router.get("/api/rooms/:roomId", async function (req, res) {
  if (!req.params.roomId) {
    return res.json({});
  }
  /** @type { import("types").Room) } */
  const room = (await getRoomCache(req.params.roomId)) || null;
  if (!room) {
    return res.json({});
  }
  // TODO: フロントでの受け取り方を修正し、直接roomを返せるようにする。
  res.json({
    a: room.players.a,
    b: room.players.b,
  });
});

import axios from "axios";
router.get("/api/decks", async function (req, res) {
  // サンプルモードの場合は、サンプルのデッキのみを返す。
  if (useConfig().SAMPLE_MODE) {
    return res.json(sampleDeckList);
  }
  let response;
  try {
    response = await axios.get(process.env.DECK_URL);
    res.json([...deckList, ...response.data]);
  } catch (error) {
    // ex: Request failed with status code 404
    res.json(deckList);
  }
});

// https://elements.heroku.com/buildpacks/playwright-community/heroku-playwright-buildpack
// 特定のブラウザのみに対応するplaywrightを使用。
import { chromium } from "playwright-chromium";
import { Deck } from "../helpers/Deck.js";

router.get("/api/cards", async (req, res) => {
  try {
    const apiRes = await axios.get(
      `https://d23r8jlqp3e2gc.cloudfront.net/api/v1/dm/cards?main-card-ids=${req.query.cardIds}`
    );
    if (apiRes.data) {
      const map = {};
      apiRes.data.forEach((c) => {
        map[c.main_card_id] = c;
      });
      return res.json(map);
    }
    res.json({});
  } catch (err) {
    console.log(err);
    return res.json({});
  }
});

router.get("/api/scrape", async (req, res) => {
  const browser = await chromium.launch();

  const page = await browser.newPage();
  await page.goto(req.query.url);
  const deckData = await page.evaluate(async () => {
    /* global getCategoryId, DeckRecipeInfo */
    // 上: https://stackoverflow.com/a/41552229
    // カテゴリーIDを取得
    const categoryId = getCategoryId(`dm`);
    // デッキIDを取得
    const params = new URLSearchParams(window.location.search);
    const deckId = params.get("tcgrevo_deck_maker_deck_id");
    // デッキ詳細のモデルを初期化
    const deckRecipeInfo = new DeckRecipeInfo(
      categoryId,
      deckId,
      `https://storage.googleapis.com/ka-nabell-card-images/img/s/card/card100244663_1.jpg`
    );
    await deckRecipeInfo.updateDeckDetail();
    await deckRecipeInfo.loadComplete();
    return deckRecipeInfo.deckCardData;
  });
  //
  // 取得したデータを処理する。
  const deck = {
    name: deckData.name,
    dmDeckId: deckData.dm_deck_id,
  };
  deck.chojigenCards = deckData.hyper_spatial_cards;
  deck.cards = Deck.groupByCardId(
    deckData.main_cards.map((c) => {
      return {
        imageUrl: `https://storage.googleapis.com/ka-nabell-card-images/img/card/${c.large_image_url}`,
        mainCardId: c.main_card_id,
      };
    })
  );
  deck.chojigenCards = Deck.groupByCardId(
    deckData.hyper_spatial_cards.map((c) => {
      return {
        imageUrl: `https://storage.googleapis.com/ka-nabell-card-images/img/card/${c.large_image_url}`,
        mainCardId: c.main_card_id,
      };
    })
  );
  await browser.close();
  // レスポンス
  res.json(deck);
});

export default router;
