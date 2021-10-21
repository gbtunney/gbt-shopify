//for ajax api, no token needed.
export const SHOPIFY_BASE_URL = 'https://o-wool-stage.myshopify.com';

export const Editable_Defaults = {
    quantity: true,
    variant: true,
    addToCart: false,
    options: true,
}

export const MINIMUM_QUANTITY = 1;

export const ID_LENGTH = 10000000000;

export const USE_SERVER  = false;

export const LOAD_MODE = ['LOAD_ALL','LOAD_HANDLE_ALWAYS','LOAD_HANDLE_NOT_IN_DATABASE','LOAD_NEVER']

export const SELECTION_MODE_OPTIONS = {
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
