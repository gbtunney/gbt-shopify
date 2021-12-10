<template>
  <div class="gTWSwatches font-style-sm-caps">
    <div v-for="(swatch, name,index) in TW_Swatches" :key="index">
      <h1 v-text="name"></h1>
      <hr>
      <ul class="flex" :style="GridStyle">
        <li v-for="(item,index ) in swatch" :key="index" class="w-1/8 m-1">
          <div class="p-2 flex flex-column justify-end" :style="getStyle(item.hex_color)" style="flex-direction: column;justify-content: space-between;">
            <p class="text-lg" v-text="item.name"/>
            <ul class="border border-opacity-80 border-primary border-1 border-solid m-0">
              <li v-for="(btn , index ) in item.classes" style="fontSize: 11px;" class="text-center text-sm bg-opacity-30 cursor-pointer text-black m-1 bg-white font-style-sans"
                  v-text="btn.split('-')[0]"
                  @click="$clipboard(btn)"
                  :key="index"/>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import * as R from 'ramda'

import twcolors from "./../../data/twcolors.json"
import chroma from "chroma-js";
import {isInteger} from "../../scripts/generic";

export default {
  name: "gTWSwatches",
  components: {},
  data: function () {
    return {}
  },
  props: {
    /**
     * Sets the number of columns
     */
    column_count: {
      type: [Number, Boolean, String],
      default: 6
    },
    /** Height
     * String with unit, int will have px added
     */
    height: {
      default: false,
      type: [Boolean, Number, String]
    },
  },
  methods: {
    groupByPrefix(swatches) {
      const byPrefix = R.groupBy(function (swatch) {
        const {name = ''} = swatch;
        const [prefix = ""] = name.toString().split('-')
        return prefix;
      });
      return  byPrefix(swatches);
    },
    getStyle(hex_color = false, _height = this.$props.height) {
      if (!hex_color) return
      return {
        fontSize: '16px',
        ...(_height) ? {'height': (isInteger(_height)) ? `${_height}px` : _height} : {},
        color: this.invertLuminance(hex_color),
        border: `1px solid ${this.invertLuminance(hex_color)}`,
        'background-color': (hex_color) ? hex_color : ''
      }
    },
    invertLuminance(hex_color, _height = this.$props.height) {
      if (!hex_color || !chroma.valid(hex_color)) return '#FF0000'
      const lum = .5 - (.5 - chroma(hex_color).luminance())
      if (lum < .3) return 'white'
      return 'black'
    },
  },
  computed: {
    TW_Swatches() {
      const {swatches = {}, types = []} = twcolors
      return  this.groupByPrefix(Array.from(Object.entries(swatches)).map(function ([key, value]) {
            return {
              name: key,
              hex_color: value,
              classes: types.map(function ({prefix}) {
                return `${prefix}-${key}`
              })
            }
          }
      ))
    },
    GridStyle: function () {
      return {
        ...(this.$props.column_count && isInteger(this.$props.column_count)) ? {'grid-template-columns': `repeat(${this.$props.column_count}, 1fr)`} : {},
        'display': 'grid'
      }
    },
  }
}
</script>

<docs lang="md">
This button is amazing, use it responsibly.
## Examples

Tailwind Color Swatches

```jsx
<gTWSwatches column_count="6" :height="200">Tailwind</gTWSwatches>
```

</docs>

