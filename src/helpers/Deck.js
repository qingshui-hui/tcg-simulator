const START_ID_A = 1;
const START_ID_B = 101;

import { useConfig } from '../plugins/useConfig'

export class Deck {
  static prepareDeck(deckCards, playerA = false) {
    let cards = [];
    deckCards.forEach(data => {
      // デッキメーカーから取り込んだデータにはtimeがないことによる対応。
      const times = data.time || 1
      for (let i = 0; i < times; i++) {
        cards.push({
          imageId: data.imageId,
          imageUrl: data.imageUrl,
          backImageUrl: data.backImageUrl,
        });
      }
    })
    return this.prepareCardsForGame(cards, playerA)
  }

  /**
   * ゲーム内で一意になるようなカードIDをカードに付与する
   */
  static prepareCardsForGame(cards, playerA = false) {
    let shuffledCards = Deck.shuffle(cards);
    const startId = playerA ? START_ID_A : START_ID_B;
    const imageHost = useConfig().IMAGE_HOST
    // id が特定のカード名と結びつかないように、シャッフルしてから
    shuffledCards = shuffledCards.map((c, i) => {
      return {
        id: startId + i,
        imageUrl: c.imageUrl || `${imageHost}/${c.imageId}`,
        backImageUrl: c.backImageUrl || `${imageHost}/card-back.jpg`,
      }
    })
    return shuffledCards;
  }

  static formatData(deckD) {
    const deck = Object.assign({}, deckD);
    const imageHost = useConfig().IMAGE_HOST

    deck.cards.forEach(c => {
      // c.time = c.time || 1;
      c.imageUrl = c.imageUrl || `${imageHost}/${c.imageId}`;
    })
    // timeのないデータだった場合、集計する。
    if (!deck.cards[0].time && deck.cards[0].time !== 0) {
      deck.cards = deck.cards.reduce((result, current) => {
        const element = result.find((p) => p.imageUrl === current.imageUrl);
        if (element) {
          element.time++;
        } else {
          result.push({
            ...current,
            time: 1,
          });
        }
        return result;
      }, []);
    }
    // 並べ替える
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
