import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from "vuex";

/* * STYLES * */
//import './library/styles/scss/tailwind.scss'
//import './library/styles/project/project.scss'
import 'vue-select/dist/vue-select.css'

/* * 3rd party plugins * */
import VTooltip from "v-tooltip";
import Clipboard from 'v-clipboard'
Vue.use(VTooltip)
Vue.use(Clipboard)

/* * Custom Project Vue Init Stuff * */
import {gVueUtils} from "./library/plugin/gVueUtils.plugin";
import init from "./library/plugin/init"
import store from './library/store'
Vue.use(gVueUtils,init)
Vue.use(Vuex)

// if ( R.has('WEBFONT_CONFIG')(mergedSettings) )WebFont.load(R.prop('WEBFONT_CONFIG', mergedSettings));
//const LOGGING = true;

Vue.config.productionTip = false

//todo: figure out how to make vuetify local.
import Vuetify, {
    VApp,
    VDataTable,
    // required
} from 'vuetify/lib'
Vue.use(Vuetify, {
    components: {
        VApp,
        VDataTable,
    },
})

new Vue({
    router,
    store,
    vuetify: new Vuetify({}),
    render: h => h(App)
}).$mount('#app')
