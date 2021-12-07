//init orm database
import VuexORM, {Database} from '@vuex-orm/core'
import {toArray} from "../scripts/generic";

//todo: see if "entity" variable really breaks things???

function initDatabase(_database, models = []) {
    let database = _database
    models.forEach(function (model) {
        database.register(...toArray(model) )
    })
}

export function registerModels(config) {
    // Create a new instance of Database.
    let _database = new VuexORM.Database()
    const {models = []} = config;
    initDatabase(_database, models)
    return VuexORM.install(_database)
}
