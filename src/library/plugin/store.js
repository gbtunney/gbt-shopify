import Vuex from 'vuex'
import Vue from "vue"
import  {getAppVuexModules, getAppVuexPlugins} from "./gVueUtils.plugin";


//todo: move
Vue.use(Vuex)
export const store = new Vuex.Store({
  state: {
    test: "hello",
  },
  mutations: {},
  actions: {},
  modules: getAppVuexModules(),
  plugins: getAppVuexPlugins()
})
export default store;
