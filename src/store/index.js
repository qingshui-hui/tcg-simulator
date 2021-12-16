import { createStore } from 'vuex'

// https://next.vuex.vuejs.org/ja/guide/#%E3%82%B7%E3%83%B3%E3%83%97%E3%83%AB%E3%81%AA%E3%82%B9%E3%83%88%E3%82%A2
const store = createStore({
  state () {
    return {
      draggingCard: null,
      cards: {},
    }
  },
  mutations: {
    setDraggingCard(state, card) {
      state.draggingCard = card
    },
  },
})

export default store
