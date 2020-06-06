import { url } from 'src/config'
import { forceOpenDir, getCurrentDir, scanFiles, isFileExisted } from '@/utils'
import Vue from 'vue'
import electron from 'electron'

const state = {
  isInfoLoading: false,
  // 线上完整 json
  info: undefined,
  isNativeLoading: false,
  // 文件名与 hash 组成的对象列表 (.jar)
  fileList: [],
  fileCount: 0,
  loadedFileCount: 0,
  activeTab: 0,
  modsPath: '',
  modItemLoading: 0
}
const getters = {
  requiredMods (state) {
    if (!state.info) {
      return []
    }
    return state.info.mods.filter(it => it.required)
  },
  optionalMods (state) {
    if (!state.info) {
      return []
    }
    return state.info.mods.filter(it => !it.required)
  },
  isLoading (state) {
    return state.isInfoLoading || state.isNativeLoading
  },
  md5List (state) {
    return state.fileList.map(item => item.hash)
  },
  hasModItemLoading (state) {
    return state.modItemLoading !== 0
  }
}

const mutations = {
  increaseModItemLoading (state) {
    state.modItemLoading++
  },
  decreaseModItemLoading (state) {
    state.modItemLoading--
  },
  clearModItemLoading (state) {
    state.modItemLoading = 0
  },
  updateModsPath (state, thePath) {
    state.modsPath = thePath
  },
  updateActiveTab (state, tab) {
    if (tab === state.activeTab) {
      return
    }
    state.modItemLoading = 0
    state.activeTab = tab
  },
  updateInfo (state, info) {
    state.info = info
  },
  updateInfoLoading (state, flag) {
    state.isInfoLoading = flag
  },
  updateNativeLoading (state, flag) {
    state.isNativeLoading = flag
  },
  updateMod (state, { projectId, fileId, content }) {
    const index = state.info.mods.findIndex(it => it.projectId === projectId && it.fileId === fileId)
    if (index === -1) {
      return
    }
    const mod = state.info.mods[index]
    Vue.set(state.info.mods, index, {
      ...mod,
      ...content
    })
  },
  updateFileList (state, list) {
    state.fileList = list
    const md5List = state.fileList.map(item => item.hash)
    const resultList = state.info.mods.map(item => {
      let installed = md5List.includes(item.hash)
      return {
        ...item,
        installed
      }
    })
    state.info = {
      mods: resultList
    }
  },
  updateFileCount (state, count) {
    state.fileCount = count
  },
  increaseLoadedFileCount (state) {
    state.fileCount++
  }
}
const actions = {
  updateModsInfo ({ commit }) {
    commit('updateInfoLoading', true)
    return this.$http.get(url).then(({ data }) => {
      data.mods.forEach(item => {
        item.installed = false
      })
      commit('updateInfo', data)
      commit('updateInfoLoading', false)
    }).catch(err => {
      commit('updateInfoLoading', false)
      throw err
    })
  },
  loadNativeFiles ({ commit, state }, isInitialize) {
    commit('updateNativeLoading', true)
    let path = `${getCurrentDir()}/mods`
    if (isInitialize) {
      const isExisted = isFileExisted(path)
      if (!isExisted) {
        path = forceOpenDir(electron.remote.getCurrentWindow())
      }
    } else {
      path = state.modsPath
    }
    commit('updateModsPath', path)
    scanFiles(path).then(result => {
      commit('updateFileList', result.fileList)
      commit('updateNativeLoading', false)
    }).catch(() => {
      commit('updateNativeLoading', false)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
