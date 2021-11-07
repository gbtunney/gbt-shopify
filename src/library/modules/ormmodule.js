import {Query} from '@vuex-orm/core'
import {
    cloneObject
} from "../scripts/generic";
import {upperCase} from "../scripts/stringUtils";
import {ProductInstanceBase} from "../models";
import {getEntity} from "../orm/functions";

const R = window.R
import {Product} from "../models"

/**
 * state
 */
const state = {};

/**
 * getters
 */
const getters = {}

/**
 * mutations
 */
const mutations = {
    /* FORMAT for dispatch */
    ///{state,store,dispatch}
    //dispatch("initHooks") local module
    //ProductInstanceBase.store()
    // .dispatch('orm/logOrmEvent',
    // ['gillian',model,["testi stringggg ",{ttttttt:"!!!!!!!!!!!!!!"}],'blue','orange' ])
    //array with :[ "event string", model
    logOrmEvent(state, [event = "no event to log", model, additional = [], css =  '']) {
        const type = getEntity(model);
        const message = `EVENT:: ${event} \n  TYPE:: ${(type && type.entity) ? upperCase(type.entity) : ""} \n`;
        console.important(message,additional,css)
    }
}
/**
 * actions
 */
const actions = {
    logOrmEvent({state, store, commit, dispatch, getters}, payload) {
        commit("logOrmEvent", payload)
        return;
    },
    initModelHooks({commit, getters}, {hook = 'afterUpdate', test = "not set", model = false}) {
        if (model) {
            model["afterUpdate"] = function () {
                console.log("!!!!!!!!!!entity", model.entity, test, "hook", hook)
            }
        }
        /*  Product.on(hook, (records, entity) => {
              console.log("model",test,"hook",hook,"entity ", getters.getEntity(records),"records", records)
              return records
          })*/
    },
    ////idk?????????
    updateModelInstance({getters}, {model_instance = false, values, mode = false, idList = [], entityType = 'entity'}) {
        const {id: model_id} = model_instance;
        const values_clone = cloneObject(values, mode, idList) //todo might need ti clean id??
        const entityFunc = (model_instance && getEntity(model_instance)) ? getEntity(model_instance) : () => false;
        const payload = {
            entity: (entityFunc(model_instance) && entityFunc(model_instance)[entityType])
                ? entityFunc(model_instance)[entityType]
                : false,
            where: model_id,
            data: values_clone
        }
        return this.dispatch('entities/update', payload)
    },
    updateEntityByID({commit}, {entity, id, values, mode = false, idList = []}) {
        var updateObj = {...values, id: id}
        var dispatchStr = `entities/${entity}/update`;
        return this.dispatch(`entities/${entity}/update`, updateObj)
    }
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
