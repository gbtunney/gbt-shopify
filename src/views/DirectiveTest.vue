<template>
  <fragment>
    <h1 ><button @click="$clipboard('gilllian')">DirectiveTest</button></h1>
    <textarea v-model="BuilderArr" class="border border-solid border-accent-primary-dk" rows="4" cols="50">

</textarea>
    <button ref="clipboardbbtn" @click="$clipboard(BuilderArr)">
      Copy to clipboard
    </button>
    <button @click="addStyleObj" class="bg-accent-secondary-dk text--white font-bold">ADD</button>
    <gCSSSelectorV3 v-for="(picker,index) in $data.builderArr" :key="index" @removeAll="removeStyleObj($event,index)"  @change="updateStyleObj($event,index)">

    </gCSSSelectorV3>
    <div>
      <button v-faker:internet.uppercase="'email'" v-tw="builderArr" ><span>Element 2</span>  <inline-svg src="/svg/leaves-a.svg"/></button>
      <button v-tw='[{"variant":false,"type":"root","selector":"*","classes":[".bg-accent-primary-dk"],"limit":false,"operation":"add"},{"variant":"hover","type":"root","selector":"*","classes":[".bg-accent-secondary-lt"],"limit":false,"operation":"add"}]'> Element 3 </button>
      <button> Element 4 </button>
      <button class="test" > Element 5 </button>
      <button > Element 6 </button>
    </div>

  </fragment>



</template>
<script>
import gCSSSelectorV3 from '../library/components/ui/gCSSSelectorV3'
import Vue from "vue";
import InlineSvg from 'vue-inline-svg';
import { Fragment } from 'vue-fragment'

export default {
  name: "DirectiveTest",
  components: { gCSSSelectorV3,InlineSvg,Fragment},
  data: function () {
    return {
      builderArr: [ false, false ],
      selectorTest:false
    }
  },
  computed:{
    BuilderArr(){
      return JSON.stringify(this.$data.builderArr)
    }
  },
  mounted(){
    console.log("MOUNTED@@@@@@ @!!!!!!!!!!!!!!!!" ,this.$refs,this)


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
     // this.$data.selectorTest = styleObj@click="$clipboard(BuilderArr)"
    }
  },
  props: {}
}
</script>
