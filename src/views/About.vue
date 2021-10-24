<template>
  <div class="about">
    <h1>This is an about page</h1>


    <cart-provider v-bind="message">
      <div slot-scope="{Cart,isCartLoading , LineItems,UpdateLineItem,RemoveLineItem,Testing}">
        TESTING!!!!!!!!! {{Testing}}
        <div v-if="!isCartLoading">
          <div v-for="lineitem in LineItems" v-bind:key="lineitem.id">
            <hr>
            <product-instance-provider2 @changed="UpdateLineItem" v-bind="lineitem.$toJson()">
              <div slot-scope="{Ready, loadTest,Product,SelectedVariant,RequestedQuantity,UpdateInstance,Instance}">
                <div style="border:2px solid red">Ready..Loading {{loadTest}}</div>
                <div class="flex" v-if="Ready">
                  <SfQuantitySelector :qty="RequestedQuantity"  :min="0"
                      :max="SelectedVariant.inventory_quantity"
                      @input="UpdateInstance({ quantity: $event},Instance)" />
                  <button class="bg-accent-secondary" @click="UpdateInstance({ quantity: 0},Instance)">REMOVE ME</button>
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
    <product-instance-provider2 v-bind="$data.testing"  :selection_mode="'extended'" >
      <!--ff:load_mode="'LOAD_ALWAYS'"
//{ Loading,Variants,Images,Options,OptionValueList,
// Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
// RequestedQuantity , UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart}
-->

      <div slot-scope="{test,Ready,Loading,Variants,Images,Options,OptionValueList,
      Product,ProductImage,SelectedVariant,SelectedVariantImage,SelectedOptionList,SelectedOption,
      RequestedQuantity ,Instance, UpdateInstance , UpdateOption,UpdateVariant,addToCartEnabled,addToCart,loadTest
       }"
          id="shopify-section-product-template" class="shopify-section">

        <div v-if="Ready" style="border:2px solid red">Ready..Loading</div>
        <button @click="test" class="bg-accent-secondary" >
        TEST PROODUCTS ||
        </button>
        <div v-if="Product"> LOADED PRODUCT : {{Product.title}}</div>
        <button @click="addToCart(Instance)">Add to Cart </button>
        <div v-if="ProductImage" class="w-1/4 border-corn border bg-primary relative" >
          <img  class="object-cover absolute w-full h-full" :src="ProductImage.src" >
          <div class="g-svg fg-fill-corn-300 opacity-80 ">
            <svg version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" overflow="visible" xml:space="preserve">
        <rect fill="#FF0000" width="1024" height="1024"/>
      </svg>

          </div>

        </div>



      </div>
    </product-instance-provider2>

  </div>
</template>

<script>
import CartData from "@/assets/cart.json"
import ProductInstanceProvider2 from '@/library/components/product/ProductInstanceProvider2.vue'; // @ is an alias to /src
import CartProvider from '@/library/components/cart/CartProvider.vue'; // @ is an alias to /src
import {Product,LineItem} from '@/library'
import { SfQuantitySelector} from "@storefront-ui/vue";
import {renameKeys} from "../library/scripts/generic";


  export default {
  name: "App",
  components: {CartProvider,ProductInstanceProvider2,SfQuantitySelector},
  data: function () {
  return {
  message: false,
    testing: false
}
},
  props: {},
    async mounted(){
      var keysMap = {name: 'firstName', job: 'passion'};
      var obj = {name: 'Bobo', job: 'Front-End Master'};
console.log("RENAME KEYS TEST@@@@@@@@@@@@@@",   renameKeys(keysMap, obj) )

      this.$store.set('shopify/cart_token', CartData.token);

      this.$data.message=  CartData

     const response = await Product.new()
      console.log("THE PRODUCT ID IS!!!!!",response, LineItem.all())
    },
    methods:{
    async Testing(){

      this.$data.testing={handle: 'balance' , id:444444444, variant_id : 8, options_editable: ['color']}

    }
    }
}
</script>
<style lang="scss" type="text/css">
//@import "@/library/scss/gMixins.scss";
body{
  //@include debug-class-names();
}

</style>
