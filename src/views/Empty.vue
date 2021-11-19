<template>
  <div class="App">
    <div id="baseexample">
      <div class="flex">
        <product-child @changed="variantChanged" handle="local" :variant_id="8" :load_handle="true">
          <div id="shopify-section-product-template" class="flex container w-full shopify-section"
              slot-scope="{Ready,Quantity , addToCart, QuantityAvailable,loadTest,Product,Variants,SelectedVariant,UpdateOption,Options,OptionValueList,SelectedOptionValue,UpdateInstance,Images,Instance,UpdateVariant}">
            <div class="column1 w-1/2">
              <!-- COLUMN 1 -->
              <SfGallery
                  v-if="Images"
                  :current="$data.image_index"
                  :enable-zoom="true"
                  :images='getSrcSet(Images)'
                  :slider-options='{ "type": "slider",
          "autoplay": false, "rewind": false,
          "gap": 0   }'>
                <template #thumbs="{ active: activeIndex, go }">
                  <ProductImageGrid @mounted="setCallback(go)"
                      @changed="imageChanged($event, go , UpdateOption) "
                      option-handle="color"
                      :images="Images">
                  </ProductImageGrid>
                </template>
              </SfGallery>
            </div>
            <div class="w-1/2">
              <!-- COLUMN 2 -->
              <div v-if="Product">{{ Product.title }}</div>
         <div class="gill-svg  g-svg" :style="svg_css('#FF0000')">
           <inline-svg  src="/svg/leaves-a.svg" fill="red"></inline-svg>
         </div>

              <div
                  v-for="productOption,index in Options" v-bind:key="index"
                  class="product-option-wrapper m-8">
                <v-select autocomplete="on"
                    v-if="OptionValueList(productOption)"
                    @option:selecting="UpdateOption"
                    :value="SelectedOptionValue(productOption)"
                    :options="OptionValueList(productOption)"
                    label="title"
                    :autoscroll=true
                    :clearable=false>
                  <template #option="{title,thumbnail,isSelected,image,$isDisabled,hex_color,parent_handle} ">
                    <!-- class="flex font-secondary uppercase items-center text-lg flex-row h-full w-full p-2.5"-->
                    <div :class="[{ 'bg-primary-lt': isSelected }, {'cursor-default opacity-40': $isDisabled}]">
                  <span v-if="title" v-bind:style="{ background:hex_color }" style="height: 1.5em; width:auto;aspect-ratio: 1; " :class="(parent_handle != 'color')?'hidden':''" class=" border border-primary-dk  mr-8 ">
                            <img v-if='false' :src="thumbnail.getSrc(150)"/>
                          </span>

                      <span v-if="title" style="height: 2.5em; "
                          :class="(parent_handle != 'color')?'hidden':''"
                          :style="svg_css(hex_color)"
                          class="g-svg mr-8 ">
                               <inline-svg src="/svg/leaves-a.svg" />
                      </span>

                      <span v-if="title" :class="isSelected? 'font-bold text-white' : '' ">{{ title }}</span>
                    </div>
                  </template>
                  <template #selected-option-container="{option, deselect, multiple, disabled }">
                    <SfProperty :name="productOption.title" :value="option.title"/>
                  </template>
                </v-select>
                <hr>

              </div>
              <hr>


              <div v-if="SelectedVariant">
                <v-select autocomplete="on"
                    v-if="Variants"
                    :value="SelectedVariant"
                    @option:selecting="UpdateVariant"
                    :options="Variants"
                    label="title"
                    :clearable=false
                >
                  <template #option="{ isSelected,title,$isDisabled ,image }">

                    <div :class="isSelected? 'bg-primary-lt' : '' "
                        class="flex font-secondary uppercase items-center text-lg flex-row h-full w-full p-2.5">
                      <SfProductOption color="#ff0000" :label="title">
                        <template #color="">
                          <div v-if="image"
                              class="sf-product-option__color">
                            <img v-if='image' :src="image.src" class="object-cover"/>
                          </div>

                        </template>
                      </SfProductOption>
                      <span :class="isSelected? 'font-bold' : '' ">{{ title }} </span>
                    </div>
                  </template>
                  <template #selected-option-container="{ option, deselect, multiple, disabled }">
                    <div class="vs__selected">
                      <span v-if="option.Product">{{ option }} / </span>
                      <span>{{ option.title }}</span>
                    </div>
                  </template>
                </v-select>

                <SfQuantitySelector :qty="Quantity" :min="0"
                    :max="SelectedVariant.inventory_quantity"
                    @input="UpdateInstance({ quantity: $event},Instance)"/>
                <h5 v-if="SelectedVariant">available units: {{ QuantityAvailable }}</h5>
                <h6 class="text-red" v-if="QuantityAvailable <= 5">less than 5 available units: {{ QuantityAvailable }}</h6>

                <SfButton
                    class="color-primary"
                    @click="addToCart"
                >Add to Cart | {{ Instance.TotalPrice | toCurrency }}
                </SfButton>
              </div>

            </div>
          </div>
        </product-child>
      </div>
    </div>
  </div>
</template>
<script>
import {Product} from "../library/models";
import ProductChild from '../library/components/product/ProductChild'
import GroupInstance from '../library/components/product/GroupInstance'
import TestingComponent from "./TestingComponent";
import gUIColorFrame from '../library/components/ui/gUIColorFrame.vue'
import {
  SfProductOption,
  SfQuantitySelector,
  SfProperty,
  SfButton,
  SfIcon,
  SfGallery,
  SfImage,
  SfColorPicker
} from "@storefront-ui/vue";

import vSelect from 'vue-select'
import ProductImageGrid from '@/library/components/images/ProductImageGrid.vue';
import ProductImagePalattePicker from '@/library/components/images/ProductImagePalattePicker.vue';
import InlineSvg from 'vue-inline-svg';

export default {
  name: "App",
  components: {
    InlineSvg,
    gUIColorFrame,
    TestingComponent,
    GroupInstance,
    SfQuantitySelector,
    SfProductOption,
    ProductChild,
    vSelect,
    SfProperty,
    ProductImagePalattePicker,
    ProductImageGrid,
    SfGallery,
    SfButton
  },
  data: function () {
    return {
      colorselection: false,
      image_index: 1,
      glide: false
    }
  },
  props: {},
  computed: {
    getdata() {
      return {...this.$data.group}
    }
  },
  async created() {
    console.log("-------product", Product.all())
    this.$store.commit('productloader/clear_loader')
    // this.$store.dispatch('entities/deleteAll')
    console.log("--------------------product", Product.all())
  },
  methods: {
    svg_css(_hex_color = '#FFFF00') {
      return {
        '--fill-color': _hex_color,
        '--height': this.height + 'px'
      }
    },
    getSrcSet(_images = []) {
      if (!_images) return
      return _images.map(function (image) {
        return image.srcset;
      })
    },
    imageChanged(imageObj, slide_func, update_option_func) {
      const {image, linked_option} = imageObj;
      if (!image) return
      console.log("--------------------image changed", this);
      if (update_option_func && linked_option) update_option_func(linked_option);
      if (slide_func) slide_func(image.position - 1)
    },
    setCallback(_func) {
      ///THIS IS A HACK
      console.log("--------------------func changed", _func);
      this.$data.glide = _func
    },
    variantChanged(_variant) {
      console.log("--------------------variant changed", _variant);
      if (_variant && _variant.image_id) {
        if (this.$data.glide) this.$data.glide(_variant.Image.position - 1)
      }
    }
  }
}
</script>
<style type="text/css" lang="css" src="vue-select/dist/vue-select.css"></style>
<style lang="postcss" type="text/css" scoped>
.g-svg >>> path, .g-svg >>> rect, .g-svg >>> g, .g-svg >>> circle {
  fill: var(--fill-color);
}
</style>

<style lang="scss" type="text/scss">

.sf-gallery {
  --gallery-flex-direction: column;
  flex-direction: column-reverse;

}

</style>
