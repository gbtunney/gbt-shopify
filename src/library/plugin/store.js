import Vuex from 'vuex'
import  {getAppVuexModules, getAppVuexPlugins} from "./gVueUtils.plugin";
import Vue from "vue";

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
