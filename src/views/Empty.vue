<template>
  <div class="App">
    {{ message }}
    <div id="baseexample">
      <p>Scroll down the page</p>
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
import store from "../store";


export default {
  name: "App",
  components: {},
  data: function () {
    return {
      message: 'Hello'
    }
  },
  props: {},

 async mounted() {
  // const response26 = await Product.api().fetchByHandle("local")
   const response26 = await Product.api().fetchAll()
   console.log("ORM Response: Product ::query() :: ", response26)
   var product = Product.getProductByHandle("local");
var variant = product.Variants[0];
  const resp = await product.createVariantOptionPivot()
 //  console.log(" variant new functions " ,resp,VariantOption.all())
   console.log(" chhecking new functions " ,product.getOptionValueList("color") )
 }
}
</script>
