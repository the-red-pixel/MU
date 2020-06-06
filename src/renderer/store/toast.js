const state = {
  text: '',
  status: false,
  lastTimerId: -1
}
const getters = {

}

const mutations = {
  updateToastText (state, text) {
    state.text = text
  },
  updateToastStatus (state, status) {
    state.status = status
  },
  updateToastLastTimerId (state, id) {
    state.lastTimerId = id
  }
}
const actions = {
  showToast ({ commit, state }, payload) {
    if (payload === null || payload === undefined || payload === 0) {
      return
    }
    if (typeof payload === 'string') {
      clearTimeout(state.lastTimerId)
      commit('updateToastText', payload)
      commit('updateToastStatus', true)
      const id = setTimeout(() => {
        commit('updateToastStatus', false)
      }, 2500)
      commit('updateToastLastTimerId', id)
      return
    }
    if (typeof payload === 'object' && payload.text) {
      clearTimeout(state.lastTimerId)
      commit('updateToastText', payload)
      commit('updateToastStatus', true)
      const id = setTimeout(() => {
        commit('updateToastStatus', false)
      }, payload.delay || 2500)
      commit('updateToastLastTimerId', id)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
