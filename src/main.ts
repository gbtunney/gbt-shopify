import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from "vuex";

import {gVueUtils} from "./library/plugin/gVueUtils.plugin";
import store from './store'
import './assets/tailwind.css'
import 'vue-select/dist/vue-select.css'
import VTooltip from "v-tooltip";

Vue.config.productionTip = false
Vue.use(Vuex)

// src/main.js

import Vuetify, {
    VApp, // required
    VDataTable,
} from 'vuetify/lib'


Vue.use(Vuetify, {
    components: {
        VApp,
        VDataTable,

    },

})
const vuetify = new Vuetify({})
const app_settings = {
    "LOCAL_STORAGE_KEY": "owoolvuex",
    "SHOPIFY_BASE_URL": "https://o-wool-stage.myshopify.com",
}

const app_config =
    {
        register: Vue, /// class like Vuex, VuexORM , Vue,
        enabled: true,
        filter: {
            toCurrency: function (value) {
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
        mixin: {},
        directive: {
            'pin': {
                bind: function (el, binding, vnode) {
                    el.style.background = 'blue'
                    el.style.position = 'fixed'
                    el.style.top = binding.value + 'px'
                }
            }
        },
        component: {},
        use: {
            "v-tooltip": {
                enabled: true,
                params: VTooltip
            },
        }
    };

//TODO: figure out what to do with this. ???????????

Vue.use(gVueUtils,
    {
        settings: app_settings,
        config: app_config
    }
)

new Vue({
    router,
    store,
    vuetify: vuetify,
    render: h => h(App)
}).$mount('#app')
