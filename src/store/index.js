import Vue from 'vue'
import Vuex from 'vuex'
import {database} from '@/library'
import createEasyAccess from 'vuex-easy-access'
import createPersistedState from "vuex-persistedstate";
import {LOCAL_STORAGE_KEY} from '../library/settings'
import {ormmodule} from '../library/modules/ormmodule'
import {shopifymodule} from '../library/modules/shopifymodule'

const plugins ={
  VUEX_LOCAL_STORAGE: true
}
Vue.use(Vuex)

//*******************************//

/** Vuex Easy Access - Shortcuts for writting mutations and getters */
const VUEX_EASY_ACCESS = createEasyAccess()

/** Vuex Local Storage Persistance */
const dataState = createPersistedState({
  key: LOCAL_STORAGE_KEY,
  storage: window.sessionStorage
})

export const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules:  {
    /*loader: loadstore,*/
    orm: ormmodule,
    shopify: shopifymodule
  },
  plugins: [
    database, VUEX_EASY_ACCESS, dataState/*VUEX_LOCAL_STORAGE.plugin*/
  ]
})
export default store;
