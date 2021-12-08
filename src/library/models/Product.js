/** Product **
 * @model Product
 * @entity - products */

import {Model} from '@vuex-orm/core'
import {ProductImage, ProductOption, ProductOptionValue, VariantOption} from './index'
import Variant from './Variant'
import {axios_wait, getRandomNumber, isInteger, randomInt, slugify, toInteger} from "./../scripts/generic";
import {isShopifyID} from "../scripts/shopify";

const R = window.R
//todo: get this from settings
import settings from "./../settings.json"
const {UID_LENGTH} = settings

export class Product extends Model {
    static entity = 'products';

    static state() {
        return {
            fetching: false,
            ready: false,
        }
    }

    static afterUpdate(model) {
        Product.store().dispatch('orm/logOrmEvent', ['afterUpdate', model, '', 'background:blue;color:white;'])
    }

    static afterCreate(model) {
        model.createVariantOptionPivot()
        Product.store().dispatch('orm/logOrmEvent', ['afterCreate', model, [model.title], 'background:purple;color:white;'])
    }

    static apiConfig = {
        actions: {
            fetchByHandle(handle) {
                return this.get(`/products/${handle}.json`,
                    {
                        dataTransformer: (response) => {
                            return APITransformProductData(response.data.product)
                        }
                    }
                ).then(value => axios_wait(randomInt(6000, 9000), value))
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
                                return APITransformProductData(_product)
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
            id: this.uid(() => getRandomNumber(UID_LENGTH)),
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
    //************** GETTERS  *****************//
    get Images() {
        return ProductImage.query().where("product_id", this.id).orderBy('position').with('Variants.options.Variants').all()
    }

    get Variants() {
        return Variant.query().where("product_id", this.id).orderBy('position').with('options.Variants|image').all()
    }

    get Options() {
        return ProductOption.query().where("product_id", this.id).orderBy('position').withAll().all()
    }

    //************** INSTANCE METHODS  *****************//
    ///get the parent options
    getOption(value = false) {
        if (!value || R.isEmpty(value)) return
        var _optionHandle = false

        if (R.is(Object, value) && value['handle']) {
            _optionHandle = value['handle']
        }
        if (R.is(String, value)) {
            /*assume it is a hhandle*/
            _optionHandle = value
        }
        return ProductOption
            .query()
            .where("product_id", this.id)
            .where("handle", _optionHandle)
            .withAll().first();
    }

    getOptionValueList(value = false,
                       relations = true,
                       sortBy = 'title',
                       colorCompareHex= '#FF0000') {
        if (!value || R.isEmpty(value)) return
        var _optionParentHandle = false
        var _query;
        if (R.is(Object, value) && value['handle']) {
            _optionParentHandle = value['handle']
        }
        if (R.is(String, value)) {
            /*assume it is a hhandle*/
            _optionParentHandle = value
        }
        _query = ProductOptionValue
            .query()
            .where("product_id", this.id)
            .where("parent_handle", _optionParentHandle)
            .orderBy(sortBy)

        if (relations == true) return _query.withAll().all();
        if (relations == false) return _query.all();
        if (R.is(String, relations)) return _query.with(relations).all();
     /*   _query.map(function(value){
            value.compareColor( colorCompareHex )
                //const orderedArray = inventors.sort((personA, personB) => personA.year > personB.year ? 1 : -1)
        })*/
        return false
    }

     createVariantOptionPivot() {
        const _variants = Variant.query().where("product_id", this.id).with('options').all()
        const product_pivot = _variants.reduce((accumulator, currentValue, currentIndex, array) => {
            return [...accumulator, ...currentValue.pivots]
        }, []);
         VariantOption.create({
            data: product_pivot
        })
    }

    //************** STATIC METHODS  *****************//
    /** Any product handle to ID  */
    static productHandleToID(handle) {
        var _product = Product.query().where("handle", handle).first();
        if (_product && _product.id && isShopifyID(_product.id)) return toInteger(_product.id)
        return false;
    }

    /** Get any product by handle  */
    //TODO : Keep
    static getProductByHandle(handle, relations = true) {  //todo: withs????
        const _query = Product.query().where("handle", handle)
        if (relations == true) return _query.withAll().first();
        if (relations == false) return _query.first();
        if (R.is(String, relations)) return _query.with(relations).first();
    }
}

//REMOVE?
/*INCOMING DATA: n*/ //TODO: shoud be switched to static method.
export const APITransformProductData = function (_product) {
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
                    handle: slugify(value), //for some reason this doesnt property apply mutation for handle.
                    parent_handle : slugify(_option.name),
                    title: value,
                    position: (index + 1),
                }
            })
            //new parent option props
            let newOptionProps = {
                sid: _option.id,
                handle: slugify(_option.name),
                title: _option.name,
                values: expandedValues
            }
            //remove id and merge options. parent option
            return {...R.omit(["id"], _option), ...newOptionProps}
        })
    }
    return {..._product, ...{options: option_arr}};
}

export default Product
