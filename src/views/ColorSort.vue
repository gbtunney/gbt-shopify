<template>
  <div class="ColorSort">
    <h1>Color Sorting</h1>

    <div class="w-full">
      <div class="flex">
        <chrome  v-model="colorselection"/>
        <div>
          <gUIColorFrame :hex_color="($data.colorselection && $data.colorselection.hex) ? $data.colorselection.hex : ''"/>
          <div class="testSelector">{{ SelectionProps }}</div>
          complimentary:
          <gUIColorFrame :hex_color="($data.colorselection_comp && $data.colorselection_comp) ? $data.colorselection_comp : ''"/>
          analogous
          <div class="flex">
            <gUIColorFrame :hex_color="($data.color_ana) ? $data.color_ana[0] : ''"/>
            <gUIColorFrame :hex_color="($data.color_ana) ? $data.color_ana[1] : ''"/>
            <gUIColorFrame :hex_color="($data.color_ana) ? $data.color_ana[2] : ''"/>
          </div>
          <slider v-model="colorselection"/>
          <v-select autocomplete="on"
              v-if="Products.length > 0"
              :options="Products"
              :value="selectedProduct"
              @option:selecting="UpdateSelectedProduct"
              label="title"
              :autoscroll=true
              :clearable=false></v-select>
        </div>
      </div>
      <div class="w-full">
        <product-child handle="local" :variant_id="8" :load_handle="true">
          <div slot-scope="{Ready,Product,Variants,SelectedVariant,UpdateOption,Options,OptionValueList,SelectedOptionValue,UpdateInstance,Images}">
            <v-data-table
                dense
                :headers="headers"
                :items="GetItems(OptionValueList('color'))"
                :items-per-page="-1"
                item-key="name"
                class="elevation-1"
            >
              <template v-slot:item.hex_color="{ item }">
                <gUIColorFrame :hex_color="item.hex_color"/>
              </template>
              <template v-slot:item.thumbnail="{ item }">
                <img v-if='item.thumbnail' :src="item.thumbnail.getSrc(50)"/>
              </template>

            </v-data-table>
          </div>
        </product-child>
      </div>
    </div>
  </div>
</template>
<script>
import {Product, ProductOptionValue} from "../library/models";
import vSelect from 'vue-select'
import {Slider, Chrome} from 'vue-color'
import gUIColorFrame from '../library/components/ui/gUIColorFrame.vue'

import Vue from 'vue'
import chroma from "chroma-js";

import ProductChild from '../library/components/product/ProductChild'
import ChromaColor from "../library/models/ChromaColor";

import  {
    VApp,
    VDataTable,
} from 'vuetify/lib'

export default {
  name: "ColorSort",
  components: {vSelect, Slider, Chrome, gUIColorFrame, VApp,VDataTable, ProductChild},
  data: function () {
    return {
      selectedProduct: false,
      colorselection: {
        hex: '#FFFF00',
      },
      colorselection_comp: false,
      color_ana: [false, false, false],
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        {text: 'Color', value: 'hex_color'},
        {text: 'Image', value: 'thumbnail'},
        {text: 'deltaE (rel)', value: 'deltaE'},
        {text: 'distance (rel)', value: 'distance'},
        {text: 'hue ', value: 'hue'},
        {text: 'comp ', value: 'comp'},

        {text: 'sat', value: 'sat'},
        {text: 'lum', value: 'luminance'},
        {text: 'temp', value: 'temperature'} //227 - 180
      ],
    }
  },
  computed: {
    Products: function () {
      return Product.query().all()
    },
    SelectionProps() {
      return {
        hsl: chroma(this.$data.colorselection.hex).hsl(),
        lum: chroma(this.$data.colorselection.hex).luminance(),
        temperature: chroma(this.$data.colorselection.hex).temperature(),
        comp: (chroma(this.$data.colorselection.hex).get('hsl.h') > 180) ? (chroma(this.$data.colorselection.hex).get('hsl.h') - 180).toFixed(2) : (chroma(this.$data.colorselection.hex).get('hsl.h') + 180).toFixed(2)

      }
    }
  },
  props: {},
  methods: {
    TestComp(_color) {
      var gtemp = new ChromaColor(_color.hex)
      console.log("COLOR CHANGEDD!!", _color.hex, gtemp.analogous)
      this.$data.colorselection_comp = gtemp.complementary
      this.$data.color_ana = gtemp.analogous
    },
    GetItems(items) {
      const that = this;
      return items.map(function (item) {
        var value = ProductOptionValue.query().whereId([item.product_id, item.handle]).first()
        // console.log("COMPARE", item,value,value.compareColor(that.$data.colorselection.hex))

        return {...item, ...value.compareColor(that.$data.colorselection.hex)}
      })
    },
    CompareColor(item, prop = 'deltaE') {
      var value = ProductOptionValue.query().whereId([item.product_id, item.handle]).first()
      return value.compareColor(this.$data.colorselection.hex)['deltaE']
    },
    UpdateSelectedProduct(product) {
      console.log("product", this)
      this.$data.selectedProduct = product
    }
  }
}
</script>
