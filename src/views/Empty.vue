<template>
  <div class="App">
    {{ message }}
    <div id="baseexample">
      <p>Scroll down the page</p>
      <GroupInstance v-bind="$data.group">
        <div slot-scope="{ ID, note,Items}">
          {{Items}}
          <div v-for="child, index in Items" :key="index">
<!--            <product-instance-provider2  v-bind="child.$toJson()">
              <div slot-scope="{Ready, loadTest,Product,SelectedVariant,RequestedQuantity,UpdateInstance,Instance}">
                <div style="border:2px solid red">Ready..Loading {{loadTest}}</div>
                {{child}}
                <div class="flex" v-if="Ready">

&lt;!&ndash;                  <SfQuantitySelector :qty="RequestedQuantity"  :min="0"
                      :max="SelectedVariant.inventory_quantity"
                      @input="UpdateInstance({ quantity: $event},Instance)" />&ndash;&gt;
                  <button class="bg-accent-secondary" @click="UpdateInstance({ quantity: 0},Instance)">REMOVE ME</button>
                  {{RequestedQuantity}} - {{ Product.title }} :: {{ SelectedVariant.title }}
                </div>

              </div>
            </product-instance-provider2>-->
          </div>
          {{ID}}
          {{note}}
        </div> <product-instance-provider2 handle="balance" :variant_id="4">

      </product-instance-provider2>
      </GroupInstance>
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
import store from "../store"
import productgroup from "@/assets/productgroup.json"

import ProductInstanceProvider2 from '../library/components/product/ProductInstanceProvider2'

import GroupInstance from '../library/components/product/GroupInstance'
import {ProductInstanceGroup} from "../library";


export default {
  name: "App",
  components: {GroupInstance,ProductInstanceProvider2},
  data: function () {
    return {
      message: 'Hello',
      group: productgroup,
    }
  },
  props: {},

 async mounted() {
  // const response26 = await Product.api().fetchByHandle("local")
  // const response26 = await Product.api().fetchAll()
 // console.log("ORM Response: Product ::query() :: ", response26)
 //  var product = Product.getProductByHandle("local");
//var variant = product.Variants[0];
   //console.log(" chhecking new functions " ,variant/*product.getOptionValueList("color")*/)

  //const resp = await product.createVariantOptionPivot()
 //  console.log(" variant new functions " ,resp,variant.getOptionValue("color"))

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
