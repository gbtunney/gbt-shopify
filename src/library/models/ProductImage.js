/* eslint-disable */
import {Model} from '@vuex-orm/core'
import {Product, Variant} from './../database'
import {ShopifyMediaURL} from "./../scripts/shopify";

export default class ProductImage extends Model {
    static entity = 'productimages'

    static fields() {
        return {
            id: this.number(null),//TODO: keeping this as a STRING (bc generic doesnt work wtf) type BC possibble string/int clash with shopify
            position: this.number(null),
            alt: this.string(null),
            width: this.number(500),
            height: this.number(500),
            src: this.string(null),
            product_id: this.number(null),
            variant_ids: this.attr(null),

            ///*******CALCULATED FIELDS
            Product: this.belongsTo(Product, 'product_id'),
            Variants: this.hasManyBy(Variant, 'variant_ids')
        }
    }

    get aspect_ratio() {
        return parseInt(this.width) / parseInt(this.height);
    }
}
//note: must be called with ()
ProductImage.prototype.getSrc = function (_width = false, _height = false) {
    return ShopifyMediaURL(this.src, _width, _height);
}
