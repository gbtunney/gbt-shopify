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

export function getVuexPlugins(config_plugins = {}) {
    let pluginArr = [];
    Object.entries(config_plugins).forEach(function ([key, value]) {
        const {enabled = false, plugin: plugin_func = false, options = {}} = value
        console.log('vuex PLUGINS!!!!!! ', "key", key, "options", options, enabled, plugin_func);
        if (enabled && plugin_func) {
            pluginArr.push(plugin_func(options))
        }
    })
    return pluginArr
}

/* * Register single config all Use stuff like plugins or components *
* @function- registerUseConfig */
const registerUseConfig = function ({plugins = {}, register = false, enabled = false} = {}) {
    console.log('REGISTERING single config!!!!!! ', enabled, plugins, register);

    if (enabled && register && register.use) {
        const register_func = register.use;
        Object.entries(plugins).forEach(function ([key, value]) {
            const {enabled = false, plugin = false, options = {}} = value
            console.log('REGISTERING PLUGINS!!!!!! ', "options", options, enabled, plugin);

            if (enabled && plugin) {
                register_func(plugin, options)
            }
        })
    }
}
/* * registerUse *
* @param {array}- Config Array
* */
export const registerUse = function (configArr = []) {
    if (!configArr && R.isEmpty(configArr) && !R.is(Object, configArr)) return false;

    //assume if its an OBJECT and not an array , then convert to array w 1 item
    if (!R.is(Array, configArr)) configArr = [configArr]

    configArr.forEach(function (_config_item) {
        registerUseConfig(_config_item);

    })
}

/* * Sample config object * */
/* /*const vuex_plugins = {
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
}*/

/* const orm_plugin = {
    register: VuexORM, /// class like Vuex, VuexORM , Vue,
    enabled: true,
    plugins: {
        "@vuex-orm/plugin-axios": {
            enabled: true,
            plugin: VuexORMAxios,
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
        "@vuex-orm/plugin-change-flags": {
            enabled: true,
            plugin: VuexORMisDirtyPlugin
        }
    }
}*/
