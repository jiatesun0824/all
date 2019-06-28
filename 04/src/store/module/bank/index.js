export default {
    namespaced: true, // 声明模块可重复封装利用
    state: {
        haveBank: false, // 用户是否有银行卡
        selbank: {
            bankName: ''
        }, // 用户所选择的银行
        bankdata: {}, // 银行卡持有人信息
        bankList: [], // 可选择的银行卡列表
    },
    mutations: {
        setHaveBank(state, data) {
            state.haveBank = data;
        },
        selBank(state, data) {
            state.selbank = data
        },
        setBankData(state, data) {
            state.bankdata = data
        },
        setBankList(state, data) {
            state.bankList = data;
        }
    },
    getters: {
        haveBank: state => state.haveBank,
        selbank: state => state.selbank,
        bankdata: state => state.bankdata,
        bankList: state => state.bankList
    },
    actions: {
        // 设置用户是否有银行卡
        setHaveBank({ commit }, data) {
            commit('setHaveBank', data);
        },
        // 设置用户所选择的银行
        selBank({ commit }, data) {
            commit('selBank', data);
        },
        // 设置银行卡持有人
        setBankData({ commit }, data) {
            commit('setBankData', data)
        },
        // 设置可选择的银行卡列表
        setBankList({ commit }, data) {
            commit('setBankList', data)
        }
    }
};