<template>
  <div :style="GridStyle" class="product-image-grid grid-wrapper">
    <div v-for="image,index in Images" :key="index" class="grid-item">
      <slot>
        <div>
          <img v-tooltip="getToolTip(image)"
              @click="$emit('changed', { image: image, linked_option:  getLinkedOptionValue(image )} )"
              :src="image.getSrc($props.image_size)"
              :alt="image.title"
              class="object-cover hover:cursor-pointer">
        </div>
      </slot>
      <slot name="addl" v-bind:image="image" v-bind:url="image.getSrc($props.image_size)"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "product-image-grid",
  components: {},
  data: function () {
    return {
      image_array: [],
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
    updateFunc: {
      type: [Boolean, Function],
      default: false,
    },
    optionHandle: { //obbject binding.
      type: [String, Boolean],
      default: false
    },
  },
  methods: {
    getToolTip: function (image) {
      return {
        content: this.getImageTitle(image),
        classes: 'bg-primary text-light p-0.5 z-50'
      }
    },
    getImageTitle(image) {
      const _linked = this.getLinkedOptionValue(image);
      if (_linked && _linked.title) return _linked.title;
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
    GridStyle: function () {
      return {
        'grid-template-columns': `repeat(${this.$props.columnCount}, 1fr)`,
        'display': 'grid'
      }
    },
    Images: function () {
      return this.$props.images;
    },
  }
}
</script>
<style type="text/css" lang="postcss" scoped>
.grid-wrapper {
  grid-gap: 8px;
//todo: move this.
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

/*
.vs__dropdown-option--highlight {
  background: $vs-state-active-bg;
  color: $vs-state-active-color;
}

.vs__dropdown-option--disabled {
  background: inherit;
  color: $vs-state-disabled-color;

  &:hover {
    cursor: inherit;
  }
}*/
</style>
