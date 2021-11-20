<template>
  <div :style="svg_css()" :class="$props.css" class="gKabob flex box-border justify-between items-center">
    <div class="gKabob__left reflect-x">
      <slot name="left">
        <g-s-v-g v-bind="Vars"/>
      </slot>
    </div>
    <div class="gKabob__center kabob-hairline w-full" :class="($props.hr)? 'hr' : ''">
      <slot name="center">
        <span class="p-px  gKabob_center__inner ">MIDDLE</span>
      </slot>
    </div>
    <div class="gKabob__right">
      <slot name="right">
        <g-s-v-g v-bind="$props"/>
      </slot>
    </div>
  </div>
</template>
<script>
import gSVG from './gSVG.vue'
import chroma from "chroma-js";

const R = window.R

const default_color = '#0944fd';   //also change in stylesheeet

export default {
  name: "gKabob",
  components: {gSVG},
  data: function () {
    return {}
  },
  props: {
    path: {
      default: false,
      type: [Boolean, String]
    },
    color: {
      default: default_color,
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
    hr: {
      default: true,
      type: [Boolean]
    },
    css: {
      default: 'w-full',
      type: [String]
    }
  },
  computed: {
    Vars() {
      return R.omit(['css', 'bg_color'], {...this.$props});
    }
  },
  methods: {
    svg_css(_hex_color = this.$props.color, _bg_hex_color = this.$props.bg_color, _width = this.$props.width, _height = this.$props.height) {
      return {
        ...(_height) ? {'height': _height} : {},
        ...(chroma.valid(_hex_color)) ? {'--color': _hex_color} : {'--color': `var(${_hex_color})`},
        ...(chroma.valid(_bg_hex_color)) ? {'--bg-color': _bg_hex_color} : {'--bg-color': `var(${_bg_hex_color})`}
      }
    }
  }
}
</script>
<style lang="postcss" type="text/css" scoped>
.gKabob {
  --color: #0944fd;
  --bg-color: #0944fd;
  background-color: var(--bg-color);
  color: var(--color);
}

.gKabob__center {
  background-color: var(--bg-color);
}

.gKabob_center__inner {
  background-color: var(--bg-color);
  color: var(--color);
}

.kabob-svg-wrapper >>> path, .kabob-svg-wrapper >>> rect, .kabob-svg-wrapper >>> g, .kabob-svg-wrapper >>> circle {
  fill: var(--color);
}

.reflect-x {
  transform: scale(-1, 1);
}

.kabob-hairline.hr {
  background: linear-gradient(180deg,
  transparent calc(50% - 1px),
  var(--color) calc(50%),
  transparent calc(50% + 1px)
  );
}
</style>
