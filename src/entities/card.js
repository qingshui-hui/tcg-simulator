export function Card(card, cardData) {
  if (!card) {
    return null;
  }
  if (Object.prototype.hasOwnProperty.call(cardData, card.mainCardId)) {
    card.text = cardData[card.mainCardId].card_text;
    card.name = cardData[card.mainCardId].name;
  }
  return card;
}
