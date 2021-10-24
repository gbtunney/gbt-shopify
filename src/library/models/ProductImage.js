/* eslint-disable */
import {Model} from '@vuex-orm/core'
import {Product, Variant} from './..'
import {ShopifyMediaURL} from "./../scripts/shopify";
import {getRandomNumber} from "../scripts/generic";
import {ID_LENGTH} from "../settings";

export default class ProductImage extends Model {
    static entity = 'productimages'

    static fields() {
        return {
            id: this.uid(() => getRandomNumber(ID_LENGTH)),
            position: this.number(null),
            alt: this.string(null),
            width: this.number(500),
            height: this.number(500),
            src: this.string(null),
            product_id: this.number(null),
            variant_ids: this.attr(null), //array of numbers

            ///*******CALCULATED FIELDS
            Product: this.belongsTo(Product, 'product_id'),
            Variants: this.hasManyBy(Variant, 'variant_ids')
        }
    }

    get aspect_ratio() {
        return parseInt(this.width) / parseInt(this.height);
    }

    get srcset() {
        return {
            "desktop": {
                "url": this.getSrc(600, 1200)
            },
            "mobile": {
                "url": this.getSrc(200, 200)
            },
            "zoom": {
                "url": this.getSrc(2000, 2000)
            },
            "alt": this.alt
        }
    }

    /** Static  Methods  */
    getSrc (_width = false, _height = false) {
        return ShopifyMediaURL(this.src, _width, _height);
    }
}
/* SRC SET!!!!!!!!!
    [
      {
            "desktop": {
                "url": "assets/storybook/SfGallery/productB.jpg"
            },
            "mobile": {
                "url": "assets/storybook/SfGallery/productB.jpg"
            },
            "zoom": {
                "url": "assets/storybook/SfGallery/productB.jpg"
            },
            "alt": "Product B"
        }
    ]*/
