import {Product} from './Product'
import {Variant} from './Variant'
import {ProductImage} from './ProductImage'
import {ProductOptionBase, ProductOption, VariantOption, ProductOptionValue} from './ProductOption'
import {ProductInstanceBase, ProductInstanceSingle, LineItem} from './ProductInstance'
import {Cart, ProductInstanceGroup, ProductGroupBase} from './Group'
///import {Shop} from './Shop'
import {ProductMetaAttr} from './ProductMetaAttr'
import {moduleLoadStatus} from '../modules/moduleLoadStatus'

const ALL_MODELS = [
    ProductInstanceBase,
    ProductInstanceSingle,
    ProductGroupBase,
    ProductInstanceGroup,
    ProductOptionBase,
    ProductOption,
    ProductOptionValue,
    [Product,moduleLoadStatus],
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
