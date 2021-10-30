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
  mounted(){

    console.log("settings!!!!!!!!!!!!!!!!!!", this.$gbtconfig)
  //  store.registerModule(['entities', 'products'], moduleLoadStatus)

  }
/*  async mounted() {
    const response19 = await Product.insert({
      data: {
        handle: "test"
      }
    })
    const response26 = await Product.api().fetchByHandle("local")
    console.log("ORM Response: Product ::query() :: ", response26)
    console.log("ORM Response: Product ::insert :: ", response19)

  }*/
}
</script>
