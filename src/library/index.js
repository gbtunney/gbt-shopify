//model list.
//import {Product, Variant, ProductImage, ProductOptionBase, ProductOption, VariantOption, ProductOptionValue, ProductInstanceSingle, ProductInstanceGroup} from './../database'

import VuexORM, {Database} from '@vuex-orm/core'
import axios from 'axios'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import Product from './models/Product'
import Variant from './models/Variant'
import ProductImage from './models/ProductImage'
import {ProductOptionBase, ProductOption, VariantOption, ProductOptionValue} from './models/ProductOption'
import {ProductInstanceSingle, ProductInstanceGroup} from './models/ProductInstance'

const _database = new Database()
export {
    Product,
    Variant,
    ProductImage,
    ProductOptionBase,
    ProductOption,
    VariantOption,
    ProductOptionValue,
    ProductInstanceSingle,
    ProductInstanceGroup
}



_database.register(ProductInstanceSingle)
_database.register(ProductInstanceGroup)

_database.register(ProductOptionBase)
_database.register(ProductOption)
_database.register(ProductOptionValue)

_database.register(Product)
_database.register(ProductImage)
_database.register(Variant);
_database.register(VariantOption);

VuexORM.use(VuexORMAxios, {axios})
export const database = VuexORM.install(_database)

export default database
