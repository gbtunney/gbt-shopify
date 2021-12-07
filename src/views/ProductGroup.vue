<template>
  <div class="ProductGroup">
    <h1>Group Demo</h1>
    <GroupInstance v-bind="$data.group">
      <div slot-scope="{ ID, note,Items,Status}">
        Loading {{ Status }}
        <div v-for="child, index in Items" :key="index">
          <ProductChild v-bind="child.$toJson()" :selection_mode="'groupitem'">
            <div slot-scope="{Ready, Product,SelectedVariant,UpdateInstance,RequestedQuantity,Instance,SelectedVariantImage}">
              <div v-if="child">child:{{child.handle}}-</div>
              <img v-if='SelectedVariantImage' :src="SelectedVariantImage.getSrc(200)"/>
              <div class="flex" v-if="Product && SelectedVariant">
                {{ Product.title }} -- {{SelectedVariant.title}}
                <SfQuantitySelector :qty="RequestedQuantity" :min="0"
                    :max="SelectedVariant.quantity"
                    @input="UpdateInstance({ quantity: $event},Instance)"/>
                <button class="bg-accent-secondary" @click="Instance.$delete()">REMOVE ME</button>
              </div>

            </div>
          </ProductChild>
        </div>

      </div>
    </GroupInstance>
  </div>
</template>
<script>
import productgroup from "../library/data/productgroup.json" //data
import ProductChild from '../library/components/product/ProductChild'
import GroupInstance from '../library/components/product/GroupInstance'
import {SfQuantitySelector} from "@storefront-ui/vue";
import {toInteger} from "../library/scripts/generic";
export default {
  name: "ProductGroup",
  components: {ProductChild,GroupInstance,SfQuantitySelector},
  data: function () {
    return {
      group: productgroup,
    }
  },
  props: {},
  methods: {
    getChildID(parent_id, index){
      const str   =`${parent_id}${index}`
console.log("THE ID OF CHIHLD IS !!!" ,toInteger(str) )
     // return toInteger(str)

    }
  }
}
</script>
