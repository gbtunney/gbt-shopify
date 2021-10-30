import Vuex from 'vuex'
import  {getAppVuexModules, getAppVuexPlugins} from "../library/plugin/gVueUtils.plugin";

//todo: move

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
