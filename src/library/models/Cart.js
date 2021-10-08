import { Model } from '@vuex-orm/core'
import {SHOPIFY_BASE_URL} from "@/settings";
import { Variant} from './..'
export const testdata =
    {
        "token": "38bef5ca80e2663b6f5a1301cea97087",
        "note": "",
        "attributes": {},
        "original_total_price": 263250,
        "total_price": 131625,
        "total_discount": 131625,
        "total_weight": 16510.7623,
        "item_count": 130,
        "items":[],
        "line_level_total_discount": 101250
        "requires_shipping": true,
        "currency": "USD",
        "items_subtotal_price": 131625,
        "cart_level_discount_applications": []
    }


 export class Cart extends Model {
    static entity ="cart"

     static apiConfig = {
        actions: {
            addItems(item_array) {
                let _items = item_array;
                return this.post(`/cart/add.js`,
                    {
                        save: false,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*',
                        },
                        items: _items,
                        baseURL: SHOPIFY_BASE_URL,
                    }
                )
            },
            fetchCart() {
                return this.get(`/cart.js`,
                    {
                        baseURL: SHOPIFY_BASE_URL,
                    }
                )
            },
        }
    }

     static fields() {
         return {
             id: this.uid(),
             token: this.string(null),
             note: this.string(null),
             attributes: this.attr(null),
             original_total_price: this.number(null),
             total_price: this.number(null),
             total_discount: this.number(null),
             item_count: this.number(0),
             items: this.hasMany(LineItem, "cart_id")
         }
     }
}

export class LineItem extends Model {
    static entity = 'lineitem'
   // static baseEntity = 'variants'  TODO: extend instance instead?

    static fields() {
        return {
            /*...super.fields(),*/
            //*********** The Child value instances
            variant_id: this.number(null),
            cart_id: this.attr(null),
            Cart: this.belongsTo(Cart, "cart_id"),
            key: this.string(null)
        }
    }
}
export default Cart
/*
            {"id": 22589283041398,
            "properties": {},
            "quantity": 100,
            "variant_id": 22589283041398,
            "key": "22589283041398:caf6a8e681b33b85ea2f0005964eee12",
            "title": "Local (worsted) - Red Squirrel \/ Skein",
            "price": 2025,
            "original_price": 2025,
            "discounted_price": 1013,
            "line_price": 101250,
            "original_line_price": 202500,
            "total_discount": 101250,
            "discounts": [{"amount": 101250, "title": "Test Discount"}],
            "sku": "Local:LRedSquirrel",
            "grams": 127,
            "vendor": "O-Wool",
            "taxable": true,
            "product_id": 2651981938806,
            "product_has_only_default_variant": false,
            "gift_card": false,
            "final_price": 1013,
            "final_line_price": 101250,
            "url": "\/products\/local?variant=22589283041398",
            "featured_image": {
                "aspect_ratio": 0.667,
                "alt": "Red Squirrel",
                "height": 2048,
                "url": "https:\/\/cdn.shopify.com\/s\/files\/1\/0084\/4044\/7094\/products\/LRedSquirrel_9bf93c6f-91f6-4618-ba14-e10a09a936ae.jpg?v=1570355350",
                "width": 1366
            },
            "image": "https:\/\/cdn.shopify.com\/s\/files\/1\/0084\/4044\/7094\/products\/LRedSquirrel_9bf93c6f-91f6-4618-ba14-e10a09a936ae.jpg?v=1570355350",
            "handle": "local",
            "requires_shipping": true,
            "product_type": "Yarns",
            "product_title": "Local (worsted)",
            "product_description": "Worsted WeightFiber Content:50% alpaca from local farms in NJ \u0026 PA50% certified organic merinoPut-up: 3.5 oz \/ 100gYardage: 240 yds \/ 219mGauge: 18 - 20 sts = 4\u201d \/ 10cm Needle: 7 - 9 US \/ 4.5 - 5.5mm\u00a0How about Local dyed with Natural Dyes!?\nClick here for patterns in Local\nWant to see all of the colors in person before ordering? Order a Shade Card.\n\nWant your yarn wound into balls?\u00a0Look here.\nAfter one adventurous drive in a minivan brimming with alpaca fiber, O-Wool Local was born. Since then, I've visited farms all around the Philadelphia area collecting fiber. Local is processed in the Northeastern USA. It is squishy and soft, and still has that alpaca smell and some lanolin left in the fiber. It is a truly rustic, minimally processed yarn - if that's your thing, you're going to love this yarn.\nHand wash in cold water with gentle detergent. Lay flat to dry.\n\u00a0",
            "variant_title": "Red Squirrel \/ Skein",
            "variant_options": ["Red Squirrel", "Skein"],
            "options_with_values": [{"name": "Color", "value": "Red Squirrel"}, {"name": "Size", "value": "Skein"}],
            "line_level_discount_allocations": [{
                "amount": 101250,
                "discount_application": {
                    "type": "automatic",
                    "key": "294b84ae-3829-477d-a869-0bc207f33a8f",
                    "title": "Test Discount",
                    "description": "",
                    "value": "50.0",
                    "created_at": "2021-10-03T21:29:55.907Z",
                    "value_type": "percentage",
                    "allocation_method": "across",
                    "target_selection": "entitled",
                    "target_type": "line_item",
                    "total_allocated_amount": 131625
           }*/
