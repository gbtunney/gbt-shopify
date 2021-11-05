import {defaultMutations} from 'vuex-easy-access'
import {store } from '../../store'
import {Query} from '@vuex-orm/core'
import {
    cloneObject
} from "../scripts/generic";
import {upperCase} from "../scripts/stringUtils";
import {ProductInstanceBase} from "../models";
import {getEntity} from "../orm/functions";
const R =window.R

/**
 * state
 */
const state = {
  testing: 'gillian variable'

};

/**
 * getters
 */
const getters = {
    getEntity:  (state) => (instance) => {
        if ( instance && instance.constructor ){
            return {entity : instance.constructor.entity,baseEntity:  instance.constructor.baseEntity}
        }
        return false
    },
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
    /* FORMAT for dispatch */
    //ProductInstanceBase.store()
    // .dispatch('orm/logOrmEvent',
    // ['gillian',model,["testi stringggg ",{ttttttt:"!!!!!!!!!!!!!!"}],'blue','orange' ])
        //array with :[ "event string", model
     logOrmEvent({state}, [event = "no event to log", model, additional = [], ...args]) {
        const type = getEntity(model);
        const message = `EVENT:: ${event} \n  TYPE:: ${(type && type.baseEntity) ? upperCase(type.baseEntity) : ""} \n`;
        console.important(message, [" MODEL::", model, type, ...additional], ...args)
        return;
    },
    initHooks({commit}, hook = 'afterUpdate', entity = false) {
        Query.on(hook, (records, entity) => {
            console.log("entity ", entity, records)
            return records
        })
    },
    ////idk?????????
    updateModelInstance({getters}, {model_instance = false, values, mode = false, idList = [], entityType = 'entity'}) {
        const {id: model_id} = model_instance;
        const values_clone = cloneObject(values, mode, idList) //todo might need ti clean id??
        const entityFunc = (model_instance && getEntity(model_instance) ) ? getEntity(model_instance) : () => false;
        const payload = {
            entity: (entityFunc(model_instance) && entityFunc(model_instance)[entityType])
                ? entityFunc(model_instance)[entityType]
                : false,
            where: model_id,
            data: values_clone
        }
        console.log("updateModelInstance payload ", payload);
        return store.dispatch('entities/update', payload)
    },
    updateEntityByID({commit}, {entity, id, values, mode = false, idList = []}) {
        var updateObj = {...values, id: id}
        var dispatchStr = `entities/${entity}/update`;
        return store.dispatch(`entities/${entity}/update`, updateObj)
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
