import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from "vuex";

import {gVueUtils} from "./library/plugin/gVueUtils.plugin";
import init from "./library/plugin/init"
import store from './library/plugin/store'

/* * STYLES * */
import './library/styles/scss/tailwind.scss'
import './library/styles/project/project.scss'
import 'vue-select/dist/vue-select.css'

const LOGGING = true;
Vue.config.productionTip = false
Vue.use(Vuex)

import Vuetify, {
    VApp, // required
    VDataTable,
} from 'vuetify/lib'

Vue.use(Vuetify, {
    components: {
        VApp,
        VDataTable,
    },
})

Vue.use(gVueUtils, init)

new Vue({
    router,
    store,
    vuetify: new Vuetify({}),
    render: h => h(App)
}).$mount('#app')
