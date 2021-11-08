<template>
  <div>
    <div :style="GridStyle" class="product-image-grid grid-wrapper">
      <div v-for="image,index in Images" :key="index" class="grid-item p-2">
        <slot>
          <div>
            <img @click="$emit('changed', { image: image, linked_option:  getLinkedOptionValue(image )} )"
                :src="image.getSrc($props.image_size)"
                :alt="image.title"
                class="object-cover hover:cursor-pointer w-full h-full">
            <div>Working Option :: {{ getImageTitle(image) }}</div>
            <div v-bind:style="{ background: getOptionHex(image) }">{{ getOptionHex(image) }}</div>
            <gVibrantJS class="w-1/2" @changed="updateInstance({ hex_color: $event},image)" :img_url="image.getSrc($props.image_size)">
            </gVibrantJS>
          </div>
        </slot>
      </div>
      <h1>Option dump</h1>
    </div>
    <code>
      {{ OptionValueDump }}
    </code>
  </div>
</template>
<script>
import gVibrantJS from './../experiment/gVibrantJS'
import {ProductOptionValue} from "../../models";
import {cloneObject} from "../../scripts/generic";

export default {
  name: "ProductImagePalattePicker",
  components: {gVibrantJS},
  data: function () {
    return {
      image_array: [],
      test: "gilliansslklkjlkl"
    }
  },
  props: {
    columnCount: {
      type: Number,
      default: 8
    },
    images: {
      type: [Array, Boolean],
      default: () => []
    },
    image_size: {
      type: [Number],
      default: 400
    },
    optionHandle: {
      type: [String, Boolean],
      default: false
    },
    product: {
      type: [Object, Boolean],
      default: false
    },
  },
  methods: {
    async updateInstance(_data, image) {
      const _linked = this.getLinkedOptionValue(image);
      const response = await ProductOptionValue.update({
        where: [_linked["product_id"], _linked["handle"]],
        data: _data
      })
      //this.$emit('changed', this.Instance, response)
      return response
    },
    getImageTitle(image) {
      const _linked = this.getLinkedOptionValue(image);
      if (_linked && _linked.title) return _linked.title;
    },
    getOptionHex: function (image) {
      var optionval = this.getLinkedOptionValue(image)
      if (optionval && optionval.hex_color) return optionval.hex_color
      return "no color"
    },
    getLinkedOptionValue(image) {
      if (!this.$props["optionHandle"] || !image) return;
      if (image && image.Variants && image.Variants.length > 0) {
        const [variant] = image.Variants
        const _option_value = variant.getOptionValue(this.$props["optionHandle"]);
        if (_option_value) return _option_value;
      }
      return;
    }
  },
  computed: {
    OptionValueDump: function () {
      if (!this.$props.product) return
      var valuelist = this.$props.product.getOptionValueList('color')
      return valuelist.map(function (item) {
        return cloneObject(item.$toJson(), 'pick', ["handle", "hex_color"])
      })
    },
    Images: function () {
      return this.$props.images;
    },
    GridStyle: function () {
      return {
        'grid-template-columns': `repeat(${this.$props.columnCount}, 1fr)`,
        'display': 'grid'
      }
    },
  }
}
</script>
<style type="text/css" lang="postcss" scoped>
.grid-wrapper {
  grid-gap: 8px;
}

@supports (aspect-ratio: 1) {
  .grid-item {
    width: 100%;
    aspect-ratio: 1;
  }
}

.grid-item {
  width: 100%;
  aspect-ratio: 1 / 1;
}

grid-item::before {
  float: left;
  padding-top: 100%;
  content: "";
}

.grid-item::after {
  display: block;
  content: "";
  clear: both;
}

@supports not (aspect-ratio: 1 / 1) {
  .grid-item::before {
    float: left;
    padding-top: 100%;
    content: "";
  }

  .grid-item::after {
    display: block;
    content: "";
    clear: both;
  }
}
</style>
