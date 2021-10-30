
import {importantConsoleLog, toArray} from "./../scripts/generic";
import {registerConfig} from "../scripts/vuehelpers";

const BASE_CONFIG = { // base non-project stuff.
    "SID_LENGTH" :  10000000000,
    "LOAD_MODE":  ['LOAD_ALL', 'LOAD_HANDLE_ALWAYS', 'LOAD_HANDLE_NOT_IN_DATABASE', 'LOAD_NEVER'],
    "MINIMUM_QUANTITY" : 1,
    "LOCAL_STORAGE_KEY" : "vuex_no_name"
}

const Editable_Defaults = {
    quantity: true,
    variant: true,
    addToCart: false,
    options: true,
}
const SELECTION_MODE_OPTIONS = {
    extended: {
        load_mode: "LOAD_HANDLE_ALWAYS",
        quantity_editable: true,
        variant_editable: true,
        add_to_cart_enabled: true,
        options_editable: true,
    },
    normal: {
        load_mode: "LOAD_HANDLE_NOT_IN_DATABASE",
        quantity_editable: true,
        variant_editable: true,
        add_to_cart_enabled: true,
        options_editable: false,
    },
    readonly: {
        load_mode: "LOAD_NEVER",
        quantity_editable: false,
        variant_editable: false,
        add_to_cart_enabled: true,
        options_editable: false,
    },
    lineitem: {
        load_mode: "LOAD_NEVER",
        quantity_editable: true,
        variant_editable: false,
        add_to_cart_enabled: false,
        options_editable: false,
    }
}

/*const configObject = {
    register: Vue, /// class like Vuex, VuexORM , Vue,
    enabled: true,
    filter :{
        toCurrency:  function (value) {
            if (typeof value !== "number") {
                return value;
            }
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            });
            return formatter.format(value);
        }
    },
    mixin:{},
    directive: { 'pin' :  {
            bind: function (el, binding, vnode) {
                el.style.background = 'red'
                el.style.position = 'fixed'
                el.style.top = binding.value + 'px'
            }
        }
        },
    component:{},
    use:{
        "v-tooltip": {
            enabled: true,
            params: VTooltip
        },
    }
}*/

export const gVueUtils = {
    // eslint-disable-next-line no-unused-vars
    install(Vue, options= {} ) {

        const { settings , config  } =options;
        Vue['$gbtconfig'] =  {...BASE_CONFIG,...settings}
        Vue.prototype.$gbtconfig = {...BASE_CONFIG,...settings}
        console.important = importantConsoleLog;

        var configArr  = toArray(config)
        configArr.forEach(function(_config){
            console.log("settings !!!!!!", _config)

            registerConfig(_config)
        })


    },
    register( _config ){
        registerConfig(_config)
    }
};

export default gVueUtils;
