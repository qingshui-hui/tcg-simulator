
export class Util {

  static arrayRemoveCards(array, cards) {
    let result = array;
    for (let card of cards) {
      result = result.filter((elem) => {
        return elem.id !== card.id;
      })
    }
    return result;
  }

  static arrayAppendCards(array, cards) {
    let result = array;
    cards = cards.map((c) => {
      c.selected = false;
      return c;
    })
    return result.concat(cards);
  }

  static arrayPrependCards(array, cards) {
    cards = cards.map((c) => {
      c.selected = false;
      return c;
    })
    return cards.concat(array);
  }

  static arrayInsertBefore(array, targetCard, card) {
    const targetIndex = array.findIndex(c => c.id === targetCard.id)
    // 削除してから挿入しないと一時的にidがかぶる状態ができてしまう。
    array.splice(
      array.findIndex(c => c.id === card.id),
      1
    )
    array.splice(
      targetIndex,
      0,
      card
    )
    return array
  }
}

export function ungroupCardResult({ card, zoneCards, zoneGroups }) {
  // シールドのグループの場合はカードの行き先がわからず、注意が必要。
  const groupIndex = zoneGroups.findIndex((g) => g.id === card.groupId);
  if (groupIndex === -1) {
    card.groupId = null;
    return {
      cards: zoneCards,
      groups: zoneGroups,
    };
  }
  let groupCardIds = zoneGroups[groupIndex].cardIds;
  groupCardIds = groupCardIds.filter((id) => id !== card.id);
  zoneGroups[groupIndex].cardIds = groupCardIds; // 結果に反映
  // カードが一枚だけのグループは消す。
  if (groupCardIds.length === 1) {
    zoneGroups.splice(groupIndex, 1);
    const lastCardIndex = zoneCards.findIndex((c) => c.id === groupCardIds[0]);
    if (lastCardIndex !== -1) {
      const lastCard = zoneCards[lastCardIndex];
      lastCard.groupId = null;
    }
  }
  // cardIdsが0になったグループは自動で消す。
  if (groupCardIds.length === 0) {
    zoneGroups.splice(groupIndex, 1);
  }
  card.groupId = null;
  return {
    cards: zoneCards,
    groups: zoneGroups,
  };
}
