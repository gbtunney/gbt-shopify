import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from "vuex";

import {gVueUtils} from "./library/plugin/gVueUtils.plugin";
import store from './store'

/* * STYLES * */
import './library/styles/css/tailwind.css'
import './library/styles/project/project.scss'
import 'vue-select/dist/vue-select.css'

import VTooltip from "v-tooltip";
import {vWrap, vTW, vFaker} from './library/directives'

const LOGGING = true;
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
const app_settings = {
  /*  "TYPEKIT_ID" : "kxg6qeb",*/
    "LOCAL_STORAGE_KEY": "owoolvuex",
    "SHOPIFY_BASE_URL": "https://o-wool-stage.myshopify.com",
    "WEBFONT_CONFIG" : {
        typekit: {
            id: 'kxg6qeb' //TYPEKIT_ID
        },
        fontloading: function (familyName, fvd) {
            if (LOGGING) console.log("loading", familyName, fvd)
        },
        fontactive: function (familyName, fvd) {
            if (LOGGING) console.log("fontactive", familyName, fvd)
        },
        fontinactive: function (familyName, fvd) {
            if (LOGGING) console.error("fontinactive", familyName, fvd)
        }
    }
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
                    minimumFractionDigits: 2
                });
                return formatter.format(value);
            }
        },
        mixin: {},
        directive: {
            'wrap': vWrap,
            'tw': vTW,
            'faker': vFaker
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
    vuetify: new Vuetify({}),
    render: h => h(App)
}).$mount('#app')
