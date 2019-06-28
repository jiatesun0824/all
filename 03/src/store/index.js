import Vuex from 'vuex'
import Vue from 'vue'
import main from './main'
import cutprice from './cutprice'
import festivalActivity from './festivalActivity'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {},
  getters: {},
  actions: {},
  mutations: {},
  modules: {
    main,
    cutprice,
    festivalActivity
  }
})
export default store
