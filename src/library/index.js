//model list.
//import {Product, Variant, ProductImage, ProductOptionBase, ProductOption, VariantOption, ProductOptionValue, ProductInstanceSingle, ProductInstanceGroup} from './../database'

import VuexORM, {Database} from '@vuex-orm/core'
import axios from 'axios'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import Product from './models/Product'
import Variant from './models/Variant'
import ProductImage from './models/ProductImage'
import {ProductOptionBase, ProductOption, VariantOption, ProductOptionValue} from './models/ProductOption'
import {ProductInstanceBase,ProductInstanceSingle, LineItem} from './models/ProductInstance'
import {Cart,ProductInstanceGroup,ProductGroupBase} from './models/Cart'
import {SHOPIFY_BASE_URL} from "./settings";

const _database = new Database()
export {
    Product,
    Variant,
    ProductImage,
    ProductOptionBase,
    ProductOption,
    VariantOption,
    ProductOptionValue,
    ProductInstanceBase,
    ProductInstanceSingle,
    LineItem,
    ProductGroupBase,
    ProductInstanceGroup,
    Cart
}
_database.register(ProductGroupBase);

_database.register(ProductInstanceBase)
_database.register(ProductInstanceSingle)
_database.register(ProductInstanceGroup)

_database.register(ProductOptionBase)
_database.register(ProductOption)
_database.register(ProductOptionValue)

_database.register(Product)
_database.register(ProductImage)
_database.register(Variant);
_database.register(VariantOption);

_database.register(Cart)
_database.register(LineItem)
VuexORM.use(VuexORMAxios, {axios,
    headers: {
        'Content-Type': 'application/json',
    },
    baseURL: SHOPIFY_BASE_URL
})
export const database = VuexORM.install(_database)

export default database
