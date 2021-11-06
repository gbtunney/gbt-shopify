import {defaultMutations} from "vuex-easy-access";
import {Product} from "../models/Product";
import {deleteKeyMapImmutable, getMapImmutable, setKeyMapImmutable} from "../scripts/generic";
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
    load_items({commit, getters}, [...items]) {
        const keys = Object.keys(R.indexBy(R.prop('handle'), items));
        return Promise.all(keys.map(function (item) {
                const handle = item
                console.log("THE LOADER ISSS", getters.get_loader(handle))
                if (getters.get_loader(handle)) {
                    return getters.get_loader(item)
                } else {
                    const promise = Product.api().fetchByHandle(handle).then(function (value) {
                        commit('remove_loader', handle)
                    })
                    commit("add_loader", {
                        key: handle,
                        promise: promise
                    })
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
