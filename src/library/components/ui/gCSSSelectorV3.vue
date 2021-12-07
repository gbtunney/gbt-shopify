<template>
  <div class="gCSSSelector">
    <h5 class="font-bold">ID :: {{ $data.id }}</h5>
    <div class="flex">
      <h6>Variant</h6>
      <v-select ref="variant"  style="width: 85px;"
          :options="[false, 'hover' ,'sm','md','lg','xl','2xl','3xl']"
          v-model="$data.variant"
          :disabled="$data.disabled"
          :clearable="false"
      />
      <h6>Type:</h6>
      <v-select
          v-model="$data.type"
          :options="['root' ,'sibling','parent','children']"
          :clearable="false"
          :disabled="$data.disabled"
          style="width: 150px;"
      />
      <h6>Classes:</h6>
      <v-select style="width: 50%;"
          :options="$options.GetSelectors()"
          multiple
          taggable
          v-model="value"
          @option:selected="_updateStyle"
          @option:deselected="_removeStyle($event,'remove' )"/>
      <div class="flex" v-show="$data.type=='sibling' || $data.type=='children'">
        <h6>Selector</h6>
        <v-select style="width: 75px;" :disabled="$data.disabled"
            taggable :clearable="false" :options="['*', '*:last-child' ,'*:first-child','md','lg','xl','2xl','3xl']"
            v-model="$data.selector"
        />
        <input type="text" v-if="false" :disabled="$data.disabled" class="border-2 text-lg border-primary bg-accent-primary" v-model="$data.selector"/>
        <hr>
        <h6>Limit</h6>
        <input :disabled="$data.disabled" type="number" class="bg-accent-primary border-2 text-lg" min="0" v-model="$data.limit">
      </div>
    </div>
  </div>
</template>

<script>
import selectors from './../../data/selectors.json'
import vSelect from 'vue-select'
import {randomInt, renameKeys} from "./../../scripts/generic";
import {outertrimFunc} from "../../scripts/generic";
const R = window.R
const RA = window.RA

export default {
  name: "gCSSSelector222",
  components: {vSelect},
  data: function () {
    return {
      disabled: false,
      type: 'root',
      variant: false,
      value: false,
      selector: "*",
      limit: false,
      _selectors: Object.freeze(R.take(2000, selectors.simpleSelectors.classes))
    }
  },
  props: {
    dataObj: {
      type: [Object, Boolean],
      default: false,
    },
    id: {
      type: [Number],
      default: randomInt(10, 15000),
    }
  },
  watch: {
    dataObj: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue !== false && RA.isObjectLike(newValue)) {
          const that = this;
          Object.entries(newValue).forEach(function ([key, value]) {
            that.$data[key] = value
            if (key == "classes") that.$data.value = value
          })
          this._setDisabled()
        }
      }
    }
  },
  GetSelectors() {
    return Object.freeze(selectors.simpleSelectors.classes.map(function (item) {
      return outertrimFunc(item, ['.', "'", '"', ' ', "[", "]", "(", ")"])
    }))
  },
  methods: {
    _setDisabled(){
      if (this.StyleArr && this.StyleArr.length == 0) this.$data.disabled = false
      else this.$data.disabled = true
    },
    _updateStyle: function (newitem, operation = 'add') {
      let _arr = [];
      //the filter shoud be ignored sometimes? idk..
      this._setDisabled()
      this.$emit('change',
          {
            _directive: {...this.DataObject, operation: operation},
            styleObj: {...this.DataObject, operation: operation}
          }
      )
    },
    _removeStyle: function (newitem, operation = 'remove') {
      //the filter shoud be ignored sometimes? idk..
      this._setDisabled()
      this.$emit('change',
          {
            _directive: {
              ...this.DataObject,
              classes: [newitem],
              operation: operation
            },
            styleObj: {...this.DataObject, operation:  "add"}
          })
    },
  },
  computed: {
    DataObject(){
      return {
        variant: this.$data.variant,
        type: this.$data.type,
        selector: this.$data.selector,
        limit: this.$data.limit,
        id: this.$props.id,
        classes: this.StyleArr,
      }
    },
    StyleArr: function () {
      if (!this.$data.value) return
      const that = this;
      return this.$data.value.map(function (item) {
        return `${item}`
      })
    },
  },
}
</script>
