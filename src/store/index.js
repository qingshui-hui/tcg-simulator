import { createStore } from 'vuex'

// https://next.vuex.vuejs.org/ja/guide/#%E3%82%B7%E3%83%B3%E3%83%97%E3%83%AB%E3%81%AA%E3%82%B9%E3%83%88%E3%82%A2
const store = createStore({
  state () {
    return {
      draggingCard: null,
      workSpace: {
        active: false,
        cards: [],
        zone: '',
        player: '',
      },
      settings: {
        dropdownTriggers: ['click', 'hover'],
      },
    }
  },
  mutations: {
    setDraggingCard(state, card) {
      state.draggingCard = card
    },
    // 第二引数のプロパティは全て必須。
    openWorkSpace(state, {cards, zone, player}) {
      state.workSpace = {
        cards,
        zone,
        player,
        active: true,
      }
    },
    closeWorkSpace(state) {
      state.workSpace = {
        cards: [],
        zone: '',
        player: '',
        active: false,
      }
    },
    updateSettings(state, settings) {
      console.log(settings)
      state.settings = {
        ...state.settings,
        ...settings,
      }
    }
  },
})

export default store
