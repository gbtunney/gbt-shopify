import {defaultMutations} from "vuex-easy-access";
import {Product} from "../models/Product";
import {deleteKeyMapImmutable, getMapImmutable, setKeyMapImmutable} from "../scripts/generic";
import {ProductInstanceBase} from "../models";
const R = window.R
const RA = window.RA
/**
 * state
 */
const state = {
    current_loading_map : []
}
/**
 * getters
 */
const getters = {
    get_loader: (state) => (key = false) => {
        return getMapImmutable(state.current_loading_map, key)
    }
}

/**
 * mutations
 */
const mutations = {
    clear_loader(state) {
        state.current_loading_map = []
    },
    remove_loader(state, key) {
        state.current_loading_map = deleteKeyMapImmutable(key, state.current_loading_map)
    },
    add_loader(state, {key, promise}) {
        state.current_loading_map = setKeyMapImmutable(key, promise, state.current_loading_map)
    },
    ...defaultMutations(state)
}

/**
 * actions
 */
const actions = {
    load_items({commit, getters}, [items = [], load_mode = "LOAD_NEVER"]) {
        const keys = Object.keys(R.indexBy(R.prop('handle'), items));
        return Promise.all(keys.map(function (item) {
                const handle = item
                if (getters.get_loader(handle)) {
                    return getters.get_loader(item)
                } else {

                    let promise = false;
                    if (load_mode == 'LOAD_ALL') {
                        //load all
                        // Product.api().fetchAll();
                    } else if (load_mode == 'LOAD_HANDLE_ALWAYS') {
                        //load by handle
                        if (!handle) return;
                        promise = Product.api().fetchByHandle(handle)
                    } else if (load_mode == 'LOAD_HANDLE_NOT_IN_DATABASE') {
                        if (!handle) return;
                        console.error("doLoader:  LOAD_HANDLE_NOT_IN_DATABASE:product", items)
                        if (!Product.getProductByHandle(handle)) promise = Product.api().fetchByHandle(handle)
                    } else if (load_mode == 'LOAD_NEVER') {
                        //do nothing? instance???
                    }
                    if (promise) {
                        promise.then(function (value) {
                            console.log("REMOMOOMOMMOMOMOMOMOMOM", value)
                            commit('remove_loader', handle)
                        })
                        commit("add_loader", {
                            key: handle,
                            promise: promise
                        })
                    }
                    return promise
                }
            })
        )
    },
}

/**
 * export
 */
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
