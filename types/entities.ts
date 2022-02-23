
export interface Player {
  cards: {
    manaCards: Card[];
    battleCards: Card[];
    bochiCards: Card[];
    shieldCards: Card[];
    tefudaCards: Card[];
    yamafudaCards: Card[];
    chojigenCards: Card[];
    // cardGroups
    battleCardGroups: Card[];
    shieldCardGroups: Card[];
  };
  id: string;
  roomId: string;
  isReady: boolean;
  hasChojigen: boolean;
}

export interface Card {
  id: String; // ゲーム内でユニーク
  imageUrl: String;
  backImageUrl: String;
  groupId: String;
}

export interface CardGroup {
  id: String,
  cardIds: String[],
}
