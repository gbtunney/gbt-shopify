<template>
  <div class="ProjectTest">
    <h1>TESTING</h1>
  </div>
</template>
<script>
import Cart, {ProductGroupBase} from "../library/models/Cart";
import ProductInstanceSingle from "../library/models/ProductInstance";

export default {
  name: "ProjectTest",
  components: {},
  data: function () {
    return {}
  },
  async mounted() {
    const response2 =  await Cart.api().fetchCart(true)
    console.log("fetch CART! dev ( mock mode )",response2, Cart.all());
    const response = await ProductInstanceSingle.insert({
      data: {
        handle: 'balance',
        "meta": "hdkfhhffdf gilliannnnm"
      }
    })    //const response = await ProductInstanceSingle.new()
    console.log("product fetch called !!!!!", response)

  },
  props: {}
}
</script>
