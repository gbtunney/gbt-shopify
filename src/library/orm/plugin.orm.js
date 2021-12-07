import axios from "axios";
import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";
import VuexORMisDirtyPlugin from '@vuex-orm/plugin-change-flags';
import VuexORMSearch from "@vuex-orm/plugin-search";

import settings from "./../settings.json"

import {registerModels} from "./database";
import {registerGlobalVariable} from "../scripts/vuehelpers";
import {importantConsoleLog} from "../scripts/generic";

const {SHOPIFY_BASE_URL}= settings

export const PluginOrm = {
    install (Vue, options = {}) {
       // if (install.installed) return
       // install.installed = true

        registerGlobalVariable('axios',axios)
        console.important = importantConsoleLog;

        VuexORM.use( VuexORMAxios, {
            axios,
            baseURL: SHOPIFY_BASE_URL
        })

        VuexORM.use(VuexORMSearch, {
            caseSensitive: true,
            threshold: 0
        })

        VuexORM.use(VuexORMisDirtyPlugin,{
            isNewFlagName: 'IsNew',
            isDirtyFlagName: 'IsDirty',
            exposeFlagsExternally: false
        })

        // const finalOptions = {}
        //merge(finalOptions, defaultOptions, options)

        //plugin.options = finalOptions
        //vtooltip.options = finalOptions

        //  Vue.directive('tooltip', vtooltip)
        // Vue.directive('close-popover', vclosepopover)
        // Vue.component('VPopover', Popover)
    }
}
