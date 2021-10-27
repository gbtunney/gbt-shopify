import Vue from 'vue'
import Vuex from 'vuex'

//************** ORM *****************//
import VuexORM from '@vuex-orm/core'
import axios from 'axios'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import VuexORMisDirtyPlugin from '@vuex-orm/plugin-change-flags';
import VuexORMSearch from "@vuex-orm/plugin-search"

import {installORM} from "../library/orm/database";
import {Models} from "../library/models";
//************** End ORM *****************//

import {LOCAL_STORAGE_KEY, SHOPIFY_BASE_URL} from '../library/settings'

//************** End VUEX plugins *****************//
import createPersistedState from "vuex-persistedstate";
import createEasyAccess from "vuex-easy-access";
import {getVuexPlugins,registerUse} from "../library/scripts/vuehelpers";

//import {ormmodule} from '../library/modules/ormmodule'
//import {moduleShopify}from "../library/modules/moduleShopify"

Vue.use(Vuex)

const dataState = createPersistedState({
  key: LOCAL_STORAGE_KEY,
  storage: window.sessionStorage
})

const use = {
  register: VuexORM, /// class like Vuex, VuexORM , Vue,
  enabled: true,
  plugins: {   ///plugins that 'use'
    "@vuex-orm/plugin-axios": {
      enabled: true,
      plugin: VuexORMAxios,
      options: {
        axios,
        baseURL: SHOPIFY_BASE_URL
      }
    },
    "@vuex-orm/plugin-search": {
      enabled: true,
      plugin: VuexORMSearch,
      options: {
        caseSensitive: true,
        threshold: 0
      }
    },
    "@vuex-orm/plugin-change-flags": {
      enabled: true,
      plugin: VuexORMisDirtyPlugin
    }
  },
}

registerUse([use])

const vuex_plugins = {
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
    enabled: true,
    plugin: createPersistedState,
    options: {
      key: LOCAL_STORAGE_KEY,
      storage: window.sessionStorage
    },
  },
}
//todo: move
/*
import {ormmodule} from "../modules/ormmodule";
import {moduleShopify} from "../modules/moduleShopify";
import {registerUse} from "../scripts/vuehelpers";
   /*loader: loadstore,*/
    /*   orm: ormmodule,
     shopify: moduleShopify*/

export const store = new Vuex.Store({
  state: {
    test: "hello",
  },
  mutations: {},
  actions: {},
  modules: {},
  plugins: getVuexPlugins(vuex_plugins)
})
export default store;
