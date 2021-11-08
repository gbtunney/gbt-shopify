<template>
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
</template>
<script>
import ProductChild from '../library/components/product/ProductChild'

export default {
  name: 'TestingComponent',
  components: {ProductChild},
  props: {
    Items: {}
  }
}
</script>
