import {defaultMutations} from "vuex-easy-access";
import {Query} from "@vuex-orm/core";
import {cloneObject} from "../scripts/generic";
import {Cart as CartModel} from "../../library/models";
/**
 * state
 */
const state = {
    cart_token: 'testing variable'
};

/**
 * getters
 */
const getters = {
    getCart:  (state)  => {
      if (!state.cart_token) return;
       return CartModel.query().where("token", state.cart_token).withAll().first()
    }
}
/**
 * mutations
 */


const mutations = {
    ...defaultMutations(state)
}
/**
 * actions
 */
const actions = {
}

/**
 * export
 */
export const moduleShopify ={
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
export default moduleShopify

