<template>
  <fragment>
    <div>
      <ul v-tw='$data.selectorTest'>
        <li>I AM A HHHEADLINEHeadline test</li>
        <li>Item 2</li>
        <li>item 3</li>
        <li>item 4</li>
      </ul>
      <button> Element 4</button>
      <button class="test"> Element 5</button>
      <button> Element 6</button>
    </div>
    <g-page-styler @change="$data.selectorTest=$event"></g-page-styler>
    <div>
      <!--
            <button v-faker:internet.uppercase="'email'" ><span>Element 2</span>  <inline-svg src="/svg/leaves-a.svg"/></button>
            <button v-tw='[{"variant":false,"type":"root","selector":"*","classes":[".bg-accent-primary-dk"],"limit":false,"operation":"add"},{"variant":"hover","type":"root","selector":"*","classes":[".bg-accent-secondary-lt"],"limit":false,"operation":"add"}]'> Element 3 </button>
            <button> Element 4 </button>
            <button class="test" > Element 5 </button>
            <button > Element 6 </button>-->
    </div>
  </fragment>
</template>
<script>
import gCSSSelectorV3 from '../library/components/ui/gCSSSelectorV3'
import InlineSvg from 'vue-inline-svg';
import {Fragment} from 'vue-fragment'
import gPageStyler from '../library/components/ui/gPageStyler'

export default {
  name: "DirectiveTest",
  components: {gCSSSelectorV3, InlineSvg, Fragment, gPageStyler},
  data: function () {
    return {
      selectorTest: false
    }
  },
}
</script>
