import Vue from 'vue'
//import App from './App.vue'
//import router from './router'
import Vuex from "vuex";
import Clipboard from 'v-clipboard'

import 'vue-select/dist/vue-select.css'

import VTooltip from "v-tooltip";
import {vWrap, vTW, vFaker} from '../directives'

const LOGGING = true;

const app_settings = {

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
            "v-clipboard":{
                enabled: true,
                params: Clipboard
            },
            "v-tooltip": {
                enabled: true,
                params: VTooltip
            },
        }
    };

//TODO: figure out what to do with this. ???????????

export const init = {
    settings: app_settings,
    config: app_config
}
export default init
