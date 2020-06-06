import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import app from './app'
import loading from './loading'
import toast from './toast'
import download from './download'
import tutorial from './tutorial'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    app,
    loading,
    toast,
    download,
    tutorial
  },
  strict: debug
})

Vuex.Store.prototype.$http = axios

export default store
