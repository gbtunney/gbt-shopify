<template>
  <div v-if="$props.path" class="g-svg gIcon-wrapper"
      :class="getCSS"
      :style=" svg_css()">
    <slot>
      <!-- @slot Use this slot inline svg default -->
      <inline-svg :src="$props.path"/>
    </slot>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg';
import chroma from "chroma-js";
import {isInteger} from "../../scripts/generic";
import {DimensionsMixin} from "../../mixins/DimensionsMixin"
import {colorThemeMixin} from "../../mixins/ColorMixins"

const R = window.R

export default {
  name: "gSVG",
  components: {InlineSvg},
  mixins:[colorThemeMixin,DimensionsMixin]
  data: function () {
    return {_color: false}
  },
  props: {
    /**
     * SVG Path
     *
     * @property {number} newValue new value set
     * @property {number} oldValue value that was set before the change
     */
    path: {
      default: false,
      type: [Boolean, String]
    },
    /** Additional CSS classes
     */
    addl_css: {
      default: 'w-full',
      type: [String,Array]
    },
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
  computed: {
    getCSS() {
      return [this.$props.addl_css, ...this.svg_color_classes()]
    }
  },
  methods: {
    svg_color_classes(_hex_color = this.$props.color, _bg_hex_color = this.$props.bg_color) {
      return [...(_bg_hex_color == false || _bg_hex_color == 'false') ? [] : ['svg-bg-color'],
        ...(_hex_color == false || _hex_color == 'false') ? [] : ['svg-fg-color']
      ]
    },
    svg_css(_hex_color = this.$props.color, _bg_hex_color = this.$props.bg_color, _width = this.$props.width, _height = this.$props.height) {
      return {
        ...(_width) ? {'width': (isInteger(_width)) ? `${_width}px` : _width} : {},
        ...(_height) ? {'height': (isInteger(_height)) ? `${_height}px` : _height} : {},
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

.g-svg.svg-fg-color {
  color: var(--color);
}

.g-svg.svg-bg-color {
  background-color: var(--bg-color);
}

.g-svg.svg-fg-color >>> path, .g-svg.svg-fg-color >>> rect, .g-svg.svg-fg-color >>> g, .g-svg.svg-fg-color >>> circle {
  fill: var(--color);
}
</style>

<docs lang="md">
## Examples

Basic Icon (using css properties):

```jsx
<gSVG path="/svg/divider.svg" css="w-1/12 fg-fill-accent-secondary-dk bg-accent-primary"></gSVG>

```
Icon with Tailwind color

```jsx
<gSVG path="/svg/divider.svg" width="120" color="--color-corn-200" bg_color="--color-corn-700"></gSVG>

```
Icon with Hex color & Percent Width

```jsx
<gSVG path="/svg/divider.svg" width="10%" color="#FF0000" bg_color="#ffa1f2"></gSVG>
```
</docs>
