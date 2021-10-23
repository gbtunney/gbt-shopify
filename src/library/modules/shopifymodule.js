import {
    cloneObject
} from "../scripts/generic";
import {Cart as CartModel} from "../../library";

/**
 * state
 */
const state = {
    cart_token: false,
};

/**
 * getters
 */
const getters = {
    Cart: (state) => {
        if (!state.cart_token) return;
        return CartModel.query().where("token", state.cart_token).withAll().first()
        //   return
    },
}
/**
 * mutations
 */


const mutations = {
/*
    ...defaultMutations(state)
*/
}
/**
 * actions
 */
const actions = {}

/**
 * export
 */
export const shopifymodule = {
    state,
    getters,
    mutations,
    actions
}
export default shopifymodule
