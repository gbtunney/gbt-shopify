<template>
  <div class="about">
    <h1>This is an about page</h1>

    <cart-provider :instance="message">
      <div slot-scope="{Cart,isCartLoading , LineItems}">
        <div v-if="!isCartLoading">
          <div v-for="lineitem in LineItems" v-bind:key="lineitem.id">
            <product-instance-provider2 v-bind="lineitem.$toJson()">
              <div slot-scope="{Ready, Product,SelectedVariant,RequestedQuantity}">
                <div v-if="Ready">
                 {{RequestedQuantity}} - {{ Product.title }} :: {{ SelectedVariant.title }}
                </div>

              </div>
            </product-instance-provider2>
          </div>
        </div>
      </div>
    </cart-provider>
    <hr>

    <button @click="Testing">CLICK MEEEEEE</button>
    <product-instance-provider2 v-bind="$data.testing" >
      <!--ff
//{ Loading,Variants,Images,Options,OptionValueList,
// Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
// RequestedQuantity , UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart}
-->

      <div slot-scope="{Loading,Variants,Images,Options,OptionValueList,
      Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
      RequestedQuantity ,Instance, UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart,initTest
       }"
          id="shopify-section-product-template" class="shopify-section">

        <button @click="initTest">
initialize hhhhhjhhhjhhjhjhjhhj
        </button>
{{Options}}

      </div>
    </product-instance-provider2>

  </div>
</template>

<script>
import CartData from "@/assets/cart.json"
import ProductInstanceProvider2 from '@/library/components/product/ProductInstanceProvider2.vue'; // @ is an alias to /src
import CartProvider from '@/library/components/cart/CartProvider.vue'; // @ is an alias to /src
import {Product} from '@/library'
  export default {
  name: "App",
  components: {CartProvider,ProductInstanceProvider2},
  data: function () {
  return {
  message: false,
    testing: false
}
},
  props: {},
    async mounted(){
      this.$data.message=  CartData
   //  const response = await Product.api().fetchAll()

    //const response = await Product.api().fetchByHandle('local')

    //  console.log("CREAT77777777777777777777777", response,this.$data.message)
     // const response = await Product.api().fetchAll()

    },
    methods:{
    Testing(){
      this.$data.testing={handle: 'balance' , variant_id : 8, options_editable: ['color']}
    }
    }
}
</script>
