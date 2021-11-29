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
            <input type="text" :value="getColorStory(image)" v-on:keyup.enter="updateInstance({ meta: $event.target._value},getLinkedOptionValue(image))">
            <div>Working Option :: {{ getImageTitle(image) }}</div>
            <div v-bind:style="{ background: getOptionHex(image) }">{{ getOptionHex(image) }}</div>
            <gVibrantJS class="w-1/2" @changed="updateInstance({ hex_color: $event},getLinkedOptionValue(image))" :img_url="image.getSrc($props.image_size)"/>
          </div>
        </slot>
      </div>
      <button v-text="'Option dump copy to cliboard'" ref="clipboardbbtn"
          class="bg-accent-secondary-dk text-accent-primary-lt p-1 m-1 uppercase hover:bg-corn-50 hover:border-accent-secondary-dk hover:text-accent-secondary-dk border-2 border-solid uppercase"
          @click="$clipboard(OptionValueDump)"/>
    </div>
    <code>
      {{ OptionValueDump }}
    </code>
  </div>
</template>
<script>
import gVibrantJS from './../experiment/gVibrantJS'

import {ProductOptionValue} from "../../models";
import {cloneObject, toInteger} from "../../scripts/generic";
  import chroma from "chroma-js";
import {getEntity} from "../../orm/functions";
const R = window.R;
const RA = window.RA;

export default {
  name: "ProductImagePalattePicker",
  components: {gVibrantJS},
  data: function () {
    return {
      image_array: [],
      color_story: [],
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
    merge_values: {
      type: [Array, Boolean],
      default: false
    },
  },
  watch:{
    merge_values: {
     /* immediate: true,*/
      async handler(value, oldValue) {
        if (value/* && (value != this.RefID)*/) {
          if (!this.$props.product) return
          console.log(" mergeeeeeee  ged from ", value)
          if (this.$props.merge_values) this.mergeAddlData(this.$props.merge_values)
        }
      }
    },
  },
  methods: {
    async mergeAddlData(mergeArr = []) {
      if (!this.$props.product) return
      const product_id = this.$props.product.id
      const that = this;
      let newarr = mergeArr.map(function (item) {
        var position = chroma.deltaE('#c36a85', item.hex_color);
        var id = [product_id, item.handle]
        return {...item, ['$id']: id, position: position, product_id: product_id}
      })
      //update by array!!!!
    /*  const response = await ProductOptionValue.update({
        data: newarr
      })*/
      const response = await this.$store.dispatch('entities/update', {
        entity: 'productoptionvalue',
        data: newarr
      })
      console.log("!new app  ", response, newarr);


      /*getEntity*/
      /*
       store.dispatch('entities/update', {
        entity: 'users',
        where: 2,
        data: { age: 24 }
    })
       */
    },
     updateInstance(_data, _option) {
      console.log("UPDATED!!!!!!!!!!!!!!!!!!!!", _data,_option)
     // const _linked = this.getLinkedOptionValue(image)
      const response =  ProductOptionValue.update({
        where: [_option["product_id"], _option["handle"]],
        data: _data
      })
      //this.$emit('changed', this.Instance, response)
      return response
    },
    getColorStory(image) {
      const _linked = this.getLinkedOptionValue(image);
      if (_linked && _linked.meta) return _linked.meta;
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
        return cloneObject(item.$toJson(), 'pick', ["handle", "meta","hex_color"])
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
