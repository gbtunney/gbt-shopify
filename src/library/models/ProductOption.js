import {Model} from '@vuex-orm/core'
import {slugify} from "./../scripts/generic";
import {Product, Variant, ProductImage} from "./..";

// Base entity.
export class ProductOptionBase extends Model {
    static entity = 'productoptionbase'

    static types() {
        return {
            DEFAULT: ProductOption,
            VALUE: ProductOptionValue,
            OPTION: ProductOption
        }
    }

    static fields() {
        return {
            id: this.uid(),
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
    static baseEntity = 'productoptionbase'
    static primaryKey = ['product_id', 'handle']

    static beforeCreate(model) {
    }

    static fields() {
        return {
            ...super.fields(),
            alt: this.string(),
            option_id: this.attr(null),//the parent option,
            thumbnail_id: this.attr(null),
            option: this.belongsTo(ProductOption, "option_id"),
            Variants: this.belongsToMany(Variant, VariantOption, "option_value_id", "variant_id"),
            Images: this.belongsToMany(ProductImage, VariantOption, "option_value_id", "thumbnail_id"),
            //todo: idk these pivots need help
        }
    }

    //todo: idk these pivots need help - this does not work... !!
    get Thumbnail() {
        if (this.thumbnail_id) return ProductImage.query().whereId(this.thumbnail_id).withAll().first();
        if (this.Images && this.Images.length > 0) return this.Images[0];
        return false;
    }

    get Option() { //this is incase its undefined
        if (this.option) return this.option
        if (this.option_id && !this.option) return ProductOption.query().whereId(this.option_id).first();
    }
}


export class ProductOption extends ProductOptionBase {

    static entity = 'productoptions'
    static baseEntity = 'productoptionbase'

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
            variant_id: this.attr(null),
            option_value_id: this.attr(null),
            thumbnail_id: this.attr(null)
        }
    }
}

export default ProductOption
