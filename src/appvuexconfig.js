import Vue from 'vue'
import Vuex from 'vuex'

//************** ORM *****************//
import VuexORM from '@vuex-orm/core'
import {installORM} from "@/library/orm/database";
import {Models} from "@/library/models";
//************** End ORM *****************//


import createPersistedState from "vuex-persistedstate";
import createEasyAccess from "vuex-easy-access";
//************** End VUEX plugins *****************//

//************** =s *****************//

import {moduleLoadStatus} from '@/library/modules/moduleLoadStatus'
import {ormmodule2} from "@/library/modules/ormmodule";
import {moduleShopify} from "@/library/modules/moduleShopify";
//import {moduleShopify}from "../library/modules/moduleShopify"



Vue.use(Vuex)
//todo: move
/*const orm_plugin = {
  register: VuexORM, /// class like Vuex, VuexORM , Vue,
  enabled: true,
  use: {   ///plugins that 'use'
    "@vuex-orm/plugin-axios": {
      enabled: true,
      params: [VuexORMAxios, {
        axios,
        baseURL: SHOPIFY_BASE_URL
      }]
    },
    "@vuex-orm/plugin-search": {
      enabled: true,
      params: [
        VuexORMSearch, {
          caseSensitive: true,
          threshold: 0
        }
      ]
    },
    "@vuex-orm/plugin-change-flags": {
      enabled: true,
      params: VuexORMisDirtyPlugin
    }
  },
}*/

export function getVuexConfig(settings={}){
  console.log("getVuexConfig", settings, Vue["$gbtconfig"] )
  let {SHOPIFY_BASE_URL,LOCAL_STORAGE_KEY} =  Vue["$gbtconfig"]
 return   {
   modules: [
     {
       enabled: false,
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
 }
}

export const vuexconfig ={}
export default vuexconfig;
