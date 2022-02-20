/**
 *
 * @param {*}
 * @returns {Object[]}
 */
function moveCardsRule({
  cards,
  from,
  to,
}) {
  // 手札、マナ、墓地へ行く場合は表向きにする。
  if (
    ["tefudaCards", "manaCards", "bochiCards"].includes(to) &&
    to !== from
  ) {
    cards.forEach((card) => {
      card.faceDown = false;
    });
  }
  // 山札から、場に出る時には表向きにする。
  if (from === "yamafudaCards" && to === "battleCards") {
    cards.forEach((card) => {
      card.faceDown = false;
    });
  }
  // 山札へ行くときは裏向きにする。
  if (["yamafudaCards"].includes(to) && to !== from) {
    cards.forEach((card) => {
      card.faceDown = true;
    });
  }
  // 違うゾーンへ移動するときはタップとマークを解除する。
  if (to !== from) {
    cards.forEach((card) => {
      card.markColor = "";
      card.tapped = false;
    });
  }
  return cards;
}

export {
  moveCardsRule,
}
