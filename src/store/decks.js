export default {
  namespaced: true,
  state: {
    data: [],
  },
  mutations: {
    setData(state, data) {
      state.data = data
    }, // commit('decks/setData')
  },
}
