<template>
  <div class="gColorSwatch" v-bind:style="getStyle">
    <slot>
     <span>{{hex_color}}</span>
  </slot>
  </div>
</template>
<script>
import chroma from "chroma-js";
export default {
  name: "gColorSwatch",
  components: {},
  data: function () {
    return {
    }
  },
  watch:{
  },
  computed:{
    invertLuminance:function (){
      if (!this.$props.hex_color) return
      const lum = .5 - (.5 - chroma(this.$props.hex_color).luminance())
      if (lum < .3) return '#FFFFFF'
      return '#000000'
    },
    getStyle: function () {
      return {
        color: this.invertLuminance,
        fontSize: '16px',
        border: '1px solid red',
        width: `${this.$props.width}px`,
        height: `${this.$props.height}px`,
        'background-color': (this.$props.hex_color) ? this.$props.hex_color : ''
      }
    }
  },
  props: {
    hex_color: {
      type: [String,Boolean],
      default:  false
    },
    width:{
      type: [Number,Boolean],
      default:  50
    },
    height:{
      type: [Number, Boolean],
      default:  50
    },
    tag:{
      type: [String],
      default:  '<div>'
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
.gColorSwatch{
  overflow: hidden;
  font-size: 9px;
}
</style>
