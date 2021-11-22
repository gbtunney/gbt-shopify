<template>
  <div class="gCSSSelector">
    <h2>CSS Selectors</h2>
    <textarea v-model="StyleString" rows="4" cols="50"/>
    <v-select
        :options="Selectors"
        multiple
        v-model="value"
        @option:selected="_updateStyle"
        @option:deselected="_updateStyle($event,false )"/>
    <input v-model="$data.childselector" placeholder="edit me">
    <button @click="updateChildSelector"> child selector!!!!</button>
  </div>
</template>

<script>
import selectors from '@/assets/selectors.json'
import vSelect from 'vue-select'

export default {
  name: "gCSSSelector222",
  components: {vSelect},
  props: {
    targetEl: {
      type: [String, Boolean],
      default: false,
      required: false
    },
  },
  data: function () {
    return {value: false,
      childselector: false }
  },
  methods: {
    cleanClassname(_classname) {
      const no_spaces = `${_classname.replace(' ', '')}`
      return `${no_spaces.replace('.', '')}`
    },
    cleanDOMTokenList(el, items = []) {
      const Items = items;
      const EL = el;
      const that = this;

      document.querySelectorAll(el).forEach(el => {
        let classes = el.classList;
        classes.forEach(function (_item) {

          if (that.cleanClassname(EL) != _item) {
            classes.remove(_item)
          }
        })
        classes.add(...Items)

      })
    },
    updateChildSelector:function(){
      if ( this.$data.childselector ){
        const _dataObj = {
          children: [{[this.$data.childselector] : this.StyleArr }]
        }
      }
    },
    _updateStyle: function (newitem, doFilter = true) {
      let _arr = [];
      //the filter shoud be ignored sometimes? idk..
      let dataObj = {
        classes: this.StyleArr
      }
      if (this.$data.childselector) {
        dataObj = {
          children: [{[this.$data.childselector]: this.StyleArr}],
          classes: ' border-8 opacity-50 '
        }
      }
      this.$emit('change', dataObj)

    },
    filterStyleArr: function (newitem) {
      if (!newitem || newitem.length == 0) return
      const lastItem = this.cleanClassname(newitem[newitem.length - 1])
      const prefix = (lastItem.split("-").length > 0) ? lastItem.split("-")[0] : false
      const that = this;
      let styleArr = [...this.StyleArr]

      if (prefix) {
        return styleArr.filter(function (item) {
          if (item == lastItem) {
            return true
          }
          if (item.startsWith(prefix, 0)) return false
          return true
        })
      }
    },
  },
  computed: {
    Selectors: function () {
      return selectors.simpleSelectors.classes
    },
    StyleArr: function () {
      if (!this.$data.value) return
      const that = this;
      //loop thhru the class item.
      return this.$data.value.map(function (item) {
        return `${that.cleanClassname(item)}`
      })
    },
    StyleString: function () {
      if (!this.$data.value) return;
      const that = this;
      return this.$data.value.reduce((accumulator, currentValue, currentIndex, array) => {
        accumulator += `${that.cleanClassname(currentValue)} `
        return accumulator
      }, new String(' '));
    }
  },
}
</script>
