<template>
  <div class="home">
    <button v-tooltip="'You hav new messages.'">GILLIA  BUT%</button>

    <product-instance-group>
      <div slot-scope="{GroupInstance,Children,registerChild}">
       {{Children}}
        <div v-for="child in Children" v-bind:key="child.id">
          <product-instance-provider v-if="child.Variant && child.Variant.id" :variant="child.Variant.id" :instance="child">
            <div slot-scope="{Ready, Product,SelectedVariant,RequestedQuantity}">
              <div v-if="Product">
                Child::{{ Product.title }} -{{ SelectedVariant.title }}
              </div>
            </div>
          </product-instance-provider>
        </div>
      </div>
    </product-instance-group>

    <product-instance-provider :options_editable="true" handle="local" :variant="22589282975862">
      <!--ff
//{ Loading,Variants,Images,Options,OptionValueList,
// Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
// RequestedQuantity , UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart}
-->

      <div slot-scope="{Loading,Variants,Images,Options,OptionValueList,
      Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
      RequestedQuantity ,Instance, UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart
       }"
          id="shopify-section-product-template" class="shopify-section"><!-- /templates/product.liquid -->
        <div v-if="Product">

          <SfGallery
              v-if="Images"
              :current="$data.image_index"
              :enable-zoom="true"
              :images='getSrcSet(Images)'
          :slider-options='{ "type": "slider",
          "autoplay": false, "rewind": false,
          "gap": 0   }' >
            <template #thumbs="{ active: activeIndex, go }">
              <ProductImageGrid
                  @changed="imageChanged($event, go , UpdateOption) "
                  option-handle="color"

                  :images="Images">
              </ProductImageGrid>
            </template>

          </SfGallery>




          <hr>
          Variant
          <hr>
          grid

<hr>

          <div v-if="SelectedVariant" class="quantity-wrapper">
            requested quantity : {{ RequestedQuantity }}
            quantity {{ SelectedVariant.inventory_quantity }}

                <SfQuantitySelector :qty="RequestedQuantity"  :min="0"
                    :max="SelectedVariant.inventory_quantity"   @input="UpdateInstance({ requested_quantity: $event},Instance)" />

            <h5 v-if="SelectedVariant">available units: {{ SelectedVariant.inventory_quantity }}</h5>
            <gQuantityPicker
                @change="UpdateInstance({ requested_quantity: $event},Instance)"
                :value="RequestedQuantity"
                :min="0"
                :max="SelectedVariant.inventory_quantity">
            </gQuantityPicker>
            <SfButton
class="color-primary"
                @click="addToCart"
                   >Add to Cart | {{ Instance.TotalPrice | toCurrency }}
               </SfButton>
            <SfIcon
              icon="add_to_cart"
                 size="lg"
              color="#FF0000"
              >
                </SfIcon>
            <!--
                       <button class="bg-primary text-light border" @click="UpdateItem(item)">{{ item.Variant.Price }} @ {{ item.requested_quantity }} -&#45;&#45;&#45;&#45;Add to cart :: {{ item.TotalPrice }}</button>
            -->
            <button @click="registerChild(Instance)">REGISTER TO GROUPPPPPP</button>
            <button @click="addToCart"> ADD TO CART {{ SelectedVariant.Price | toCurrency }} @ {{ RequestedQuantity }}</button>
            <span> Total: {{ Instance.TotalPrice | toCurrency }}</span>
          </div>

<h1>grid</h1>


          <!--<span>TOTAL :{{Instance.TotalPrice}} </span>-->
          <v-select autocomplete="on"
              v-if="Variants"
              :value="SelectedVariant"
              @option:selecting="UpdateVariant"
              :options="Variants"
              label="title"
              :clearable=false
          >
            <template #option="{ isSelected,title,$isDisabled ,image }">

              <div
                  :class="isSelected? 'bg-primary-lt' : '' "
                  class="flex font-secondary uppercase items-center text-lg flex-row h-full w-full p-2.5">
                <SfProductOption color="#ff0000" :label="title">
                  <template #color="" >
                    <div v-if="image"
                        class="sf-product-option__color">
                      <img v-if='image' :src="image.src" class="object-cover"/>
                    </div>

                  </template>
                </SfProductOption>

<!--                <span :class="isSelected? 'font-bold' : '' ">{{ title }} </span>-->
              </div>
            </template>
            <template #selected-option-container="{ option, deselect, multiple, disabled }">
              <div class="vs__selected">
                <span v-if="option.Product">{{ option.Product.title }} / </span>
                <span>{{ option.title }}</span>
              </div>
            </template>
          </v-select>


          <div
              v-for="productOption in Options" v-bind:key="productOption.id"
              class="product-option-wrapper m-8">
            <v-select autocomplete="on"
                v-if="OptionValueList(productOption)"
                @option:selecting="UpdateOption"
                :value="SelectedOption(productOption)"
                :options="OptionValueList(productOption)"
                 label="title"
                :autoscroll=true
                :clearable=false>
              <template #option="{ title , isSelected,$isDisabled ,Thumbnail }">
                <div
                    :class="isSelected ? 'bg-primary-lt' : '' "
                    class="flex font-secondary uppercase items-center text-lg flex-row h-full w-full p-2.5">

                  &lt;!&ndash;
                  <span :style="Thumbnail? '' : 'hidden' " style="height: 1.5em; width:auto;aspect-ratio: 1; " class=" border border-primary-dk  mr-8 ">
                            <img v-if='Thumbnail' :src="Thumbnail.getSrc(150)" class="object-cover"/>
                          </span>
                  &ndash;&gt;

                  <span :class="isSelected? 'font-bold' : '' ">{{ $isDisabled }}-{{ title }}</span>

                </div>
              </template>
              <template #selected-option-container="{ option, deselect, multiple, disabled }">
                <SfProperty :name="productOption.title" :value="option.title" />
              </template>
            </v-select>
          </div>
        </div>
      </div>


    </product-instance-provider>
    <product-instance-provider :options_editable="true" handle="balance" :variant="7">
      <!--ff
//{ Loading,Variants,Images,Options,OptionValueList,
// Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
// RequestedQuantity , UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart}
-->

      <div slot-scope="{Loading,Variants,Images,Options,OptionValueList,
      Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
      RequestedQuantity ,Instance, UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart
       }"
          id="shopify-section-product-template" class="shopify-section"><!-- /templates/product.liquid -->
        <div v-if="Product">

          <hr>
          Variant
          <hr>

          <div v-if="SelectedVariant" class="quantity-wrapper">
            requested quantity : {{ RequestedQuantity }}
            quantity {{ SelectedVariant.inventory_quantity }}
            <h5 v-if="SelectedVariant">available units: {{ SelectedVariant.inventory_quantity }}</h5>
            <gQuantityPicker
                @change="UpdateInstance({ requested_quantity: $event},Instance)"
                :value="RequestedQuantity"
                :min="0"
                :max="SelectedVariant.inventory_quantity">
            </gQuantityPicker>
            <!--
                       <button class="bg-primary text-light border" @click="UpdateItem(item)">{{ item.Variant.Price }} @ {{ item.requested_quantity }} -&#45;&#45;&#45;&#45;Add to cart :: {{ item.TotalPrice }}</
                       on>
            -->
            <button @click="registerChild(Instance)">REGISTER TO GROUPPPPPP</button>
            <button @click="addToCart"> ADD TO CART {{ SelectedVariant.Price }} @ {{ RequestedQuantity }}</button>
            <span> Total: {{ Instance.TotalPrice }}</span>
          </div>


          <!--<span>TOTAL :{{Instance.TotalPrice}} </span>-->
          <v-select autocomplete="on"
              v-if="Variants"
              :value="SelectedVariant"
              @option:selecting="UpdateVariant"
              :options="Variants"
              label="title"
              :clearable=false
          >
            <template #option="{ isSelected,title,$isDisabled ,image }">
              <div
                  :class="isSelected? 'bg-primary-lt' : '' "
                   class="flex font-secondary uppercase items-center text-lg flex-row h-full w-full p-2.5">
                &lt;!&ndash;
                <span :style="image? '' : 'hidden' " style="height: 1.5em; width:auto;aspect-ratio: 1; " class=" border border-primary-dk  mr-8 ">
                  <img v-if='image' :src="image.src" class="object-cover"/>
                </span>&ndash;&gt;
                <span :class="isSelected? 'font-bold' : '' ">{{ title }} </span>
              </div>
            </template>
            <template #selected-option-container="{ option, deselect, multiple, disabled }">
              <div class="vs__selected">
                <span v-if="option.Product">{{ option.Product.title }} / </span>
                <span>{{ option.title }}</span>
              </div>
            </template>
          </v-select>


          <div
              v-for="productOption in Options" v-bind:key="productOption.id"
              class="product-option-wrapper m-8">
            <v-select autocomplete="on"
                v-if="OptionValueList(productOption)"
                @option:selecting="UpdateOption"
                :value="SelectedOption(productOption)"
                :options="OptionValueList(productOption)"
                :selectable="option => !option['$isDisabled']"
                label="title"
                :autoscroll=true
                :clearable=false>
              <template #option="{ title , isSelected,$isDisabled ,Thumbnail }">
                <div
                    :class="isSelected ? 'bg-primary-lt' : '' "
                    class="flex font-secondary uppercase items-center text-lg flex-row h-full w-full p-2.5">

                  &lt;!&ndash;
                  <span :style="Thumbnail? '' : 'hidden' " style="height: 1.5em; width:auto;aspect-ratio: 1; " class=" border border-primary-dk  mr-8 ">
                            <img v-if='Thumbnail' :src="Thumbnail.getSrc(150)" class="object-cover"/>
                          </span>
                  &ndash;&gt;

                  <span :class="isSelected? 'font-bold' : '' ">{{ $isDisabled }}-{{ title }}</span>

                </div>
              </template>
              <template #selected-option-container="{ option, deselect, multiple, disabled }">
                <div class="vs__selected">
                  <span class="font-bold">{{ productOption.title }}:</span>
                  <span>{{ option.title }}</span>
                </div>
              </template>
            </v-select>
          </div>
        </div>
      </div>

    </product-instance-provider>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import vSelect from 'vue-select'
import ProductInstanceProvider from '@/library/components/product/ProductInstanceProvider.vue'; // @ is an alias to /src
import gQuantityPicker from '@/library/components/ui/gQuantityPicker.vue';
import ProductImageGrid from '@/library/components/images/ProductImageGrid.vue';
import ProductInstanceGroup from '@/library/components/product/ProductInstanceGroup.vue'; // @ is an alias to /src
import { SfProductOption ,SfQuantitySelector,SfProperty,SfButton,SfIcon,SfGallery,SfImage} from "@storefront-ui/vue";

export default Vue.extend({
  name: 'Home',
  components: {
    HelloWorld,ProductInstanceProvider,vSelect,
    ProductInstanceGroup,
    gQuantityPicker,
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


