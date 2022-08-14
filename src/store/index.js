import  Vue from  'vue'
import Vuex from 'vuex'
import {ADD_CART, ADD_COUNTER} from "./mutations-types";

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 1. 安装插件
Vue.use(Vuex)

const state = {
  cartList: []
}

// 2. 插件Store对象
const Store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

// 3. 挂载到Vue实例中
export default Store
