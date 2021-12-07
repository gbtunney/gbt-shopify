<template>
  <div class="DefaultProductView">
   <h1>DefaultProductView</h1>
    <default-product-page>

    </default-product-page>
  </div>
</template>
<script>
import DefaultProductPage from './../library/components/product/DefaultProductPage'
export default {
  name: "DefaultProductView",
  components: {DefaultProductPage},
  data: function () {
    return {}
  },
  props: {}
}
</script>
