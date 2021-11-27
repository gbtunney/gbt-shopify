<template>
  <div class="gPageStyler">
    <textarea v-model="BuilderArr" class="border border-solid border-accent-primary-dk" rows="4" cols="50"/>
    <button ref="clipboardbbtn" @click="$clipboard(BuilderArr)">
      Copy to clipboard
    </button>
    <button @click="addStyleObj" class="bg-accent-secondary-dk text--white font-bold">ADD</button>
    <gCSSSelectorV3 v-for="(picker,index) in $data.builderArr" :key="index" @removeAll="removeStyleObj($event,index)"  @change="updateStyleObj($event,index)"/>
 <div>
    <fragment>
   <slot>
     MRS SMITHS
   </slot>
 </fragment>
 </div>
  </div>
</template>
<script>
import { Fragment } from 'vue-fragment'

import gCSSSelectorV3 from '../library/components/ui/gCSSSelectorV3'
import Vue from "vue";
export default {
  name: "gPageStyler",
  components: {gCSSSelectorV3,Fragment},
  data: function () {
    return {
      builderArr: [ false ],
    }
  },
  computed:{
    BuilderArr(){
      return JSON.stringify(this.$data.builderArr)
    }
  },
  methods:{
    addStyleObj(){
      console.log("SETTING@!!!!!!!!!!!!!!!!" ,this.$data.builderArr,this.$data.builderArr.length)
      Vue.set(this.$data.builderArr, this.$data.builderArr.length, false)
    },
    removeStyleObj(styleObj, index){
      console.log("STYLE OBJECT REMOVEDDDDDDD",styleObj,index,this.$data.builderArr.splice(index,1))

      Vue.set(this.$data, 'builderArr',  this.$data.builderArr.splice(index,1,0))
      // this.$data.selectorTest = styleObj
    },
    updateStyleObj(styleObj, index){
      console.log("STYLE OBJECT CHANGED",styleObj,index)

      Vue.set(this.$data.builderArr, index, styleObj)
      // this.$data.selectorTest = styleObj
    }},
  props: {
    targetEl: {
      type: [String, Boolean],
      default: false,
      required: false
    },
  },
  methods:{
    _applyToTargetEl(_el) {
      document.querySelectorAll(el).forEach(el => {
        let classes = el.classList;
        classes.forEach(function (_item) {

          if (that.cleanClassname(EL) != _item) {
            classes.remove(_item)
          }
        })
        classes.add(...Items)

      })
    }
  },

  watch:{
    targetEl: {
      immediate: true,
      handler(newValue , oldValue) {
        if (newValue !=false ){
          console.log("THHE VNODE IS!!!" , document.getElementById('app').__vue__)

        }
        console.log(" prop changed from " + oldValue + " to " + newValue)
      }
    }
  }

}
</script>
