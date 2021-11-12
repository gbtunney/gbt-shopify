<template>
  <div class="ColorSort">
  <h1>Color Sorting</h1>
    <v-select autocomplete="on"
        v-if="Products.length > 0"
        :options="Products"
        :value="selectedProduct"
        @option:selecting="UpdateSelectedProduct"
        label="title"
        :autoscroll=true
        :clearable=false></v-select>
    <div class="w-1/2">
      <gUIColorFrame :hex_color="($data.colorselection && $data.colorselection.hex) ? $data.colorselection.hex : ''"/>
      <slider v-model="colorselection"/>
      <chrome v-model="colorselection"/>
    </div>
  </div>
</template>
<script>
import {Product} from "../library/models";
import vSelect from 'vue-select'
import { Slider,Chrome } from 'vue-color'
import gUIColorFrame from '../library/components/ui/gUIColorFrame.vue'

export default {
  name: "ColorSort",
  components: {vSelect,Slider,Chrome,gUIColorFrame},
  data: function () {
    return {
      selectedProduct: false,
      colorselection:false
    }
  },
  computed:{
    Products: function(){
      return Product.query().all()
    }
  },
  props: {},
  methods:{
    UpdateSelectedProduct(product){
      console.log("product" , this)
      this.$data.selectedProduct= product
    }
  }
}
</script>
