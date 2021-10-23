import {defaultMutations} from 'vuex-easy-access'

/**
 * state
 */
const state = {
    fetching_map: new Map(),
    testing: 'hello'
};

/**
 * getters
 */
const getters = {
    getProductLoader: (state) => (handle) => {
        if (! state.fetching_map ) console.log("NO ENTRY FOR HANDLE",typeof state.fetching_map)
        return state.fetching_map.get(handle)
    }
}

/**
 * mutations
 */
const mutations = {
    addProductLoader(state, payload) {
        console.log("AFDED PRODUCT LOADER", payload, state.fetching_map )
        if (payload.handle) {
          state.fetching_map = new Map(state.fetching_map).set(payload.handle, payload.status)
        }
    }
}
/**
 * actions
 */
const actions = {}

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
