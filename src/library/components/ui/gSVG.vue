<template>
  <div class="flex">
    <slot>
      <div v-if="$props.path" class="g-svg gIcon-wrapper" :style=" svg_css()">
        <inline-svg :src="$props.path"/>
      </div>
    </slot>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg';
import chroma from "chroma-js";

const R = window.R

export default {
  name: "gSVG",
  components: {InlineSvg},
  data: function () {
    return {_color: false}
  },
  props: {
    path: {
      default: false,
      type: [Boolean, String]
    },
    color: {
      default: false,
      type: [Boolean, String]
    },
    bg_color: {
      default: false,
      type: [Boolean, String]
    },
    width: {
      default: false,
      type: [Boolean, String]
    },
    height: {
      default: false,
      type: [Boolean, String]
    },
    css: {
      default: 'w-full',
      type: [String]
    }
  },
  watch: {
    color: {
      immediate: true,
      handler(newValue, oldValue) {
        if (chroma.valid(newValue))
          console.log(" color changed from " + oldValue + " to " + newValue)
      }
    }
  },
  methods: {
    svg_css(_hex_color = this.$props.color, _bg_hex_color = this.$props.bg_color, _width = this.$props.width, _height = this.$props.height) {
      return {
        ...(_width) ? {'width': _width} : {},
        ...(_height) ? {'height': _height} : {},
        ...(chroma.valid(_hex_color)) ? {'--color': _hex_color} : {'--color': `var(${_hex_color})`},
        ...(_bg_hex_color == false || _bg_hex_color == 'false')
            ? {'--bg-color': 'transparent'} : (chroma.valid(_bg_hex_color))
                ? {'--bg-color': _bg_hex_color}
                : {'--bg-color': `var(${_bg_hex_color})`},
      }
    },
  }
}
</script>
<style lang="postcss" type="text/css" scoped>

.g-svg {
  --color: #0944fd;
  --bg-color: #0944fd;
  color: var(--color);
  background-color: var(--bg-color);
}

.g-svg >>> path, .g-svg >>> rect, .g-svg >>> g, .g-svg >>> circle {
  fill: var(--color);
}
</style>
