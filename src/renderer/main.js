import Vue from 'vue'
import axios from 'axios'
/* eslint-disable-next-line */
import MuseUI, { Snackbar, Button, Icon } from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import App from './App'
import store from './store'
import * as utils from './utils'

axios.defaults.adapter = require('axios/lib/adapters/http')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.isDebug = process.env.NODE_ENV !== 'production'
Vue.prototype.$utils = utils
Vue.use(MuseUI)

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
  store
}).$mount('#app')
