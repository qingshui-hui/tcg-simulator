import { Util } from '../helpers/Util'
import { moveCardsRule } from '../game/GameRules'
import { makeRandomString } from '@/helpers/makeRandomString';

const ZONE_GROUP_MAP = {
  battleCards: "battleCardGroups",
  shieldCards: "shieldCardGroups",
};

function defaultState() {
  return {
    players: {
      a: {
        cards: {
          manaCards: [],
          battleCards: [],
          bochiCards: [],
          shieldCards: [],
          tefudaCards: [],
          yamafudaCards: [],
          chojigenCards: [],
          // cardGroups
          battleCardGroups: [],
          shieldCardGroups: [],
        },
        name: "a",
        roomId: "",
        isReady: false,
        hasChojigen: false,
      },
      b: {
        cards: {
          manaCards: [],
          battleCards: [],
          bochiCards: [],
          shieldCards: [],
          tefudaCards: [],
          yamafudaCards: [],
          chojigenCards: [],
          // cardGroups
          battleCardGroups: [],
          shieldCardGroups: [],
        },
        name: "b",
        roomId: "",
        isReady: false,
        hasChojigen: false,
      },
    },
    gameHistories: [],
  }
}

function ungroupCardResult({ card, zoneCards, zoneGroups }) {
  // シールドのグループの場合はカードの行き先がわからず、注意が必要。
  const groupIndex = zoneGroups.findIndex(
    (g) => g.id === card.groupId
  );
  if (groupIndex === -1) {
    card.groupId = null;
    return {
      cards: zoneCards,
      groups: zoneGroups,
    };
  }
  let groupCardIds = zoneGroups[groupIndex].cardIds;
  groupCardIds = groupCardIds.filter(id => id !== card.id);
  zoneGroups[groupIndex].cardIds = groupCardIds; // 結果に反映
  // カードが一枚だけのグループは消す。
  if (groupCardIds.length === 1) {
    zoneGroups.splice(groupIndex, 1);
    const lastCardIndex = zoneCards.findIndex(
      (c) => c.id === groupCardIds[0]
    );
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

export default {
  // namespaced: true, 有効にするとdevtoolsのエラーが出る。
  state: defaultState(),
  mutations: {
    resetGame(state) {
      Object.assign(state, defaultState());
    },
    popGameHistories(state, { history = null } = {}) {
      let lastHistory;
      if (state.gameHistories.length === 0) return;
      if (history) {
        state.gameHistories = state.gameHistories.filter(h => h.id !== history.id);
        lastHistory = history;
      } else {
        lastHistory = state.gameHistories.pop();
      }
      const { player, from, to, oldState, command } = lastHistory
      if (command === 'moveCards') {
        state.players[player]["cards"][from] = oldState.fromCards;
        state.players[player]["cards"][to] = oldState.toCards;
        if (oldState.fromCardGropus) {
          state.players[player]["cards"][ZONE_GROUP_MAP[from]] = oldState.fromCardGropus;
        }
      }
      if (command === 'groupCard') {
        state.players[player]["cards"][from] = oldState.fromCards;
        state.players[player]["cards"][to] = oldState.toCards;
        state.players[player]["cards"][ZONE_GROUP_MAP[to]] = oldState.toCardGroups;
      }
      if (command === 'changeCardsState') {
        state.players[player]["cards"][from] = oldState.fromCards
      }
    },
    groupCard(state, {
      from, to, fromCard, toCard, player,
    }) {
      // 正当な宛先かチェック
      if (!Object.keys(ZONE_GROUP_MAP).includes(to)) {
        throw new Error('target zone dose not have group');
      }
      // 変更前の状態を保持する。
      const oldState = {
        fromCards: JSON.parse(JSON.stringify(state.players[player]["cards"][from])),
        toCards: JSON.parse(JSON.stringify(state.players[player]["cards"][to])),
        toCardGroups: JSON.parse(JSON.stringify(state.players[player]["cards"][ZONE_GROUP_MAP[to]])),
      }
      // 移動元からカードを削除する。
      state.players[player]["cards"][from] = Util.arrayRemoveCards(
        state.players[player]["cards"][from],
        [fromCard]
      );
      // 移動先にカードを追加する。
      state.players[player]["cards"][to].push(fromCard);
      // 情報をカードに追加
      if (toCard.groupId) {
        // ターゲットのカードが既にグループ化されていた場合、
        // 既存のグループに追加する。
        const group = state.players[player]["cards"][ZONE_GROUP_MAP[to]].find(
          (g) => g.id === toCard.groupId
        );
        group.cardIds.unshift(fromCard.id);
        fromCard.groupId = toCard.groupId;
      } else {
        // 新しくグループを作成する。
        // TODO: 被らない文字列にする。
        const groupId = `${toCard.id}-${fromCard.id}`;
        state.players[player]["cards"][ZONE_GROUP_MAP[to]].push({
          id: groupId,
          cardIds: [fromCard.id, toCard.id],
        });
        fromCard.groupId = groupId;
        toCard.groupId = groupId;
      }
      // 並べ替え fromCardをtoCardの前に移す。
      state.players[player]["cards"][to] = Util.arrayInsertBefore(
        state.players[player]["cards"][to],
        toCard,
        fromCard
      );
      // ゲームログに保存
      state.gameHistories.push({
        id: makeRandomString(12),
        from,
        fromCard,
        to,
        toCard,
        player,
        command: 'groupCard',
        oldState,
      })
    },
    moveCards(state, {
      from,
      to,
      cards,
      player,
      prepend = false,
    }) {
      // 変更前の状態を保持する。
      const oldState = {
        fromCards: JSON.parse(JSON.stringify(state.players[player]["cards"][from])),
        toCards: JSON.parse(JSON.stringify(state.players[player]["cards"][to])),
        cards: JSON.parse(JSON.stringify(cards)),
      }
      // 先頭のカードがグループに属していた場合、そのグループから抜ける。
      const card = cards[0];
      if (card.groupId) {
        // 正当な宛先かチェック
        if (!Object.keys(ZONE_GROUP_MAP).includes(from)) {
          throw new Error('target zone dose not have group');
        }
        // 状態を保持する。
        oldState.fromCardGropus = JSON.parse(JSON.stringify(state.players[player]["cards"][ZONE_GROUP_MAP[from]]));
        const ungroupResult = ungroupCardResult({
          card,
          zoneCards: state.players[player]["cards"][from],
          zoneGroups: state.players[player]["cards"][ZONE_GROUP_MAP[from]],
        });
        state.players[player]["cards"][from] = ungroupResult.cards;
        state.players[player]["cards"][ZONE_GROUP_MAP[from]] = ungroupResult.groups;
      }
      // カードを移動する。
      cards = moveCardsRule({ cards, from, to })
      state.players[player]["cards"][from] = Util.arrayRemoveCards(
        state.players[player]["cards"][from],
        cards
      );
      if (prepend) {
        state.players[player]["cards"][to] = Util.arrayPrependCards(
          state.players[player]["cards"][to],
          cards
        );
      } else {
        state.players[player]["cards"][to] = Util.arrayAppendCards(
          state.players[player]["cards"][to],
          cards
        );
      }
      // ゲームログに保存
      state.gameHistories.push({
        id: makeRandomString(12),
        from,
        to,
        cards: oldState.cards,
        player,
        prepend,
        command: 'moveCards',
        oldState,
      })
    },
    changeCardsState(state, {
      from, cards, player, cardState,
    }) {
      const oldState = {
        fromCards: JSON.parse(JSON.stringify(state.players[player]["cards"][from])),
        cards: JSON.parse(JSON.stringify(cards)),
      }
      const cardIds = cards.map(c => c.id);
      state.players[player]["cards"][from].forEach(c => {
        if (!cardIds.includes(c.id)) return;
        Object.keys(cardState).forEach((key) => {
          if (['tapped', 'faceDown', 'markColor'].includes(key)) {
            c[key] = cardState[key];
          }
        })
      })
      // ゲームログに保存
      state.gameHistories.push({
        id: makeRandomString(12),
        from,
        cards: oldState.cards,
        cardState,
        player,
        command: 'changeCardsState',
        oldState,
      })
    },
  },
  actions: {
    pushGameHistories({ commit }, { history }) {
      if (history.command === 'moveCards') {
        const { from, to, cards, player, prepend } = history;
        commit('moveCards', { from, to, cards, player, prepend })
      }
      if (history.command === 'groupCard') {
        const { from, to, fromCard, toCard, player } = history;
        commit('groupCard', { from, to, fromCard, toCard, player });
      }
      if (history.command === 'changeCardsState') {
        const { from, cards, player, cardState } = history;
        commit('changeCardsState', { from, cards, player, cardState })
      }
    },
  }
}
