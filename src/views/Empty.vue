<template>
  <div class="App">
    <div id="baseexample">
      <p>Scroll down the page</p>
      <GroupInstance v-bind="$data.group">
        <div slot-scope="{ ID, note,Items,Status}">
          Loading {{ Status }}
          <TestingComponent :items="Items"/>
          {{ ID }}
          {{ note }}
        </div>
      </GroupInstance>
      <!--      <GroupInstance v-bind="getdata" :id="4444444">
              <div slot-scope="{ ID, note,Items,Status}">

                <div v-if="Items">
                  Loading {{Status}}</div>
                <div v-for="child, index in Items" :key="index">
                  <ProductChild :id="child.id" :handle="child.handle" :variant_id="child.variant_id" >
                    <div slot-scope="{Ready, Product,SelectedVariant, RequestedQuantity,Instance}">
                      <div v-if="child">child:{{child.handle}}-</div>

                      <div class="flex" v-if="Product">
                        {{ Product.title }}
                        &lt;!&ndash;               <SfQuantitySelector :qty="RequestedQuantity"  :min="0"
                                              :max="SelectedVariant.inventory_quantity"
                                              @input="UpdateInstance({ quantity: $event},Instance)" />
                                          <button class="bg-accent-secondary" >REMOVE ME</button>&ndash;&gt;
                      </div>

                    </div>
                  </ProductChild>
                </div>
                {{ID}}
                {{note}}
              </div>
            </GroupInstance>-->
      <product-child handle="local" :variant_id="8" :load_handle="true">
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
              <template #option="{ title , isSelected,$isDisabled ,Thumbnail }">
                <div
                    :class="isSelected ? 'bg-primary-lt' : '' "
                    class="flex font-secondary uppercase items-center text-lg flex-row h-full w-full p-2.5">


                  <span :style="Thumbnail? '' : 'hidden' " style="height: 1.5em; width:auto;aspect-ratio: 1; " class=" border border-primary-dk  mr-8 ">
                            <img v-if='Thumbnail' :src="Thumbnail.getSrc(150)" class="object-cover"/>
                          </span>

                  <span :class="isSelected? 'font-bold' : '' ">{{ $isDisabled }}-{{ title }}</span>

                </div>
              </template>
              <template #selected-option-container="{ option, deselect, multiple, disabled }">
                <SfProperty :name="productOption.title" :value="option.title"/>
              </template>
            </v-select>
          </div>
          <ProductImageGrid
              :columnCount="8"
              optionHandle="color"
              option-handle="color"
              :image_size="1600"
              :images="Images"
              v-if="false">

            <template v-slot:addl="{url}">
              {{ url }}
              <gVibrantJS class="w-1/2" :img_url="url" url="fdfdfdfdfdfd">
              </gVibrantJS>

            </template>
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

                &lt;!&ndash; <span :class="isSelected? 'font-bold' : '' ">{{ title }} </span>&ndash;&gt;
              </div>
            </template>
            <template #selected-option-container="{ option, deselect, multiple, disabled }">
              <div class="vs__selected">
                <span v-if="option.Product">{{ option.Product.title }} / </span>
                <span>{{ option.title }}</span>
              </div>
            </template>
          </v-select>
        </div>
      </product-child>
    </div>
  </div>
</template>
<script>
import {Product} from "../library/models";
import productgroup from "@/assets/productgroup.json" //data
import GroupInstance from '../library/components/product/GroupInstance'
import TestingComponent from "./TestingComponent";
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
import ProductChild from '../library/components/product/ProductChild'
import vSelect from 'vue-select'
import ProductImageGrid from '@/library/components/images/ProductImageGrid.vue';
import ProductImagePalattePicker from '@/library/components/images/ProductImagePalattePicker.vue';
import gVibrantJS from '@/library/components/experiment/gVibrantJS.vue';

export default {
  name: "App",
  components: {
    TestingComponent,
    GroupInstance,
    SfQuantitySelector,
    SfProductOption,
    ProductChild,
    vSelect,
    SfProperty,
    ProductImagePalattePicker,
    ProductImageGrid,
    gVibrantJS
  },
  data: function () {
    return {
      group: productgroup,
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

