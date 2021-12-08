<template>
  <div class="DefaultProductView">
    <default-product-page/>
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
