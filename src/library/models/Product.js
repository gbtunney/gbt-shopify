import {Model} from '@vuex-orm/core'
import {Variant,ProductImage,ProductOption,ProductOptionValue}from './../database'
import {SHOPIFY_BASE_URL} from "./../settings";

import * as R from 'ramda'
const {omit, pick} = R
import {slugify} from "./../scripts/generic";

//todo: get this from settings
export default class Product extends Model {
    static entity = 'products';

    static state ()  {
        return {    testMe: true,
            fetching: false,
            ready: false,
        }
    }

    static afterCreate(model) {
        ///so thhis calls after it is created.
        Product.commit((state) => {
          //  console.log("state", state)
            state.ready = true
        })
    }

    static apiConfig = {
        actions: {
            fetchByHandle(handle) {
                return this.get(`/products/${handle}.json`,
                    {
                        baseURL: SHOPIFY_BASE_URL,
                        dataTransformer: (response) => {
                            return Product.prototype.APITransformProductData(response.data.product)
                        }
                    }
                )
            },
            fetchAll() {
                return this.get(`/products.json`,
                    {
                        baseURL: SHOPIFY_BASE_URL,
                        dataTransformer: (response) => {
                            return response.data.products
                        }
                    }
                )
            }
        }
    }

    static fields() {
        return {
            id: this.number(null), //TODO: keeping this as a STRING (bc generic doesnt work wtf) type BC possibble string/int clash with shopify
            handle: this.string(null), ///already a slug
            title: this.string(null),
            subtitle: this.string("tihs is a test subtitle"), //from defaults
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
}
/*INCOMING DATA: n*/
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
