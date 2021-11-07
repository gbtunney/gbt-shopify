<template>
  <div class="App">
    {{ message }}
    <div id="baseexample">
      <p>Scroll down the page</p>
     <GroupInstance v-bind="$data.group">
        <div slot-scope="{ ID, note,Items,Status}">
          Loading {{Status}}
          <div v-for="child, index in Items" :key="index">
            <ProductChild v-bind="child.$toJson()"  :selection_mode="'groupitem'" >
              <div slot-scope="{Ready, Product,SelectedVariant, RequestedQuantity,Instance}">
                <div v-if="child">child:{{child.handle}}-</div>
                <div class="flex" v-if="Product">
                  {{ Product.title }}
<!--               <SfQuantitySelector :qty="RequestedQuantity"  :min="0":selection_mode="'groupitem'"
                      :max="SelectedVariant.inventory_quantity"
                      @input="UpdateInstance({ quantity: $event},Instance)" />
                  <button class="bg-accent-secondary" >REMOVE ME</button>-->
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
                  <!--               <SfQuantitySelector :qty="RequestedQuantity"  :min="0"
                                        :max="SelectedVariant.inventory_quantity"
                                        @input="UpdateInstance({ quantity: $event},Instance)" />
                                    <button class="bg-accent-secondary" >REMOVE ME</button>-->
                </div>

              </div>
            </ProductChild>
          </div>
          {{ID}}
          {{note}}
        </div>
      </GroupInstance>
<!--      <product-instance-provider2 handle="balance" :variant_id="4">
        <div slot-scope="{Ready, loadTest,Product,SelectedVariant,RequestedQuantity,UpdateInstance,Instance}">
        <div v-if="Product">{{ Product.title }}</div>

        </div>
      </product-instance-provider2>-->
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
import productgroup from "@/assets/productgroup.json"

import ProductInstanceProvider2 from '../library/components/product/ProductInstanceProvider2'
import ProductChild from '../library/components/product/ProductChild'
import GroupInstance from '../library/components/product/GroupInstance'


export default {
  name: "App",
  components: {GroupInstance,ProductInstanceProvider2,ProductChild},
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
