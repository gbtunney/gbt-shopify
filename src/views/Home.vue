<template>
  <div class="home">
    <button v-tooltip="'You hav new messages.'">GILLIA  BUT%</button>
    <product-instance-group>
      <div slot-scope="{GroupInstance,Children,registerChild}">
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


