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
        return state.fetching_map.get(handle)
    }
}

/**
 * mutations
 */
const mutations = {
    addProductLoader(state, payload) {
        console.log("AFDED PRODUCT LOADER", payload)
        if (payload.handle) {
            state.fetching_map = new Map(state.fetching_map).set(payload.handle, payload.status)
        }
    },
    ...defaultMutations(state)
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
