import {defaultMutations} from 'vuex-easy-access'
import {store } from '../../store'
import {Query} from '@vuex-orm/core'
import {
    cloneObject
} from "../scripts/generic";
import {upperCase} from "../scripts/stringUtils";
import {ProductInstanceBase} from "../models/ProductInstance";
const R =window.R
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
export const ormmodule2 ={
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

/** FUNCTIONS ORM * */
/**
 * getEntity
 * @param {model} instance - Instance of vuex-orm model
 * @return {object} - returns object containing {entity,baseEntity}
 */
export function getEntity( instance) {
    if (instance && instance.constructor) {
        const {entity, baseEntity} = instance.constructor
        return {entity: entity, baseEntity: baseEntity}
    }
    return false
}

///DEMO FUNCTION
//MOVE TO ACTION?? wtf??????????
export function updateWhere(where = {}, values = false) {
    if (!values || R.isEmpty(where)) return false;
    const predWhere = R.whereEq(where);
    //todoL    ??????????
    ProductInstanceBase.update({
        where: (instance) => {
            return predWhere(instance)
        },
        data: {active: true}
    })
}

//DEMO FUNCTION
//REMOVE?
/*export function getProductByObject(where={}) {
    if (  R.isEmpty(where) ) return false;
    const predWhere = R.whereEq(where);
    const user = Product.query()
        .where((_record, query) => {
            return ( predWhere(_record) ) ? _record : false
            // query.where('age', 20).orWhere('id', 1)
        })
        .get()
    console.log("seatching " ,  user)
    return user;
}*/
//get model by string or instance.
            //store ref is a THHIS from any component
export function getModel(instance = false, store_ref = false, key = "entity") {  //other 'baseEntity'
    if (!instance) return
    let entityString = false;
    if (R.is(Object, instance)) {
        entityString = (getEntity(instance) && getEntity(instance)[key]) ? getEntity(instance)[key] : false
        return instance.$store().$db().model(entityString);
    } else if (R.is(String, instance)) entityString = instance; //is string
    if (!entityString || !store_ref) return false
    let db = (store_ref.$store)
        ? store_ref.$store.$db() :
        (store_ref.$db()) ? store_ref.$db() : false
    if (db) return store_ref.$store.$db().model(entityString);
    return
}

//DEMO FUNCTION get multiple where
//REMOVE?
static getProductByObject(where = {}) {
    if (R.isEmpty(where)) return false;
    const predWhere = R.whereEq(where);
    const user = Product.query()
        .where((_record, query) => {
            return (predWhere(_record)) ? _record : false
            // query.where('age', 20).orWhere('id', 1)
        })
        .get()
    console.log("seatching ", user)
    return user;
}


//this.$store.$db().model('products').query().withAll().first()


const list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
R.indexBy(R.prop('id'), list);
//=> {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}}

export default ormmodule2
