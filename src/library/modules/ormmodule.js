import {defaultMutations} from 'vuex-easy-access'
import {store } from '../../store'
import {Query} from '@vuex-orm/core'
import {
    cloneObject
} from "../scripts/generic";
/**
 * state
 */
const state = {
  testing: 'testing variable'
};

/**
 * getters
 */
const getters = {
    getEntity:  (state) => (instance) => {
        if ( instance && instance.constructor ){
            return {entity : instance.constructor.entity,baseEntity:  instance.constructor.entity}
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
    getEntity({context, getters, commit}, instance) {
        if (instance && getters['getEntity']) return getters['getEntity'](instance)
        return
    },
    initHooks({commit}, hook = 'afterUpdate', entity = false) {
        Query.on(hook, (records, entity) => {
            console.log("entity ", entity, records)
            return records
        })
    },
    updateModelInstance({getters}, {model_instance = false, values, mode = false, idList = [], entityType = 'entity'}) {
        const {id: model_id} = model_instance;
        const values_clone = cloneObject(values, mode, idList) //todo might need ti clean id??
        const entityFunc = (model_instance && getters['getEntity']) ? getters['getEntity'] : () => false;
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
export const ormmodule ={
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
export default ormmodule
