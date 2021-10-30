import {isFunction, toArray} from "./generic";
import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";
import axios from "axios";
import {SHOPIFY_BASE_URL} from "../settings";
import VuexORMSearch from "@vuex-orm/plugin-search";
import VuexORMisDirtyPlugin from "@vuex-orm/plugin-change-flags";

const R = window.R;

export function isDevMode() {
    return validateEnvMode()
}

export function validateEnvMode(value = "development", key = 'NODE_ENV') {
    if (!process
        || !process.env
        || !process.env[key]) return false;
    return (process.env[key] == value)
}
//PARENT
/*const testdata = {
    enabled: true,
    source: VuexORM,
    actions: {
        "use": {
            "@vuex-orm/plugin-axios": {
                enabled: true,
                source: VuexORMAxios,
                options: {axios}
            },
            "@vuex-orm/plugin-search": {
                enabled: true,
                plugin: VuexORMSearch,
                options: {
                    caseSensitive: true,
                    threshold: 0
                }
            },
        }
    }
}*/
/*const use2 = {
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
            params:[
                VuexORMSearch,{
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
/* * registerConfig *
* @param {object}- Config object
* */
/* * Register single config all Use stuff like plugins or components *
* @function- registerUseConfig */

export const registerConfig = function (configArr = []) {
    if (!configArr) return
    let config = toArray(configArr)
    if (config && R.is(Array, config)) { //double chheck i guess?
        config.forEach(function (configObj) {
            registerConfigObject(configObj)
        })
    }
}
const registerConfigObject = function (configObj = {}) {
    const {
        enabled = false,
        register: parent = false,
    } = configObj
    if (!enabled) return false
    const getRest = R.omit(["enabled", "register"], configObj)
    Object.entries(getRest).forEach(function ([key, value]) {
        if (parent && parent[key] && isFunction(parent[key])) {
            const newconfig = {
                parent: parent,
                parentfunc: key
            }
            if (key == "use") {  ///todo this is bad, please fix it !!!!!!!!
                if (value) {
                    Object.entries(value).forEach(function ([key, value]) {
                        let {enabled = false, params = []} = value
                        params = toArray(params)
                        const newerconfig = {...newconfig, enabled: enabled, params: params}
                        registerInner(newerconfig)
                    })
                }
            } else {
                if (value) {
                    const newerconfig2 = {...newconfig, valueObj: value}
                    registerInnerDirectFunction(newerconfig2)
                }
            }
        }
    })
}
const registerInnerDirectFunction = function (config = {}) {   //idk . stuff like "mixin" or "filter"
    const {
        enabled = false,
        parent = false, //VuexORM
        parentfunc = false, //use
        valueObj = {}, /// // [ VuexORMAxios, {axios} ]
    } = config
    if (parent && parent[parentfunc] && isFunction(parent[parentfunc])) { ///singular function  to propigate to children.
        //todo this is sloppy i dont know .
        Object.entries(valueObj).forEach(function ([key, value]) {
            parent[parentfunc](key, value)
        })
    }
}
const registerInner = function (config = {}) {
    const {
        enabled = false,
        parent = false, //VuexORM
        parentfunc = false, //use
        params = [], /// // [ VuexORMAxios, {axios} ]
    } = config
    if (!enabled) return false //done if its not enabled.
    //test to see if it is a function?
    if (parent && parent[parentfunc] && isFunction(parent[parentfunc])) { ///singular function  to propigate to children.
        //call function
        parent[parentfunc](...params)
    }
}
//format
/*
const testdata2 = {
    enabled: true,
    parent: VuexORM,
    parentfunc: "use",
    params: [
        VuexORMAxios, {axios}
    ]
}


*/
/* * getVuexPlugins *
@param {object}- ..config_plugins
 */
export function getVuexPlugins(config_plugins = {}) {
   const {plugins = {} } =config_plugins
    let pluginArr = [];
    Object.entries(plugins).forEach(function ([key, value]) {
        const {enabled = false, plugin: plugin_func = false, options = {}} = value

        if (enabled && plugin_func) {
            pluginArr.push(plugin_func(options))
        }
    })
    return pluginArr
}
export function getVuexModules(_vuexconfig) {
    const {modules = []} = _vuexconfig
    let moduleArray = toArray(modules)

    return moduleArray.reduce((accumulator, currentValue, currentIndex, array) => {
        const {module = false, enabled = false} = currentValue;
        if (module && enabled) return {...accumulator, ...module}
    }, {});
}
