<template>
  <div class="App">
    <div id="baseexample">
      <div class="flex">
      <product-child handle="local" :variant_id="8" class="border border-primary w-1/2" :load_handle="true">
        <div slot-scope="{Ready, loadTest,Product,Variants,SelectedVariant,UpdateOption,Options,OptionValueList,SelectedOptionValue,UpdateInstance,Images,Instance,UpdateVariant}">
          <div v-if="Product">{{ Product.title }}</div>
          <hr>
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
                <div
                    :class="isSelected ? 'bg-primary-lt' : '' "
                    class="flex font-secondary uppercase items-center text-lg flex-row h-full w-full p-2.5">
                  <span v-if="title" v-bind:style="{ background:hex_color }"  style="height: 1.5em; width:auto;aspect-ratio: 1; " :class="(parent_handle != 'color')?'hidden':''" class=" border border-primary-dk  mr-8 ">
                            <img v-if='thumbnail' :src="thumbnail.getSrc(150)" />
                          </span>
                  <span  v-if="title" :class="isSelected? 'font-bold text-white' : '' ">{{!$isDisabled}}{{ title }}</span>
                </div>
              </template>
              <template #selected-option-container="{option, deselect, multiple, disabled }">
                <SfProperty :name="productOption.title" :value="option.title"/>
              </template>
<!--            <template #option="props ,{ title , isSelected,$isDisabled ,Thumbnail,parent_handle, hex_color }">


                </div>
              </template>-->
<!--                  <template #selected-option-container="props">
                    <div v-if="props" ></div>
                <SfProperty :name="productOption.title" :value="productOption.title"/>
              </template>-->
<!--              <template #selected-option-container="{ option, deselect, multiple, disabled }">
                <SfProperty :name="productOption.title" :value="option.title"/>
              </template>-->
            </v-select>
          </div>
          <ProductImageGrid
              :columnCount="8"
              optionHandle="color"
              option-handle="color"
              :image_size="400"
              :images="Images"
              >
          </ProductImageGrid>

          <hr>
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

export default {
  name: "App",
  components: {
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
  },
  data: function () {
    return {
      colorselection: false,
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
}
</script>
<style   type="text/css" lang="css" src="vue-select/dist/vue-select.css"></style>
