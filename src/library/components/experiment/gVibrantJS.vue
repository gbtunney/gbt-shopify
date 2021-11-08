<template>
  <div class="ColorPlayground">
    <div class="my-grid-wrapper">
      <button v-for="(item, index) in Palatte" class="my-grid-item my-swatch w-full h-full"
          v-bind:style="{ background: item.swatch.hex, color: item.swatch.titleTextColor  }"
          @click="$emit('changed', item.swatch.hex )"
          :key="index">
        <div>
          {{ item.key }}
        </div>
        <div>{{ item.swatch.hex }}</div>
      </button>
    </div>
  </div>
</template>
<script>
//yarn  add fast-average-color -D
//node-vibrant
//chroma-js
//this.$emit('changed', this.Instance, response)

import * as Vibrant from 'node-vibrant'

export default {
  name: "ColorPlayground",
  components: {},
  data: function () {
    return {
      vibrant: false,
    }
  },
  props: {
    img_url: {
      type: [Boolean, String],
      default: false,
    },
  },
  watch: {
    img_url: {
      immediate: true,
      async handler(newValue, oldValue) {
        this.$data.vibrant = await this.getVibrant()
      }
    },
  },
  methods: {
    async getVibrant() {
      if (!this.$props.img_url) return false
      let _palatte = false
      let v = new Vibrant(this.$props.img_url, {})
      return v.getPalette(function (err, palette) {
        _palatte = palette
        //  console.log("THE DPPRPEPO",_palatte,palette)
        return
      })
    },
  },
  computed: {
    Palatte: function () {
      return Object.entries(this.$data["vibrant"]).map(function (item) {
        const [key, swatch] = item
        return {"key": key, "swatch": swatch}
      })
    }
  }
}
</script>
<style lang="scss" type="text/scss">

.my-swatch {
  border: 1px solid black;
  cursor: pointer;
}

.my-grid-wrapper {

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.grid-item-wrap {
  display: flex;
  flex-direction: column;
}

</style>
<!--
<style   type="text/css" lang="scss" src="@storefront-ui/vue/styles.scss"></style>
-->

