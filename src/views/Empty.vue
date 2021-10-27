<template>
  <div class="App">
    {{ message }}
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
    const response19 = await Product.insert({
      data: {
        handle: "test"
      }
    })
    const response26 = await Product.api().fetchByHandle("local")
    console.log("ORM Response: Product ::query() :: ", response26)
    console.log("ORM Response: Product ::insert :: ", response19)

  }
}
</script>
