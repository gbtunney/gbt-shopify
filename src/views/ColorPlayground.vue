<template>
  <div class="ColorPlayground">
    <h2>Color Tests!</h2>
    <product-child :handle="$data.handle" :variant_id="8" :load_handle="true">
      <div slot-scope="{Ready,Images, loadTest,Product,Variants,SelectedVariant,UpdateOption,Options,OptionValueList,SelectedOptionValue,UpdateInstance,Instance,UpdateVariant}">
        <div v-if="Product && SelectedVariant">{{ Product.title }}</div>
        <div>{{ SelectedVariant.title }}</div>
        <ProductImagePalattePicker
            :product="Product"
            :merge_values="$data.merge"
            :columnCount="6"
            optionHandle="color"
            option-handle="color"
            :image_size="400"
            :images="Images"
        >
        </ProductImagePalattePicker>
      </div>
    </product-child>
  </div>
</template>
<script>
//yarn  add fast-average-color -D
//node-vibrant
//chroma-js
import gVibrantJS from '../library/components/experiment/gVibrantJS'
import ProductChild from '../library/components/product/ProductChild'
import ProductImagePalattePicker from '../library/components/images/ProductImagePalattePicker'
import handleoptiontest from '@/assets/handleoptiontest.json'
///import vSelect from 'vue-select'
/*
import { SfProductOption ,SfQuantitySelector,SfProperty,SfButton,SfIcon,SfGallery,SfImage,SfColorPicker} from "@storefront-ui/vue";
*/

export default {
  name: "ColorPlayground",
  components: {gVibrantJS, ProductChild, ProductImagePalattePicker},
  data: function () {
    return {
      handle: 'local',
      merge: false,
      colorselection: false,
    }
  },
  mounted() {
    this.$data.merge = handleoptiontest;
  },
  props: {},
  methods: {},
  computed: {
    selectedHexColor() {
      if (!this.$data.colorselection || !this.$data.colorselection.hex) return
      return this.$data.colorselection.hex
    }
  }
}
</script>
<!--
<style   type="text/css" lang="scss" src="@storefront-ui/vue/styles.scss"></style>
-->

