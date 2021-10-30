import Vue from 'vue'
import Vuex from 'vuex'

//************** ORM *****************//
import VuexORM from '@vuex-orm/core'
import axios from 'axios'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import VuexORMisDirtyPlugin from '@vuex-orm/plugin-change-flags';
import VuexORMSearch from "@vuex-orm/plugin-search"

import VTooltip from 'v-tooltip'


import {installORM} from "../library/orm/database";
import {Models} from "../library/models";
//************** End ORM *****************//

import {LOCAL_STORAGE_KEY, SHOPIFY_BASE_URL} from '../library/settings'

//************** End VUEX plugins *****************//
import createPersistedState from "vuex-persistedstate";
import createEasyAccess from "vuex-easy-access";
import {getVuexPlugins,  getVuexModules} from "../library/scripts/vuehelpers";
import {enable} from "core-js/internals/internal-metadata";

import {moduleLoadStatus} from '../library/modules/moduleLoadStatus'
import {ormmodule2} from "../library/modules/ormmodule";
import {moduleShopify} from "../library/modules/moduleShopify";
import {toArray} from "../library/scripts/generic";
//import {moduleShopify}from "../library/modules/moduleShopify"

Vue.use(Vuex)
//todo: move
/*
const myvuexconfig = {
  modules: [
    {
      enabled: true,
      module: {loader: moduleLoadStatus}
    },
    {
      enabled: true,
      module: {shopify: moduleShopify}
    }
  ],
  plugins: {
    "vuex-easy-access": {
      enabled: true,
      plugin: createEasyAccess,
    },
    "vuex-orm-custom": {
      enabled: true,
      plugin: installORM,
      options: {
        models: Models,
      }
    },
    "vuex-persistedstate": {
      enabled: false,
      plugin: createPersistedState,
      options: {
        key: LOCAL_STORAGE_KEY,
        storage: window.sessionStorage
      },
    },
  }
}*/
export const store =function(config={}){
 return new Vuex.Store({
    state: {
      test: "hello",
    },
    mutations: {},
    actions: {},
    modules: getVuexModules(config),
    plugins: getVuexPlugins(config)
  })
}



/*export const store = new Vuex.Store({
  state: {
    test: "hello",
  },
  mutations: {},
  actions: {},
  modules: getVuexModules(myvuexconfig),
  plugins: getVuexPlugins(myvuexconfig)
})*/
export default store;
