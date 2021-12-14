
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

  static arrayAppendChildren(parentCards, childCards) {
    const result = [];
    for (let parent of parentCards) {
      for (let child of childCards) {
        if (child.parentId === parent.id) {
          result.push(child);
        }
      }
    }
    return parentCards.concat(result);
  }
}
