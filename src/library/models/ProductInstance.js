import {Model} from '@vuex-orm/core'
import  {Variant, Product, ProductInstanceGroup,Cart} from "./..";
import {Editable_Defaults, ID_LENGTH, SELECTION_MODE_OPTIONS} from "../settings";
import {isShopifyID} from "../scripts/shopify";
import * as R from 'ramda'
import {
    cloneObject,
    getContainsLetter,
    getHasLetter,
    getRandomNumber,
    stringContainsUppercase,
    toInteger
} from "../scripts/generic";

const { pick} = R

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
            id: this.number(getRandomNumber(ID_LENGTH)),
            type: this.attr('INSTANCE'),
           /* timestamp: this.number(0, value => Date.now()),*/
            properties: this.attr({message:false}),
            meta: this.string(null),
            url:this.string(null),
            //*** variant linked with instance ( ie could be not for sale variant with group etc.
            handle: this.string(false).nullable(),
            group_id: this.number(null),
            variant_id: this.number(1),
            Variant: this.hasOne(Variant, "id", "variant_id"),

            //*** preferences
            selection_mode : this.string ("normal").nullable(),
            add_to_cart_enabled: this.boolean(Editable_Defaults["addToCart"]), /// this is bool to allow a add to cart button for TOTAL GROUP.
            quantity_editable: this.boolean(Editable_Defaults["quantity"]),
            variant_editable: this.boolean(Editable_Defaults["variant"]),
            options_editable: this.attr(Editable_Defaults["options"]), //future pref dont know when implement
        }
    }
    get Entity(){
        return {entity : this.constructor.entity,baseEntity:  this.constructor.entity}
    }
    getClone(mode = false, idList = []) {
        return cloneObject(this.$toJson(), mode, idList)
    }
    _updateWhere(where = {}, values = false) {
        if (!values || R.isEmpty(where)) return false;
        const predWhere = R.whereEq(where);
        ProductInstanceBase.update({
            where: (instance) => {
                return predWhere(instance)
            },
            data: {active: true}
        })
    }

    _updateByID(values, mode = false, idList = []) {
        if (!values) return;
        ProductInstanceBase.update({...values, id: this.id})
        return;
    }
    _update(values,mode = false, idList = []) {
      //  return cloneObject(this.$toJson(), mode, idList)
    }
    get VariantID() {
        if (this.variant_id) {
            if (isShopifyID(this.variant_id)) return toInteger(this.variant_id)
            if (this.handle) {
                const _product_id = Product.handleToID(this.handle);
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
   /* static beforeCreate (model) {
    }*/
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
           /* variant_id (value) {
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
            },*/
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
    get NewLineItem() {
        const newObj = {...this.$toJson(), 'quantity': this.$toJson()['requested_quantity'],
          'id' : this.variant_id };
        return pick(['id', 'quantity', 'properties'], newObj)
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
    static afterCreate(model) {
        console.log("!!!!!!!!!NEW LINE ITEM CREATEE!!!!!!",model, model.type)
    }
    static fields() {
        return {
            ...super.fields(),
            //*********** The Child value instances
            key: this.string(null),
            quantity: this.number(1),

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
