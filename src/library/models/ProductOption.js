/* * ProductOptionBase *
* @model {class} - ProductOptionBase
* @entity  - productoptionbase */

/* * ProductOptionValue *
* @model {class}- ProductOptionValue
* @extends - ProductOptionBase
* @entity {string}-productoptionvalue
* @baseentity {string}- productoptionbase */

/* * ProductOption *
* @model {class}- ProductOption
* @extends {boolean}- ProductOptionBase
* @entity {string}- productoptionvalue
* @baseentity {string}- productoptionbase  */

/* * VariantOption [PIVOT] *
* @model {class}- VariantOption
* @key -['variant_id', 'option_value_id']
* @entity {string}- variantOption
* */

//todo: import {ID_LENGTH} from "../settings";
import {Model} from '@vuex-orm/core'
import {Product, ProductImage} from "./";
import Variant from './Variant'
import {getRandomNumber, slugify} from "./../scripts/generic";
import {ID_LENGTH} from "../settings";
import chroma from "chroma-js";

//************** End Imports *****************//

const BASE_ENTITY = 'productoptionbase'

export class ProductOptionBase extends Model {
    static entity = BASE_ENTITY

    static types() {
        return {
            DEFAULT: ProductOption,
            VALUE: ProductOptionValue,
            OPTION: ProductOption
        }
    }

    static fields() {
        return {
            id: this.uid(() => getRandomNumber(ID_LENGTH)),
            type: this.attr('VALUE'), // Exposing the discriminator field.
            handle: this.string(null, value => slugify(value)),
            sid: this.number(null),  ////thhihs is the origonal ID, it should have been converted to sid.
            title: this.string(null),
            position: this.number(null),

            product_id: this.number(null),
            Product: this.belongsTo(Product, "product_id")
        }
    }
}

export class ProductOptionValue extends ProductOptionBase {

    static entity = 'productoptionvalue'
    static baseEntity = BASE_ENTITY
    static primaryKey = ['product_id', 'handle']

    static fields() {
        return {
            ...super.fields(),
            alt: this.string(),
            option_id: this.number(null),//the parent option,
            parent_handle: this.string(null, value => slugify(value)),
            thumbnail_id: this.number(null),
            option: this.belongsTo(ProductOption, "option_id"),
            Variants: this.belongsToMany(Variant, VariantOption, "option_value_id", "variant_id"),
            Images: this.belongsToMany(Variant, VariantOption, "option_value_id", "thumbnail_id"),

            meta: this.attr(false),
            hex_color: this.string('#FF0000', value => (chroma.valid(value)) ? value : false).nullable() //chroma.valid('red');
            //todo: idk these pivots need help
        }
    }

    compareColor(_hex_color) {
        if (this.hex_color) {
            return {
                deltaE: chroma.deltaE(this.hex_color, _hex_color).toFixed(2),
                distance: chroma.distance(this.hex_color, _hex_color).toFixed(2),
                luminance: (chroma(this.hex_color).luminance() - chroma(_hex_color).luminance()).toFixed(2),
                temperature: (chroma(this.hex_color).temperature()),
                hue: chroma(this.hex_color).get('hsl.h').toFixed(2),
                comp: (chroma(this.hex_color).get('hsl.h').toFixed(2) - ((chroma(_hex_color).get('hsl.h') > 180) ? (chroma(_hex_color).get('hsl.h') - 180).toFixed(2) : (chroma(_hex_color).get('hsl.h') + 180).toFixed(2))),
                sat: chroma(this.hex_color).get('hsl.s').toFixed(2)
            }
            //  { deltaE:chroma.deltaE(this.hex_color, _hex_color) , distance: chroma.distance(this.hex_color, _hex_color)}
        }
    }

    //todo: idk these pivots need help - this does not work... !!
    get Thumbnail() {
        //  if (this.thumbnail_id) return ProductImage.query().whereId(this.thumbnail_id).withAll().first();
        if (this.Variants && this.Variants.length > 0) {
            const [firstvariant] = this.Variants;
            if (firstvariant.image_id) {
                return ProductImage.query().whereId(firstvariant.image_id).first()
            }
        }
        return false;
    }


    get Option() { //this is incase its undefined
        if (this.option) return this.option
        if (this.option_id && !this.option) return ProductOption.query().whereId(this.option_id).first();
        return false;
    }

}


export class ProductOption extends ProductOptionBase {

    static entity = 'productoptions'
    static baseEntity = BASE_ENTITY
    static primaryKey = ['product_id', 'handle']

    static fields() {
        return {
            ...super.fields(),
            //*********** The Child value instances
            values: this.hasMany(ProductOptionValue, "option_id")
        }
    }
}

//todo: this is a pivot table that is generated to connect option to variant.
export class VariantOption extends Model {
    static entity = 'variantOption'
    static primaryKey = ['variant_id', 'option_value_id']

    static fields() {
        return {
            variant_id: this.number(null),
            option_value_id: this.number(null),
            thumbnail_id: this.number(null).nullable()
        }
    }
}

//export {ProductOptionBase, ProductOptionValue, ProductOption, VariantOption}
export default ProductOption
