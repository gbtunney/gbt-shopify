import {Model} from '@vuex-orm/core'
import {Variant,Product} from "./..";
import * as R from "ramda";
import {Editable_Defaults} from "../settings";
import {isShopifyID} from "../scripts/shopify";
import {getContainsLetter, getHasLetter, stringContainsUppercase, toInteger} from "../scripts/generic";

export class ProductInstanceSingle extends Model {
    static entity = 'productsingle'

    static fields() {
        return {
            id: this.uid(),
            timestamp: this.number(0, value => Date.now()),
            message: this.string(null),
            meta: this.string(null),

            //*** variant linked with instance ( ie could be not for sale variant with group etc.
            variant_id: this.number(null),
            Variant: this.hasOne(Variant, "id", "variant_id"),

            requested_quantity: this.number(1),
            group_id: this.number(null),
            Group: this.belongsTo(ProductInstanceGroup, "group_id"),

            //*** preferences
            add_to_cart_enabled: this.boolean(Editable_Defaults["addToCart"]), /// this is bool to allow a add to cart button for TOTAL GROUP.
            quantity_editable: this.boolean(Editable_Defaults["quantity"]),
            variant_editable: this.boolean(Editable_Defaults["variant"]),
            options_editable: this.attr(Editable_Defaults["options"]), //future pref dont know when implement
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
    get TotalPrice() {
        return (this.Variant) ? (this.requested_quantity * this.Variant.price) : "not set"
    }
    get IsAvailable() {
        return this.Variant.IsAvailaxble;
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

export class ProductInstanceGroup extends Model {
    static entity = 'productgroup'

    static fields() { //this used ti be inherited but it was a pain in the ass
        return {
            id: this.number(this.uid()),
            timestamp: this.number(0, value => Date.now()),
            message: this.string(null),
            meta: this.string(null),

            //*** variant linked with instance ( ie could be not for sale variant with group etc.
            variant_id: this.number(null),
            Variant: this.hasOne(Variant, "id", "variant_id"),

            //*** preferences
            add_to_cart_enabled: this.boolean(false), /// this is bool to allow a add to cart button for TOTAL GROUP.

            //*********** The Child instances in group.
            ProductInstances: this.hasMany(ProductInstanceSingle, "group_id"),
            max_children: this.number(1), //the max instanxes per group
        }
    }

    get TotalPrice() {
        let accumulator = 0;
        if (this.ProductInstances) {
            this.ProductInstances.forEach(function (item) {
                if (item && item.Variant) {
                    accumulator = Number(item.TotalPrice) + accumulator;
                }
            })
        }
        return accumulator;
        //add the array of item prices.
    }

    get IsAvailable() {
        return this.ProductInstances.reduce(function (item, bool) {
            if (!item.IsAvailable) return false;
            return bool;
        }, true);
        //if one is unavailable the rest are false.
    }
}
export default ProductInstanceSingle
