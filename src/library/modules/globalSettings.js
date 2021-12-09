import {defaultMutations} from "vuex-easy-access";

/* * GLOBAL SETTINGS MODULE! * */

/**
 * state
 */
const state = {
    asset_url: '',
}
/**
 * getters
 */
const getters = {}

/**
 * mutations
 */
const mutations = {
    /*increment(state, payload) {
        // mutate state
        state.count = payload;
        console.log("calling mutation incremen", state.count)
    },*/
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
