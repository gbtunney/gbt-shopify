/*export {ProductInstanceBase,ProductInstanceSingle, LineItem} */

/* * ProductInstanceBase *
* @model - ProductInstanceBase
* @entity {string}- productbase */

/* * ProductInstanceSingle *
* @model ProductInstanceSingle
* @extends {class}- ProductInstanceBase
* @entity {string}- productsingle
* @baseentity {string}- ..productbase */

/* * LineItem *
* @module LineItem
* @extends {class}- ProductInstanceBase
* @entity {string}- lineitem
* @baseentity {string}- productbase */

import {Model} from '@vuex-orm/core'
import {Variant, Product, ProductInstanceGroup, Cart} from "./";
import {Editable_Defaults, ID_LENGTH, SELECTION_MODE_OPTIONS} from "../settings";
import {isShopifyID} from "../scripts/shopify";
import {
    cloneObject,
    getContainsLetter,
    getHasLetter,
    getRandomNumber, isInteger,
    stringContainsUppercase,
    toInteger
} from "../scripts/generic";
import {upperCase} from "../scripts/stringUtils";

const R = window.R;
//************** End Imports *****************//

const BASE_ENTITY = 'productbase' //todo: change name

export class ProductInstanceBase extends Model {
    static entity = BASE_ENTITY

    static types() {
        return {
            INSTANCE: ProductInstanceSingle,
            LINE_ITEM: LineItem
        }
    }

    static fields() {
        return {
            id: this.uid(() => getRandomNumber(ID_LENGTH)),
            type: this.attr('INSTANCE'),
            /* timestamp: this.number(0, value => Date.now()),*/
            properties: this.attr({message: false}),
            meta: this.string(null),
            url: this.string(null),
            //*** variant linked with instance ( ie could be not for sale variant with group etc.
            handle: this.string(false).nullable(),
            group_id: this.number(null).nullable(),
            variant_id: this.number(1),
            Variant: this.hasOne(Variant, "id", "variant_id"),
            quantity: this.number(1),
            //*** preferences
            selection_mode: this.string("normal").nullable(),
            add_to_cart_enabled: this.boolean(Editable_Defaults["addToCart"]), /// this is bool to allow a add to cart button for TOTAL GROUP.
            quantity_editable: this.boolean(Editable_Defaults["quantity"]),
            variant_editable: this.boolean(Editable_Defaults["variant"]),
            options_editable: this.attr(Editable_Defaults["options"]), //future pref dont know when implement
        }
    }

    static afterUpdate(model) {
        ProductInstanceBase.store().dispatch('orm/logOrmEvent', ['afterUpdate', model])
        ProductInstanceBase.store().commit('entities/productbase/increment', 1)
    }

    static afterCreate(model) {
        ProductInstanceBase.store().dispatch('orm/logOrmEvent', ['afterCreate', model, [], 'red'])
        //ProductInstanceBase.store().commit('entities/productbase/counter_reset', 5)
    }

    //REMOVE ???
    ///** STATIC METHHIDS KEEP!!!!!! */  ////MOVE IDK ????
    getClone(mode = false, idList = []) {
        return cloneObject(this.$toJson(), mode, idList)
    }

////TODO::
    ///REMOVE????????????
    _updateByID(values, mode = false, idList = []) {
        if (!values) return;
        ProductInstanceBase.update({...values, id: this.id})
        return;
    }

    get VariantID() {
        if (this.variant_id) {
            if (isShopifyID(this.variant_id)) return toInteger(this.variant_id)
            if (this.handle) {
                const _product_id = Product.productHandleToID(this.handle);
                const position_index = (toInteger(this.variant_id) > 0) ? toInteger(this.variant_id) : 1;
                const _variant = Variant.query()
                    .where("product_id", _product_id)
                    .where("position", position_index)
                    .withAll().first()
                if (_variant && _variant.id && isShopifyID(_variant.id)) {
                    this.variant_id = toInteger(_variant.id);
                    return toInteger(_variant.id);
                }
            }
        }
        return false;
    }

    static mutators() {
        return {
            selection_mode(value) {
                return (Object.keys(SELECTION_MODE_OPTIONS).indexOf(value) >= 0) ? value : false
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
    static baseEntity = BASE_ENTITY

    static fields() {
        return {
            ...super.fields(),
            quantity: this.number(1),
             group_id: this.number(null),
            Group: this.belongsTo(ProductInstanceGroup, "group_id"),

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

    /**
     * Add given prefix to the user's full name.
     */
    prefix(prefix) {
        return `${prefix} ${this.variant_id}`
    }

    get LinePrice() {  //requested quantity * price.
        return (this.Variant) ? (this.quantity * this.Variant.price) : "not set"
    }

    get TotalPrice() {
        return (this.Variant) ? (this.quantity * this.Variant.price) : "not set"
    }

    get IsAvailable() {
        return this.Variant.IsAvailable;
    }

    ///REMOVE???/
    //TODO???
    get NewLineItem() {
        const newObj = {
            ...this.$toJson(), 'quantity': this.$toJson()['quantity'],
            'id': this.variant_id
        };
        return R.pick(['id', 'quantity', 'properties'], newObj)
    }
}
//TODO::::REMOVE
ProductInstanceSingle.prototype.get_option_editable = function (_key = false) {
    if (R.is(Boolean, this.options_editable)) return this.options_editable;
    const _map = new Map(this.options_editable);
    return (_key && _map && _map.get(_key)) ? _map.get(_key) : false;
}

export class LineItem extends ProductInstanceBase {
    static entity = 'lineitem'
    static baseEntity = BASE_ENTITY

    static fields() {
        return {
            ...super.fields(),
            //*********** The Child value instances
            key: this.string(null),
            Group: this.belongsTo(Cart, "id"),
            featured_image: this.attr(null), // TODO: this is an object, maybe convert to an image
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

    //todo:remove
    static apiConfig = {
        actions: {
            updateItem(line_item) {
                const _line_item = line_item;
                return this.post(`/cart/update.js`,
                    {
                        save: false,
                        updates: {
                            [_line_item.id]: _line_item.quantity
                        }
                    }
                )
            },
        }
    }
}
/*

export {
    ProductInstanceBase,
    ProductInstanceSingle,
    LineItem
}
*/

export default ProductInstanceSingle
