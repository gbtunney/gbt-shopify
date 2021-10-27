import Vue from "vue";
import VTooltip from 'v-tooltip'
import {importantConsoleLog} from "./../scripts/generic";

const LOCAL_STORAGE_KEY = "owoolvuex"

//for ajax api, no token needed.
const SHOPIFY_BASE_URL = 'https://o-wool-stage.myshopify.com';

const Editable_Defaults = {
    quantity: true,
    variant: true,
    addToCart: false,
    options: true,
}
const ID_LENGTH = 10000000000;

const LOAD_MODE = ['LOAD_ALL', 'LOAD_HANDLE_ALWAYS', 'LOAD_HANDLE_NOT_IN_DATABASE', 'LOAD_NEVER']

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

export const gVueUtils = {
    // eslint-disable-next-line no-unused-vars
    install(Vue, options) {
        console.log("VUE PLUGIN HAS BEEN CALLED!!!!", options)
        Vue['$gbtconfig'] = {SHOPIFY_BASE_URL}
        Vue.prototype.$gbtconfig = {SHOPIFY_BASE_URL}
        console.important = importantConsoleLog;
        Vue.use(VTooltip)
        //TODO: wrap this???
        Vue.filter('toCurrency', function (value) {
            if (typeof value !== "number") {
                return value;
            }
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            });
            return formatter.format(value);
        });
    }
};

export default gVueUtils;
