import {Model} from '@vuex-orm/core'
import {Variant, ProductImage, ProductOption, ProductOptionValue, VariantOption} from './..'
import {SHOPIFY_BASE_URL,ID_LENGTH} from "./../settings";
import * as R from 'ramda'
const {omit, pick} = R
import {getRandomNumber, slugify, toInteger} from "./../scripts/generic";
import {isShopifyID} from "../scripts/shopify";

//todo: get this from settings
export default class Product extends Model {
    static entity = 'products';

    static state ()  {
        return {
            fetching: false,
            ready: false,
        }
    }

    static afterCreate(model) {
        ///make pivot table.
        console.log("PRODUCT ::afterCreate ",model)
        Product.store().commit('entities/products/addProductLoader', {handle:model.handle,status:"NOT_LOADING"})
        model.createVariantOptionPivot()
    }

    static apiConfig = {
        actions: {
            fetchByHandle(handle) {
               Product.store().commit('entities/products/addProductLoader', {handle:handle,status:"LOADING"})
                return this.get(`/products/${handle}.json`,
                    {
                        dataTransformer: (response) => {
                            return Product.prototype.APITransformProductData(response.data.product)
                        }
                    }
                )
            },
            fetchAll() {
                Product.commit((state) => {
                    console.log("state commit6ing done", state)
                    state.fetching = true
                })
                return this.get(`/products.json`,
                    {
                        dataTransformer: (response) => {
                            let _products = response.data.products;
                            if (_products.length > 0) return _products.map(function (_product) {
                                return Product.prototype.APITransformProductData(_product)
                            })
                            else return _products;
                        }
                    }
                )
            }
        }
    }

    static fields() {
        return {
            id: this.number(getRandomNumber(ID_LENGTH)),
            handle: this.string(null), ///already a slug
            title: this.string(null),
            meta: this.string(null).nullable(),
            subtitle: this.string(null).nullable(), //from defaults
            body_html: this.string(null), //maybe strip html eventually
            ///"published_scope": "global",   //maybe scrap what isnt the right user
            vendor: this.string(null),
            product_type: this.string(null),
            tags: this.attr([], function (value) {
                var newarr = value.toString().split(',');
                return newarr.map(function (item) {
                    return item.toString().trim();
                })
            }),
            //DEFAULT VARIANT based on index?
            images: this.hasMany(ProductImage, "product_id"),
            variants: this.hasMany(Variant, "product_id"),

            options: this.hasMany(ProductOption, "product_id"),
            optionvalues: this.hasMany(ProductOptionValue, "product_id"),
            ///*******CALCULATED FIELDS
            Image: this.hasOne(ProductImage, 'product_id'),
            /// Options: this.hasMany(ProductOption, "product_id"),
            /*
             reccomended :this.hasMany(ProductMetaAttr,  id)
             download: this.hasOne()(ProductMetaAttr,  id) */
        }
    }

    get Images() {
        return this.images;
    }

    get Variants() {
        return this.variants;
    }

    get Options(){
        return this.options
    }

    static handleToID(handle) {
        var _product = Product.query().where("handle", handle).first();
        if (_product && _product.id && isShopifyID(_product.id)) return toInteger(_product.id)
        return false;
    }

    static getProductByHandle(handle) {
        return Product.query().where("handle", handle).first();
    }
    //DEMO FUNCTION
    static getProductByObject(where={}) {
        if (  R.isEmpty(where) ) return false;
        const predWhere = R.whereEq(where);
        const user = Product.query()
            .where((_record, query) => {
                return ( predWhere(_record) ) ? _record : false
              // query.where('age', 20).orWhere('id', 1)
            })
            .get()
        console.log("seatching " ,  user)
        return user;
    }

}

/*INCOMING DATA: n*/ //TODO: shoud be switched to static method.
Product.prototype.APITransformProductData = function (_product) {
    //make id public
    let product_ID = _product.id;
    let option_arr = []
    if (_product.options) {

        option_arr = _product.options.map(function (_option) {
            let parent = _option;
            let expandedValues = _option.values.map(function (value, index) {
                return {
                    product_id: product_ID, ///from parent
                    sid: parent.id, //hthhihs shhould probs  be an option id
                    handle: slugify(value),
                    title: value,
                    position: (index + 1),
                }
            })
            //new parent option props
            let newOptionProps = {
                sid: _option.id,
                handle: _option.name,
                title: _option.name,
                values: expandedValues
            }
            //remove id and merge options. parent option
            return {...omit(["id"], _option), ...newOptionProps}
        })
    }
    return {..._product, ...{options: option_arr}};
}

Product.prototype.createVariantOptionPivot = function () {
    let _product_id = this.id;
    if (_product_id) {
        const _variants = Variant.query().where("product_id", _product_id).with('options').all();
        if (_variants && _variants.length > 0) {
            _variants.forEach(function (_variant) {
                let variant = _variant;
                if (_variant.options && _variant.options.length > 0) {
                    _variant.options.forEach(function (option_value) {
                        VariantOption.insert({
                            data: {
                                variant_id: variant.id,
                                option_value_id: option_value.id,
                                /*thumbnail_id: (variant.Image) ? variant.Image.id : false*/
                            }
                        })
                    })
                }
            })
        }
    }
}
