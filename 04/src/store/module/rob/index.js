export default {
    namespaced: true, // 声明模块可重复封装利用
    state: {
        isCancle: false, // 是否有订单被取消
        isPaySuc: false, // 是否有订单被支付成功

    },
    mutations: {
        setIsCancle(state, data) {
            state.isCancle = data
        },
        setIsPaySuc(state, data) {
            state.isPaySuc = data
        }
    },
    getters: {
        isCancle: state => state.isCancle,
        isPaySuc: state => state.isPaySuc
    },
    actions: {
        setIsCancle({ commit }, data) {
            commit('setIsCancle', data);
        },
        setIsPaySuc({ commit }, data) {
            commit('setIsPaySuc', data);
        }
    }
}