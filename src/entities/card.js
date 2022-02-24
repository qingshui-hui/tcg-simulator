export function Card(card, cardData) {
  if (!card) {
    return null;
  }
  const cardWithData = {
    ...card
  }
  if (Object.prototype.hasOwnProperty.call(cardData, card.mainCardId)) {
    cardWithData.text = cardData[card.mainCardId].card_text;
    cardWithData.name = cardData[card.mainCardId].name;
  }
  return cardWithData;
}
