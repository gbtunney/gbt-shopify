import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";
import axios from "axios";
import {SHOPIFY_BASE_URL} from "../library/settings";
import VuexORMSearch from "@vuex-orm/plugin-search";
import VuexORMisDirtyPlugin from "@vuex-orm/plugin-change-flags";
import Vue from "vue";
import VTooltip from "v-tooltip";

export default  config = [ {
    register: VuexORM, /// class like Vuex, VuexORM , Vue,
    enabled: true,
    use: {   ///plugins that 'use'
        "@vuex-orm/plugin-axios": {
            enabled: true,
            params: [VuexORMAxios, {
                axios,
                baseURL: SHOPIFY_BASE_URL
            }]
        },
        "@vuex-orm/plugin-search": {
            enabled: true,
            params:[
                VuexORMSearch,{
                    caseSensitive: true,
                    threshold: 0
                }
            ]
        },
        "@vuex-orm/plugin-change-flags": {
            enabled: true,
            params: VuexORMisDirtyPlugin
        }
    },
},
    {
        register: Vue, /// class like Vuex, VuexORM , Vue,
        enabled: true,
        use: {
            "v-tooltip": {
                enabled: true,
                params: VTooltip
            },
        },
    }
]
