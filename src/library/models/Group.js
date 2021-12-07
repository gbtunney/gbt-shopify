/* * exports { ProductGroupBase,ProductInstanceGroup,Cart }*/
/** ProductGroup
 * @baseentity ProductGroupBase - productgroupbase
 * @entity ProductInstanceGroup - productgroup
 * @entity Cart - cart */

//**************  ProductGroupBase *****************//
/* * @model ProductGroupBase
* @entity productgroupbase */

/** @model  - ProductInstanceGroup
 * @entity  - productgroup
 * @baseentity  - productgroupbase */

/** @model  - Cart
 * @entity  - cart
 * * @baseentity  - productgroupbase */

import {Model} from '@vuex-orm/core'
import {ProductInstanceSingle, LineItem, Variant} from './'
import {getRandomNumber, isInteger, toInteger} from "../scripts/generic";
import {ID_LENGTH} from "../settings";

const R = window.R;

import {isDevMode} from "../scripts/vuehelpers";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import CartData from "./../data/cart.json"
//************** End imports *****************//

const BASE_ENTITY = 'productgroupbase'

//************** ProductGroupBase *****************//
export class ProductGroupBase extends Model {
    static entity = BASE_ENTITY

    static types() {
        return {
            GROUP: ProductInstanceGroup,
            CART: Cart
        }
    }

    static afterUpdate(model) {
        ProductGroupBase.store().dispatch('orm/logOrmEvent', ['afterUpdate', model])
    }

    static afterCreate(model) {
        ProductGroupBase.store().dispatch('orm/logOrmEvent', ['afterCreate', model, [], 'red'])
    }

    static fields() {
        return {
            id: this.uid(() => getRandomNumber(ID_LENGTH)),
            timestamp: this.number(0, value => Date.now()),
            type: this.attr('GROUP'),

            token: this.string(null),
            item_count: this.number(0),
            note: this.string(null).nullable(), ///CART
            attributes: this.attr(null),

            /* pricing stuff */
            items_subtotal_price: this.number(null),
            original_total_price: this.number(null),
            total_price: this.number(null), //quantity * price

            total_discount: this.number(null),
            line_level_total_discount: this.number(null),
            selection_mode: this.string("normal").nullable(),

            currency: this.string("USD"),
        }
    }
}

//todo .... move
const mockaxios = function (
    req = '/cart',
    data = {},
    _restore = false,
    _timeout = false,
    _error = false) {
    const mock = new MockAdapter(axios);
    mock.onGet(req).reply(200, data);
    if (_timeout) mock.onGet(req).timeout();
    if (_error) mock.onGet(req).networkError();
    if (_restore) mock.restore();
    return mock
}

export class Cart extends ProductGroupBase {
    static entity = "cart"
    static baseEntity = BASE_ENTITY /// TODO: extend instance instead?

    static apiConfig = {
        actions: {
            updateItems(item_array, useServer = true) {
                let _items = item_array;
                if (useServer) {
                    Cart.commit((state) => {
                        state.fetching = true
                    })
                    return this.post(`/cart/add.js`,
                        {
                            save: false,
                            items: _items
                        }
                    )
                } else {
                    console.log("SERVER :: UPDATE ITEMS  ", _items)
                }
            },
            addItems(item_array, useServer = true) {

                let _items = item_array;

                if (useServer) {
                    Cart.commit((state) => {
                        state.fetching = true
                    })
                    let convertedItems = _items.map(function (_item) {
                        return _item.NewLineItem;
                    })
                    return this.post(`/cart/add.js`,
                        {
                            save: false,
                            items: convertedItems
                        }
                    )
                } else {
                    ///TODO: THIS IS KIND OF BROKEN.
                    console.log("SERVER :: ADD ITEMS  ", _items)
                    let newArr = _items.map(function (_item) {
                        let cleaned = _item.$toJson();

                        if (_item.quantity) cleaned =
                            {
                                ...cleaned, 'type': 'LINE_ITEM',
                                'quantity': _item.quantity,
                                'group_id': Cart.store().state.entities.cart.cart.id
                            }
                        return R.omit(['id', 'requested_quantity', 'properties'], cleaned)
                    })
                    console.log("THE NEW ARRAY IS ", newArr, newArr, Cart.store().state.entities.cart.cart);
                    ///todo: PUSH NEW CHILD
                    return newArr;
                    //  LineItem.create({data: newArr[0]})
                }
            },
            async fetchCart(mock = isDevMode(), useServer = true) {
                if (mock) {
                   const myaxios =  mockaxios("/cart", CartData)
                    return this.get("/cart").then(function (response) {
                        console.log("MOCK CART ", response);
                        myaxios.restore();
                    }).catch(function (error) {
                        console.error("error ob", error);
                    })
                } else {
                    return this.get(`/cart.js`, {
                        validateStatus: function (status) {
                            console.log("validating status", status)
                            return status < 500; // Resolve only if the status code is less than 500
                        }
                    })
                        .catch(function (error) {
                            console.log("error ob", error.toJSON());
                        });
                }

            },
        }
    }

    static fields() {
        return {
            ...super.fields(),
            items: this.hasMany(LineItem, "group_id"),
            total_weight: this.number(null),
            requires_shipping: this.boolean(false),
            cart_level_discount_applications: this.attr([])
        }
    }

    static GetCart() {
        return Cart.store().state.entities.cart.cart;
    }
}

export class ProductInstanceGroup extends ProductGroupBase {
    static entity = 'productgroup'
    static baseEntity = BASE_ENTITY

    static fields() { //this used ti be inherited but it was a pain in the ass
        return {
            ...super.fields(),
            //*** variant linked with instance ( ie could be not for sale variant with group etc.
            // variant_id: this.number(null),
            // Variant: this.hasOne(Variant, "id", "variant_id"),
            //*** preferences
            add_to_cart_enabled: this.boolean(false), /// this is bool to allow a add to cart button for TOTAL GROUP.

            //*********** The Child instances in group.
            items: this.hasMany(ProductInstanceSingle, "group_id"),
            max_children: this.number(1), //the max instanxes per group
        }
    }

    //REMOVE???? //GILLIAN??
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

    //REMOVE???? //GILLIAN??
    get IsAvailable() {
        return this.ProductInstances.reduce(function (item, bool) {
            if (!item.IsAvailable) return false;
            return bool;
        }, true);
        //if one is unavailable the rest are false.
    }
}

export default ProductInstanceGroup
