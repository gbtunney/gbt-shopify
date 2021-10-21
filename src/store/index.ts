import Vue from 'vue'
import Vuex from 'vuex'
import {database} from '@/library'
import createEasyAccess from 'vuex-easy-access'
import loadstore from '../library/loadstore.js'
Vue.use(Vuex)

//*******************************//

/** Vuex Easy Access - Shortcuts for writting mutations and getters */
const VUEX_EASY_ACCESS = createEasyAccess()

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules:  {
    loader: loadstore
  },
  plugins: [
    database, VUEX_EASY_ACCESS
  ]
})
