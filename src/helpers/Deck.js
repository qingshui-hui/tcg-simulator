const START_ID_A = 1;
const START_ID_B = 101;

// const data  require('../../js/data.js');
import { data } from './data'
const deckData = data.deckList;
export class Deck {
  static getDeckById(imageHost, deckId, playerA = false) {
    let deck = [];
    const prefix = deckData[`${deckId}`]["urlPrefix"];
    for (let data of deckData[`${deckId}`]["cards"]) {
      for (let i = 0; i < data.time; i++) {
        let card = {};
        if (!data.imageUrl) {
          // 環境変数で、カード画像のサーバーを設定する。
          card.imageUrl =
            imageHost + `/${prefix + data.imageId}.jpg`;
        } else {
          card.imageUrl = data.imageUrl;
        }
        deck.push(card);
      }
    }
    deck = Deck.shuffle(deck);
    // id が特定のカード名と結びつかないように、シャッフルしてから
    for (let i = 0; i < deck.length; i++) {
      const startId = playerA ? START_ID_A : START_ID_B;
      deck[i].id = i + startId;
    }
    return deck;
  }

  static formatData(deckD, imageHost) {
    // urlPrefixは廃止
    const deck = Object.assign({}, deckD);
    const prefix = deck["urlPrefix"] || '';

    for (let card of deck.cards) {
      if (card.imageId && !card.imageId.includes('https://')) {
        card.imageUrl = imageHost + `/${prefix + card.imageId}.jpg`;
      }
    }
    deck.cards.sort((a, b) => {
      return b.time - a.time;
    })
    return deck;
  }

  static shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var r = Math.floor(Math.random() * (i + 1));
      var tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    return array;
  }
}
