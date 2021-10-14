<template>
  <div class="about">
    <h1>This is an about page</h1>

    <cart-provider :instance="message">
      <div slot-scope="{Cart,isCartLoading , LineItems}">

        <div v-if="!isCartLoading">
          <div v-for="lineitem in LineItems" v-bind:key="lineitem.id">
            <product-instance-provider :instance="lineitem">
              <div slot-scope="{Ready, Product,SelectedVariant,RequestedQuantity}">
              <div v-if="Ready">
                - {{Product.title}} :: {{SelectedVariant.title}}
              </div>

              </div>
            </product-instance-provider>
          </div>

        </div>
      </div>
    </cart-provider>

    <product-instance-provider :options_editable="true" handle="local" :variant="3">
      <!--ff
//{ Loading,Variants,Images,Options,OptionValueList,
// Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
// RequestedQuantity , UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart}
-->

      <div slot-scope="{Loading,Variants,Images,Options,OptionValueList,
      Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
      RequestedQuantity ,Instance, UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart
       }"
          id="shopify-section-product-template" class="shopify-section">


      </div>
    </product-instance-provider>

  </div>
</template>

<script>
import CartData from "@/assets/cart.json"
import ProductInstanceProvider from '@/library/components/product/ProductInstanceProvider.vue'; // @ is an alias to /src
import CartProvider from '@/library/components/cart/CartProvider.vue'; // @ is an alias to /src
import {Product} from '@/library'
  export default {
  name: "App",
  components: {CartProvider,ProductInstanceProvider},
  data: function () {
  return {
  message: CartData
}
},
  props: {},
    async created(){

      const response = await Product.api().fetchAll()
      console.log("loading all!!!",response)
    }
}
</script>
