<template>
  <div class="gPageStyler text-left">
    <h1>Page Styler</h1>
    <div class="flex flex-column text-white  text-lg  ">
      <button v-text="'Copy to clipboard'" ref="clipboardbbtn"
          class="bg-accent-secondary-dk p-1 m-1 uppercase hover:bg-corn-50 hover:border-accent-secondary-dk hover:text-accent-secondary-dk border-2 border-solid uppercase"
          @click="$clipboard(BuilderArr)"/>
      <button @click="addStyleObj"
          class="bg-accent-secondary-dk p-1 m-1 uppercase hover:bg-corn-50 hover:border-accent-secondary-dk hover:text-accent-secondary-dk border-2 border-solid uppercase">ADD
      </button>
    </div>
    <textarea v-model="BuilderArrString" class="border border-solidn bg-corn-50 border-accent-primary-dk" rows="4" cols="100"/>
    <gCSSSelectorV3 v-for="(picker,index) in $data.builderArr"
        :key="index"
        :dataObj="picker"
        class="css_selector border-b-2"
        @change="updateStyleObj($event,index)"/>
    <div>
    </div>
    <hr>
  </div>
</template>
<script>
import gCSSSelectorV3 from './gCSSSelectorV3'
import Vue from "vue";

export default {
  name: "gPageStyler",
  components: {gCSSSelectorV3},
  data: function () {
    return {
      builderArr: [false],
    }
  },
  props: {
    id: {
      type: [Number],
      default: 4344344,
      required: false
    },
  },
  mounted() {
    this.$data.builderArr = this.BuilderArr
    this.updateStyleObj({_directive: this.$data.builderArr, styleObj: this.$data.builderArr})
  },
  computed: {
    BuilderArrString() {
      return JSON.stringify(this.$data.builderArr)
    },
    BuilderArr: {
      get: function () {
        const value = this.$store.get(`page_styler2/stylerArr.${this.$props.id}.data`)
        return (value) ? value : [false]
      },
      set: function (value) {
        this.$store.set(`page_styler2/stylerArr.*`, {id: this.$props.id, data: value})
      }
    }
  },
  methods: {
    /* * Add new style object to builderArr * */
    addStyleObj() {
      Vue.set(this.$data.builderArr, this.$data.builderArr.length, false)
    },
    updateStyleObj(dataObj, index = -1) {
      const {_directive = [false], styleObj = false} = dataObj
      if (index == -1) {
        Vue.set(this.$data, 'builderArr', styleObj)
        this.BuilderArr = this.$data.builderArr
        this.$emit('change', styleObj)
      } else {
        Vue.set(this.$data.builderArr, index, styleObj)
        this.BuilderArr = this.$data.builderArr
        this.$emit('change', _directive)
      }
    },
  },
}
</script>
