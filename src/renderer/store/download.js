import Queuery from '@/utils/queuery'
import { download } from '@/utils'

const state = {
  totalCount: Infinity,
  finishedCount: 0,
  isDownloading: false
}
const getters = {

}

const mutations = {
  clearDlStore (state) {
    state.totalCount = Infinity
    state.finishedCount = 0
    state.isDownloading = false
  },
  updateDlTotalCount (state, count) {
    state.totalCount = count
  },
  increaseDlFinishedCount (state) {
    state.finishedCount++
  },
  updateDownloading (state, flag) {
    state.isDownloading = flag
  }
}
const actions = {
  startDownload ({ commit, dispatch }, downloadList) {
    commit('updateDownloading', true)
    commit('updateDlTotalCount', downloadList.length)
    const q = new Queuery()
    for (let item of downloadList) {
      q.task(() => download(item.link, item.path))
    }
    q.start(() => {
      commit('updateDownloading', false)
      dispatch('loadNativeFiles', false)
    }, () => {
      commit('increaseDlFinishedCount')
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
