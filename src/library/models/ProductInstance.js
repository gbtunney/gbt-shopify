import {Model} from '@vuex-orm/core'
import  {Variant, Product, ProductInstanceGroup,Cart} from "./..";
import * as R from "ramda";
import {Editable_Defaults} from "../settings";
import {isShopifyID} from "../scripts/shopify";
import {getContainsLetter, getHasLetter, stringContainsUppercase, toInteger} from "../scripts/generic";

export class ProductInstanceBase extends Model {
    static entity = 'productbase'
    static types () {
        return {
            INSTANCE: ProductInstanceSingle,
            LINE_ITEM: LineItem
        }
    }

    static fields() {
        return {
            id: this.uid(),
            type: this.attr('INSTANCE'),
            timestamp: this.number(0, value => Date.now()),
            properties: this.attr({message:false}),
            meta: this.string(null),
            url:this.string(null),
            //*** variant linked with instance ( ie could be not for sale variant with group etc.
            handle: this.string(null),
            group_id: this.number(null),
            variant_id: this.number(null),
            Variant: this.hasOne(Variant, "id", "variant_id"),

            //*** preferences
            add_to_cart_enabled: this.boolean(Editable_Defaults["addToCart"]), /// this is bool to allow a add to cart button for TOTAL GROUP.
            quantity_editable: this.boolean(Editable_Defaults["quantity"]),
            variant_editable: this.boolean(Editable_Defaults["variant"]),
            options_editable: this.attr(Editable_Defaults["options"]), //future pref dont know when implement
        }
    }
    static beforeCreate (model) {
        // Do something.
        if (model && model.handle){
            const {handle } = model;
            const product =  Product.query().where("handle", handle ).withAll().first();
            console.log("__________trying to get a product !!!!!",handle);
            if (!product )  Product.api().fetchByHandle(handle)
        }
        /* if (!this.Product) {
      const response = await Product.api().fetchByHandle(this.Handle)
    }*/
    }
    static mutators() {
        return {
            variant_id (value) {
                if (!value) return value
                //console.log("trying to set id",value);
                if ( isShopifyID(value) ) return toInteger(value)
                if (R.is(String, value) && getContainsLetter(value)){
                    if (stringContainsUppercase(value)) { ///if contains an uppercase, its not a handle
                        let _variant = Variant.query().where("sku", value).first();
                        console.log("searching for sku", _variant);
                        if (_variant && _variant.id) return _variant.id
                    }
                    let search_handle = value;
                    let search_position = 1;
                    if (value.contains("|")) {
                        console.log("contains pipe char, checking for handle and integer")
                        let arr = value.split('|');
                        if (arr && arr.length >= 2) {
                            search_handle = arr[0];
                            search_position = toInteger(arr[1], 1);
                        }
                    }
                    let _product = Product.query().where("handle", search_handle).first();
                    console.log(" ifffffs prodduct handle", search_handle, search_position, _product);
                    if (_product && _product.id) {
                        let foundVariant = Variant.query().where("product_id", _product.id).where("position", search_position).first()
                        console.log(" foundVariante", foundVariant);
                        if (foundVariant && foundVariant.id) return foundVariant.id
                    }
                }
                return
            },
            options_editable(value) {
                if (R.is(Boolean, value)) return value;
                else if (R.is(Array, value)) {     //expand to map
                    console.log("setting option map.", value)
                    return value.reduce((accumulator, currentValue, currentIndex, array) => {
                        if (currentValue) return accumulator.set(currentValue, true)
                    }, new Map());
                }
            }
        }
    }
}

export class ProductInstanceSingle extends ProductInstanceBase {
    static entity = 'productsingle'
    static baseEntity = 'productbase'

    static fields() {
        return {
            ...super.fields(),
            requested_quantity: this.number(1),
          //  group_id: this.number(null),
            Group: this.belongsTo(ProductInstanceGroup, "group_id"),

                }
    }
    static mutators() {
        return {
            variant_id (value) {
                if (!value) return value
                //console.log("trying to set id",value);
                if ( isShopifyID(value) ) return toInteger(value)
                if (R.is(String, value) && getContainsLetter(value)){
                    if (stringContainsUppercase(value)) { ///if contains an uppercase, its not a handle
                        let _variant = Variant.query().where("sku", value).first();
                        console.log("searching for sku", _variant);
                        if (_variant && _variant.id) return _variant.id
                    }
                    let search_handle = value;
                    let search_position = 1;
                    if (value.contains("|")) {
                        console.log("contains pipe char, checking for handle and integer")
                        let arr = value.split('|');
                        if (arr && arr.length >= 2) {
                            search_handle = arr[0];
                            search_position = toInteger(arr[1], 1);
                        }
                    }
                    let _product = Product.query().where("handle", search_handle).first();
                    console.log(" ifffffs prodduct handle", search_handle, search_position, _product);
                    if (_product && _product.id) {
                        let foundVariant = Variant.query().where("product_id", _product.id).where("position", search_position).first()
                        console.log(" foundVariante", foundVariant);
                        if (foundVariant && foundVariant.id) return foundVariant.id
                    }
                }
                return
            },
            options_editable(value) {
                if (R.is(Boolean, value)) return value;
                else if (R.is(Array, value)) {     //expand to map
                    console.log("setting option map.", value)
                    return value.reduce((accumulator, currentValue, currentIndex, array) => {
                        if (currentValue) return accumulator.set(currentValue, true)
                    }, new Map());
                }
            }
        }
    }
    /**
     * Add given prefix to the user's full name.
     */
    prefix (prefix) {
        return `${prefix} ${this.variant_id}`
    }
    get LinePrice() {  //requested quantity * price.
        return (this.Variant) ? (this.requested_quantity * this.Variant.price) : "not set"
    }
    get TotalPrice() {
        return (this.Variant) ? (this.requested_quantity * this.Variant.price) : "not set"
    }
    get IsAvailable() {
        return this.Variant.IsAvailable;
    }
    get LineItem(){
       let cartMeta ;
        if ( this.message ){
            cartMeta=  {
              message: this.message
            }
        }
        console.log("cart meta", cartMeta)
       return { id :this.variant_id,
            quantity: this.requested_quantity,
            properties: cartMeta
        }
    }
}
ProductInstanceSingle.prototype.get_option_editable = function (_key = false) {
    if (R.is(Boolean, this.options_editable)) return this.options_editable;
    const _map = new Map(this.options_editable);
    return (_key && _map && _map.get(_key)) ? _map.get(_key) : false;
}

export class LineItem extends ProductInstanceBase {
    static entity = 'lineitem'
    static baseEntity = 'productbase'
    static fields() {
        return {
            ...super.fields(),
            //*********** The Child value instances
            key: this.string(null),
            quantity: this.number(1),

            Group: this.belongsTo(Cart, "group_id"),

            featured_image:this.attr(null),
            title: this.string(null),
            price: this.number(null),
            original_price: this.number(null),
            discounted_price: this.number(null),
            original_line_price: this.number(null),
            line_price: this.number(null),
            total_discount: this.number(null),
            final_price: this.number(null),
            final_line_price: this.number(null),
            product_has_only_default_variant: this.boolean(false),
          //etc etc/
        }
    }
    static apiConfig = {
        actions: {
            updateItem(line_item) {
                const _line_item = line_item;
                return this.post(`/cart/update.js`,
                    {
                        save: false,
                        updates: {
                            [_line_item.id] : _line_item.quantity
                        }
                    }
                )
            },
        }
    }
}
export default ProductInstanceSingle
