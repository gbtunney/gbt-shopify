<template>
  <div class="DefaultProductPage">

    <h1>DefaultProductPage</h1>
    <product-child @changed="variantChanged" handle="local" :variant_id="22589282746486" :load_handle="true">
      <div id="shopify-section-product-template" class="flex container w-full shopify-section"
          slot-scope="{Ready,Quantity , addToCart, QuantityAvailable,loadTest,Product,Variants,SelectedVariant,UpdateOption,Options,OptionValueList,SelectedOptionValue,UpdateInstance,Images,Instance,UpdateVariant}">

        <brooklyn-product-template>
          <template #left-column>
            <SfGallery
                v-if="Images"
                :current="$data.image_index"
                :enable-zoom="true"
                :images='getSrcSet(Images)'
                :slider-options='{ "type": "slider","autoplay": false, "rewind": false,"gap": 0   }'>
              <template #thumbs="{ active: activeIndex, go }">
                <div class="flex justify-end"><span @click="$data.col_count=8" class="border border-primary pl-2  pr-2 font-style-sm-caps mr-2">sm</span><span  @click="$data.col_count=4" class="border border-primary pl-2  pr-2 font-style-sm-caps ">lg</span></div>
                <ProductImageGrid @mounted="setCallback(go)"
                    :columnCount="$data.col_count"   @changed="imageChanged($event, go , UpdateOption) "
                    option-handle="color"
                    :images="Images">
                </ProductImageGrid>
              </template>
            </SfGallery>
          </template>
          <template #right-column>
            <h1 class="font-style-primary text-3xl" v-if="Product">{{ Product.title }}</h1>
            <g-kabob height="1em"  :css="'w-full'" :bg_color="'--transparent'" :color="'--color-primary'" path="/svg/divider.svg"/>
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
                  <div :class="[
                        { 'is_selected': isSelected },
                        {'is_disabled': $isDisabled}]"
                      class="product_option ">
                <span v-if="false" v-bind:style="{ background:hex_color }" style="height: 1.5em; width:auto;aspect-ratio: 1; " :class="(parent_handle != 'color')?'hidden':''" class=" border border-primary-dk  mr-8 ">
                            <img v-if='thumbnail' :src="thumbnail.getSrc(150)"/>
                  </span>
                    <span v-if="title"
                        :class="(parent_handle != 'color')?'hidden':''"
                        :style="svg_css(hex_color)"
                        class="g-svg h-full mr-8 ">
                               <inline-svg src="/svg/leaves-a.svg"/>
                      </span>

                    <span
                        v-if="title"
                        :class="isSelected? 'font-bold text-white' : '' "
                        class="font-style-sm-caps ">
                        {{ title }}
                      </span>
                  </div>
                </template>
                <template #selected-option="{title }">
                  <div class="selected-option font-style-sm-caps tracking-wider">
                    <span class="font-bold">{{ productOption.title }}</span> : <span>{{ title }}</span>
                  </div>
                </template>
              </v-select>
            </div>
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
              <h5  class=" font-style-primary" v-if="SelectedVariant">available units: {{ QuantityAvailable }}</h5>
              <h6 class="text-red-700 font-style-primary" v-if="QuantityAvailable <= 5">less than 5 available units: {{ QuantityAvailable }}</h6>

              <button
                 class="bg-accent-primary-dk text-light font-style-sm-caps text-2xl px-4 py-2 "
                  @click="addToCart"
              >Add to Cart &#8226; {{ Instance.TotalPrice | toCurrency }}
              </button>
            </div>
          </template>
        </brooklyn-product-template>

      </div>
    </product-child>
  </div>
</template>
<script>
import BrooklynProductTemplate from './BrooklynProductTemplate.vue';
import ProductChild from './ProductChild'
import ProductImageGrid from './../images/ProductImageGrid.vue';
import gKabob from "./../ui/gKabob.vue"
import vSelect from 'vue-select'
import InlineSvg from 'vue-inline-svg';

import {
  SfGallery,SfQuantitySelector
} from "@storefront-ui/vue";


export default {
  name: "DefaultProductPage",
  components: {
    BrooklynProductTemplate,ProductChild,
    ProductImageGrid,gKabob,
    SfGallery,SfQuantitySelector,
    vSelect,InlineSvg},
  data: function () {
    return {
      col_count:8,
      image_index: 1,
      glide: false,
    }
  },
  props: {},
  computed: {
    Variant: function () {
      return (this.$route.query && this.$route.query.variant) ? parseInt(this.$route.query.variant) : 5;
    }
  },
  methods: {
    _updated(styleArr) {
      console.log("-------updated!!!t", styleArr)
      this.$data.selectorTest = styleArr;
    },
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
<style lang="postcss" type="text/css" scoped>
@tailwind components;

@tailwind utilities;
.g-svg >>> path, .g-svg >>> rect, .g-svg >>> g, .g-svg >>> circle {
  fill: var(--fill-color);
}
</style>
<style lang="scss" type="text/css" scoped>
@tailwind components;

@tailwind utilities;
@import "./../../styles/scss/gMixins";

.is_selected {
  @include includeTailwindStyles(bg-primary-dk text-white);
}

.vs__dropdown-option--highlight .is_selected {
  @include includeTailwindStyles(opacity-80 cursor-default);
}

.is_disabled {
  @include includeTailwindStyles(bg-light-lt text-black cursor-default opacity-40);
}
</style>
<style lang="scss" type="text/scss">

@tailwind components;

@tailwind utilities;

@import "./../../styles/scss/gMixins";

.sf-gallery {
  --gallery-flex-direction: column;
  flex-direction: column-reverse;
  --gallery-thumbs-flex: 0;
}



.vs__dropdown-option {
  margin: 0;
  padding: 0;
}
.selected-option{
  $base-list: pr-5 pl-5 pt-1 pb-1  text-xl;
  @include includeTailwindStyles($base-list);
}

//outside border
.vs__dropdown-toggle {
  //border on outside of option
  $base-list: rounded-none border-primary-lt border;
  @include includeTailwindStyles($base-list);
}

.product_option {
  $base-list: pr-7 pl-7 pt-3 pb-3 h-14 text-xl;
  @include includeTailwindStyles($base-list);
  @include u-vcenter;
}

.vs__dropdown-option--highlight {
  background-color: transparent !important;

  .product_option {
    $base-list: bg-accent-primary text-light-lt;
    @include includeTailwindStyles($base-list);
  }
}

</style>
