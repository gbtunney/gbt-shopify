import Vue from 'vue'

const R = window.R; //ramda

import {importantConsoleLog, toArray} from "./../scripts/generic";
import {getVuexModules, getVuexPlugins, registerConfig, registerGlobalVariable} from "../scripts/vuehelpers";

import faker from "faker"
import vSelect from "vue-select";


/** WEB FONT LOADER! */
import WebFont from 'webfontloader'

const base_app_config =
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
        }, //Vue.component("v-select", vSelect);
        component: {
            'v-select' :{
                enabled:true,
                params: vSelect
            }
        },
    };

const BASE_CONFIG = { // base non-project stuff.
    "SID_LENGTH" :  10000000000,
    "MINIMUM_QUANTITY" : 1,
}

export const gVueUtils = {
    // eslint-disable-next-line no-unused-vars
    install(Vue, options= {} ) {

        const { settings={} , config ={}  } =options;

        const mergedConfiguration = {...base_app_config,...config}

        /* * Settings init * */
        const mergedSettings = {...BASE_CONFIG,...settings}

        registerGlobalVariable('gbtconfig', mergedSettings)

        console.important = importantConsoleLog;

        /* * Faker * */
        registerGlobalVariable('faker',faker)


        /* * WEBFONT LOADER * */
       // if ( R.has('WEBFONT_CONFIG')(mergedSettings) )WebFont.load(R.prop('WEBFONT_CONFIG', mergedSettings));

        /* * Custom CONFIGURATION Initializing * */
        toArray(mergedConfiguration).forEach(function(_config){
            console.log("settings !!!!!!", _config)
            registerConfig(_config)
        })

    },
    register( _config ){
        registerConfig(_config)
    }
};
///what is thihs?????????//
export default gVueUtils;
