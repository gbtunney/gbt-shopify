import Vue from 'vue'
import Vuex from "vuex";

/* * STYLES * */
import './../library/styles/scss/tailwind.scss'
import './../library/styles/project/project.scss'
import 'vue-select/dist/vue-select.css'

/* * 3rd party plugins * */
import VTooltip from "v-tooltip"
import Clipboard from 'v-clipboard'
import Banshee from 'banshee-ui'
Vue.use(VTooltip)
Vue.use(Clipboard)
Vue.use(Banshee)

/* * Custom Project Vue Init Stuff * */
import {gVueUtils} from "./../library/plugin/gVueUtils.plugin";
import init from "./../library/plugin/init"
import store from './../library/store'
Vue.use(gVueUtils,init)
Vue.use(Vuex)

export default previewComponent => {
    // https://vuejs.org/v2/guide/render-function.html
    return {
        store,
        render(createElement) {
            return createElement(previewComponent)
        }
    }
}
