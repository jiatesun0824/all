import { serviceDetail } from 'api/service'

export default {
      // 声明模块可重复封装利用
      namespaced: true,
      state: {
        //   接口返回值
        tcdetail: {},
        shopId:{
            'id':1
        }
      },
      mutations: {
        getShopDetail(state, data) {
            state.tcdetail = data;
        },
        setShopId(state, shopId) {
            state.shopId = shopId
        },
    },
    getters: {
        tcdetail: state => state.tcdetail,
        shopId: state => state.shopId
    },
    actions: {
        // 获取店铺详情
        async queryShopDetail({ commit, getters }) {
            let  data  = await serviceDetail(getters.shopId)
            commit("getShopDetail", data.data)
        },
        // 设置店铺ID
        setShopId({ commit }, shopId ) {
            commit("setShopId", shopId)
        },
    }
}