<template>
  <div class="App">
    {{ message }}
  </div>
</template>
<script>
export default {
  name: "App",
  components: {},
  data: function () {
    return {
      message: 'Hello'
    }
  },
  props: {}
}
</script>
