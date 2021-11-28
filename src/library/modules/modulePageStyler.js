import {defaultMutations} from "vuex-easy-access";

/**
 * state
 */
const state = {
    stylerArr: {
        '*': {
            data: [false]
        }
    },
    pokeDex: {
        '*': {
            name: '',
            seen: false,
            types: {'*': false}
        }
    },
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
