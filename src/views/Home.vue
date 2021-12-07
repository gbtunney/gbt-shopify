<template>
  <div class="home">
    <button v-tooltip="'You hav new messages.'">GILLIAN HOME</button>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import vSelect from 'vue-select'
import ProductImageGrid from '@/library/components/images/ProductImageGrid.vue';
import ProductInstanceGroup from '@/library/components/product/ProductInstanceGroup.vue'; // @ is an alias to /src
import { SfProductOption ,SfQuantitySelector,SfProperty,SfButton,SfIcon,SfGallery,SfImage} from "@storefront-ui/vue";

export default Vue.extend({
  name: 'Home',
  components: {
    HelloWorld,vSelect,
    ProductInstanceGroup,
    ProductImageGrid,
    SfProductOption,SfQuantitySelector,SfProperty,SfButton,SfIcon,SfGallery,SfImage
  }, data() {
    return {
      image_index: 1
    }
  },
  methods:{
    getSrcSet(_images = []){
      if ( !_images ) return
     return _images.map(function(image){
       return image.srcset;
     })
    },
    imageChanged(imageObj, slide_func, update_option_func) {
      const {image, linked_option} = imageObj;
      if (!image) return
      console.log("--------------------image changed", image, linked_option);
      if (update_option_func && linked_option) update_option_func(linked_option);
      if (slide_func) slide_func(image.position - 1)
    },
  },
  async mounted(){

    let cartData = {
      "token": "12238f29fb642b6a6ee973f8ea863d19",
      "note": null,
      "attributes": {},
      "original_total_price": 1800,
      "total_price": 1800,
      "total_discount": 0,
      "total_weight": 254.0117,
      "item_count": 2,
      "items": [
        {
          "id": 22620513435766,
          "properties": {
            "message": "gillian t"
          },
          "quantity": 2,
          "variant_id": 22620513435766,
          "key": "22620513435766:59cc103293b0d3f4d691db990a4a8ff8",
          "title": "Local (worsted) - Alumroot / Mini-skein",
          "price": 900,
          "original_price": 900,
          "discounted_price": 900,
          "line_price": 1800,
          "original_line_price": 1800,
          "total_discount": 0,
          "discounts": [],
          "sku": "Local:LAlumroot",
          "grams": 127,
          "vendor": "O-Wool",
          "taxable": true,
          "product_id": 2651981938806,
          "product_has_only_default_variant": false,
          "gift_card": false,
          "final_price": 900,
          "final_line_price": 1800,
          "url": "/products/local?variant=22620513435766",
          "featured_image": {
            "aspect_ratio": 0.667,
            "alt": "Alumroot",
            "height": 2048,
            "url": "https://cdn.shopify.com/s/files/1/0084/4044/7094/products/LAlumroot2.jpg?v=1570355350",
            "width": 1366
          },
          "image": "https://cdn.shopify.com/s/files/1/0084/4044/7094/products/LAlumroot2.jpg?v=1570355350",
          "handle": "local",
          "requires_shipping": true,
          "product_type": "Yarns",
          "product_title": "Local (worsted)",
          "product_description": "Worsted WeightFiber Content:50% alpaca from local farms in NJ & PA50% certified organic merinoPut-up: 3.5 oz / 100gYardage: 240 yds / 219mGauge: 18 - 20 sts = 4” / 10cm Needle: 7 - 9 US / 4.5 - 5.5mm How about Local dyed with Natural Dyes!?\nClick here for patterns in Local\nWant to see all of the colors in person before ordering? Order a Shade Card.\n\nWant your yarn wound into balls? Look here.\nAfter one adventurous drive in a minivan brimming with alpaca fiber, O-Wool Local was born. Since then, I've visited farms all around the Philadelphia area collecting fiber. Local is processed in the Northeastern USA. It is squishy and soft, and still has that alpaca smell and some lanolin left in the fiber. It is a truly rustic, minimally processed yarn - if that's your thing, you're going to love this yarn.\nHand wash in cold water with gentle detergent. Lay flat to dry.\n ",
          "variant_title": "Alumroot / Mini-skein",
          "variant_options": [
            "Alumroot",
            "Mini-skein"
          ],
          "options_with_values": [
            {
              "name": "Color",
              "value": "Alumroot"
            },
            {
              "name": "Size",
              "value": "Mini-skein"
            }
          ],
          "line_level_discount_allocations": [],
          "line_level_total_discount": 0
        }
      ],
      "requires_shipping": true,
      "currency": "USD",
      "items_subtotal_price": 1800,
      "cart_level_discount_applications": []
    }

    //var responsecart = await Cart.api().fetchCart(cartData)
  //  console.log("tryng to make am cart.",responsecart)


    let formData = {

      'items': [{

        'id': 36110175633573,

        'quantity': 2

      }]
    };
  }
});
</script>
<style   type="text/css" lang="scss" src="@storefront-ui/vue/styles.scss"></style>


