import {Model} from '@vuex-orm/core'
import {Variant} from "./../database";
import * as R from "ramda";

export const Editable_Defaults = {
    quantity: true,
    variant: true,
    addToCart: false,
    options: true,
}

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
    get TotalPrice() {
        return (this.Variant) ? (this.requested_quantity * this.Variant.price) : "not set"
    }
    get IsAvailable() {
        return this.Variant.IsAvailaxble;
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
