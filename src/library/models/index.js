import {Product} from './Product'
import {Variant} from './Variant'
import {ProductImage} from './ProductImage'
import {ProductOptionBase, ProductOption, VariantOption, ProductOptionValue} from './ProductOption'
import {ProductInstanceBase, ProductInstanceSingle, LineItem} from './ProductInstance'
import {Cart, ProductInstanceGroup, ProductGroupBase} from './Group'
///import {Shop} from './Shop'
import {ProductMetaAttr} from './ProductMetaAttr'
import {moduleLoadStatus} from '../modules/moduleLoadStatus'

const tempProductLoadModule = {
    state: {
        count: 15,
        fetching_map: [],
    },
    getters : {
        getProductLoader: (state) => (handle) => {
            if (!handle) return new Map(state.fetching_map);
            return new Map(state.fetching_map).get(handle) ? new Map(state.fetching_map).get(handle) : false
        }
    },
    mutations: {
        add (state, count) {
            state.count = state.count + count
        },
        addProductLoader(state, payload) {
            if (payload.handle) {
                // console.log( "log",Array.from(new Map(state.fetching_map)))
                state.fetching_map = Array.from(new Map(state.fetching_map).set(payload.handle, payload.status));
            }
        }
    }
}


const ALL_MODELS = [
   [ ProductInstanceBase,moduleLoadStatus],
    ProductInstanceSingle,
    ProductGroupBase,
    ProductInstanceGroup,
    ProductOptionBase,
    ProductOption,
    ProductOptionValue,
    [Product,tempProductLoadModule],
    ProductImage,
    Variant,
    VariantOption,
    Cart,
    LineItem
]

export const Models = ALL_MODELS;

export {
    Product,
    Variant,
    ProductImage,
    ProductGroupBase,
    ProductOptionBase,
    ProductInstanceBase,
    ProductOption,
    VariantOption,
    ProductOptionValue,
    ProductInstanceSingle,
    ProductInstanceGroup,
    LineItem,
    Cart,

}
export default Models;
