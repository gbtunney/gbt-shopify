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
import {getVuexPlugins,  registerConfig} from "../library/scripts/vuehelpers";
import {enable} from "core-js/internals/internal-metadata";

//import {ormmodule} from '../library/modules/ormmodule'
//import {moduleShopify}from "../library/modules/moduleShopify"

Vue.use(Vuex)


//registerConfig(config)


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
