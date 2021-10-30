import Vue from 'vue'
import App from './App.vue'
import router from './router'

import {gVueUtils} from "./library/plugin/gVueUtils.plugin";

import store from './store'
import './assets/tailwind.css'
import VTooltip from "v-tooltip";
import  appvuexconfig,{getVuexConfig,getVuexOrmPlugins} from './appvuexconfig';
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";
import VuexORMisDirtyPlugin from '@vuex-orm/plugin-change-flags';
import axios from "axios";
import VuexORMSearch from "@vuex-orm/plugin-search";


Vue.config.productionTip = false
Vue.use(Vuex)
const app_settings = {
  "LOCAL_STORAGE_KEY" :"owoolvuex",
  "SHOPIFY_BASE_URL" : "https://o-wool-stage.myshopify.com",
}

const app_config =
  {
  register: Vue, /// class like Vuex, VuexORM , Vue,
  enabled: true,
  filter :{
    toCurrency:  function (value) {
      if (typeof value !== "number") {
        return value;
      }
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      });
      return formatter.format(value);
    }
  },
  mixin:{},
  directive: { 'pin' :  {
      bind: function (el, binding, vnode) {
        el.style.background = 'blue'
        el.style.position = 'fixed'
        el.style.top = binding.value + 'px'
      }
    }
  },
  component:{},
  use:{
    "v-tooltip": {
      enabled: true,
      params: VTooltip
    },
  }
};

//TODO: figure out what to do with this. ???????????
const ormplugins={
    register: VuexORM, /// class like Vuex, VuexORM , Vue,
    enabled: true,
      use: {   ///plugins that 'use'
    "@vuex-orm/plugin-axios": {
      enabled: true,
          params: [VuexORMAxios, {
        axios,
        baseURL: app_settings["SHOPIFY_BASE_URL"]
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
}

Vue.use(gVueUtils,
    {settings:app_settings,
      config:app_config}
)

const newstore = store(getVuexConfig(Vue["$gbtconfig"] ))
console.log("dddd", newstore)
new Vue({
  router,
  newstore ,
  render: h => h(App)
}).$mount('#app')
