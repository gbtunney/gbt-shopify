<script>
import chroma from "chroma-js";
import * as R from 'ramda'
import {getContrastMax, validateColorOrBool, validateLuminanceThreshold} from "../../../scripts/color";
import {validateEnum, COMPARATOR_OPTIONS} from "../../../scripts/generic";

export default {
  name: "gChromaColor",
  data: function () {
    return {}
  },
  props: {
    /**  Hex Color
     * String - Hex color OR tailwind color variable ex: --color-corn-700
     */
    hex_color: {
      default: false,
      type: [Boolean, String],
      validator:  (value) => validateColorOrBool(value)
    },
    luminance_threshold: {
      type: Object,
      default: function () {
        return {
          threshold: .3, //number
          comparator: 'lte'
        }//string: ramda function - gt,gte,lt,lte
      },
      validator:  (value) => validateLuminanceThreshold(value)
    }
  },
  mounted() {
    console.log("MOUNTDDD", R.is(Number, 3))
  },
  render() {
    /**
     * @slot default
     * @binding {number} ContrastMax - the text color
     * @binding {string} Color - valid (chroma-js) color
     */
    return this.$scopedSlots.default(
        {
          Color: this.$props.hex_color,
          ContrastMax: this.contrastMax
        })
  },
  computed: {
    contrastMax() {
      if (!this.$props.hex_color) return
      const {threshold, comparator} = this.$props.luminance_threshold
      return true //getContrastMax(this.$props.hex_color, threshold, comparator)
    },
  }
}
</script>
