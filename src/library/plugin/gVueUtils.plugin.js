import axios from "axios";
import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";
import VuexORMisDirtyPlugin from '@vuex-orm/plugin-change-flags';
import VuexORMSearch from "@vuex-orm/plugin-search";
import Vue from 'vue'

const R = window.R;


import {installORM} from "../orm/database";
import {Models} from "../models";
import moduleProductLoader from '../modules/moduleProductLoader'
//import {moduleLoadStatus} from '../modules/moduleLoadStatus'
import ormmodule from "../modules/ormmodule";
//import {moduleShopify} from "../modules/moduleShopify";
import {importantConsoleLog, toArray} from "./../scripts/generic";
import {getVuexModules, getVuexPlugins,registerConfig} from "../scripts/vuehelpers";
import createEasyAccess from "vuex-easy-access";
import createPersistedState from "vuex-persistedstate";
import VTooltip from "v-tooltip";
import vSelect from "vue-select";

/** WEB FONT LOADER! */
import WebFont from 'webfontloader'
//import {WEBFONT_CONFIG} from "./settings";
//WebFont.load(WEBFONT_CONFIG);



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
        use: {
            "v-tooltip": {
                enabled: true,
                params: VTooltip
            },
        }
    };

const BASE_CONFIG = { // base non-project stuff.
    "SID_LENGTH" :  10000000000,
    "LOAD_MODE":  ['LOAD_ALL', 'LOAD_HANDLE_ALWAYS', 'LOAD_HANDLE_NOT_IN_DATABASE', 'LOAD_NEVER'],
    "MINIMUM_QUANTITY" : 1,
    "LOCAL_STORAGE_KEY" : "vuex_no_name",
    "SELECTION_MODE_OPTIONS":  {
        extended: {
            load_mode: "LOAD_HANDLE_ALWAYS",
            quantity_editable: true,
            variant_editable: true,
            add_to_cart_enabled: true,
            options_editable: true,
        },
        normal: {
            load_mode: "LOAD_HANDLE_NOT_IN_DATABASE",
            quantity_editable: true,
            variant_editable: true,
            add_to_cart_enabled: true,
            options_editable: false,
        },
        readonly: {
            load_mode: "LOAD_NEVER",
            quantity_editable: false,
            variant_editable: false,
            add_to_cart_enabled: true,
            options_editable: false,
        },
        lineitem: {
            load_mode: "LOAD_NEVER",
            quantity_editable: true,
            variant_editable: false,
            add_to_cart_enabled: false,
            options_editable: false,
        },
        groupitem: {
            load_mode: "LOAD_NEVER",
            quantity_editable: true,
            variant_editable: true,
            add_to_cart_enabled: false,
            options_editable: false,
        }
    }
}

const Editable_Defaults = {
    quantity: true,
    variant: true,
    addToCart: false,
    options: true,
}
/*const configObject = {
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
                el.style.background = 'red'
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
}*/
const vuexConfigModules  =
{
    modules: [
        {
            enabled: true,
            module: {
                productloader: moduleProductLoader
            }
        },
        {
            enabled: true,
            module: {
                orm: ormmodule

            }
        },
    ],
}




export const gVueUtils = {
    // eslint-disable-next-line no-unused-vars
    install(Vue, options= {} ) {

        const { settings={} , config ={}  } =options;


        const mergedSettings = {...BASE_CONFIG,...settings}
        const mergedConfiguration = {...base_app_config,...config}
        Vue['$gbtconfig'] =  mergedSettings
        Vue.prototype.$gbtconfig = mergedSettings
        console.important = importantConsoleLog;

        /* * WEBFONT LOADER * */
        const hasWebFontSettings = R.has('WEBFONT_CONFIG');

        if ( hasWebFontSettings(mergedSettings) ){
           const WEBFONT_CONFIG =  R.prop('WEBFONT_CONFIG', mergedSettings);
            WebFont.load(WEBFONT_CONFIG);
            console.warn("SETTINGGGGG "  , WEBFONT_CONFIG)
        }

        var configArr  = toArray(mergedConfiguration)
        configArr.forEach(function(_config){
            console.log("settings !!!!!!", _config)
            registerConfig(_config)
        })
        const ormplugins = {
            register: VuexORM, /// class like Vuex, VuexORM , Vue,
                enabled: true,
            use: {   ///plugins that 'use'
            "@vuex-orm/plugin-axios": {
                enabled: true,
                    params: [VuexORMAxios, {
                    axios,
                    baseURL: mergedSettings["SHOPIFY_BASE_URL"]
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
                    params: [ VuexORMisDirtyPlugin,{
                        isNewFlagName: 'IsNew',
                        isDirtyFlagName: 'IsDirty',
                        exposeFlagsExternally: false
                    } ]
            }
        },
        }

        registerConfig(ormplugins)

    },
    register( _config ){
        registerConfig(_config)
    }
};
export const getAppVuexModules =  function(flags={},_settings){
   return getVuexModules(vuexConfigModules)
}
export const  getAppVuexPlugins = function(flags={},_settings=BASE_CONFIG){
   let _plugins=  {
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
        enabled: true,
            plugin: createPersistedState,
            options: {
            key: _settings.LOCAL_STORAGE_KEY,
                storage: window.sessionStorage,
              /*  paths: ['entities/products']*/
        },
    },
    }
}
    _plugins = getVuexPlugins(_plugins)
    return _plugins
}
export default gVueUtils;
