<template>
  <div class="App">
    {{ message }}
    <div id="baseexample">
      <p>Scroll down the page</p>
<!--    <GroupInstance v-bind="$data.group">
        <div slot-scope="{ ID, note,Items,Status}">
          Loading {{Status}}
          <div v-for="child, index in Items" :key="index">
            <ProductChild v-bind="child.$toJson()"  :selection_mode="'groupitem'" >
              <div slot-scope="{Ready, Product,SelectedVariant, RequestedQuantity,Instance,UpdateInstance}">
                <div v-if="child">child:{{child.handle}}-</div>
                <div class="flex" v-if="Product && SelectedVariant">
                  {{ Product.title }}
              <SfQuantitySelector :qty="RequestedQuantity"  :min="0"
                      :max="SelectedVariant.quantity"
                      @input="UpdateInstance({ quantity: $event},Instance)" />
                  <button class="bg-accent-secondary" @click="Instance.$delete()">REMOVE ME</button>
                </div>

              </div>
            </ProductChild>
          </div>
          {{ID}}
          {{note}}
        </div>
      </GroupInstance>

      <GroupInstance v-bind="getdata" :id="4444444">
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
       <div slot-scope="{Ready, loadTest,Product,Variants,SelectedVariant,UpdateOption,Options,OptionValueList,SelectedOptionValue,UpdateInstance,Instance,UpdateVariant}">
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

                 &lt;!&ndash;
                 <span :style="Thumbnail? '' : 'hidden' " style="height: 1.5em; width:auto;aspect-ratio: 1; " class=" border border-primary-dk  mr-8 ">
                            <img v-if='Thumbnail' :src="Thumbnail.getSrc(150)" class="object-cover"/>
                          </span>
                 &ndash;&gt;

                 <span :class="isSelected? 'font-bold' : '' ">{{ $isDisabled }}-{{ title }}</span>

               </div>
             </template>
             <template #selected-option-container="{ option, deselect, multiple, disabled }">
               <SfProperty :name="productOption.title" :value="option.title"/>
             </template>
           </v-select>
         </div>
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
       </div>
      </product-child>
      <p v-pin="200">Stick me 200px from the top of the page</p>
    </div>
  </div>
</template>
<script>
import {
  Cart,
  ProductGroupBase,
  VariantOption,
  ProductInstanceSingle,
  ProductOptionValue,
  Product,
Variant
} from "../library/models";
import productgroup from "@/assets/productgroup.json" //data

import ProductInstanceProvider2 from '../library/components/product/ProductInstanceProvider2'
import ProductChild from '../library/components/product/ProductChild'
import GroupInstance from '../library/components/product/GroupInstance'
import vSelect from 'vue-select'
import { SfProductOption ,SfQuantitySelector,SfProperty,SfButton,SfIcon,SfGallery,SfImage} from "@storefront-ui/vue";

export default {
  name: "App",
  components: {SfProperty,GroupInstance,ProductInstanceProvider2,ProductChild,SfQuantitySelector,vSelect,SfProductOption},
  data: function () {
    return {
      message: 'Hello',
      group: productgroup,
    }
  },
  props: {},
  computed:{
    getdata(){
      return {...this.$data.group}
    }
  },

 async created() {
    console.log("-------product",Product.all())
   this.$store.commit('productloader/clear_loader')
  // this.$store.dispatch('entities/deleteAll')
   console.log("--------------------product",Product.all())

   //TODO: replace this tomarrow.
   const mydata = {
     note: "i am a group",
     items: [
       {
         variant_id: 22589282975862,
         /* group_id: this.$data._refID,*/
         message: "thhis is a test"
       }
     ]
   }
  // this.$data.group = mydata;
   /*const instance = await ProductInstanceGroup.insert({
     data: mydata
   })*/
   //console.log("dataaaa", instance, mydata)
 },

}
</script>
<style   type="text/css" lang="scss" src="@storefront-ui/vue/styles.scss"></style>

