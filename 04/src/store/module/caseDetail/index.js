const SET_CASE_DETAILS = 'SET_CASE_DETAILS';

export default {
    namespaced: true,
    state: {
        caseDetails: {},
        displayType: 0, // 0 , 一键方案 1， 样板方案
    },
    mutations: {
        [SET_CASE_DETAILS](state, data) {
            state.caseDetails = data
        },
        setDisplayType(state, data) {
            state.displayType = data
        }

    },
    getters: {
        caseDetails: state => state.caseDetails,
        displayType: state => state.displayType
    },
    actions: {
        setCaseDetail({ commit }, data) {
            commit(SET_CASE_DETAILS, data)
        },
        setDisplayType({ commit }, data) {
            commit('setDisplayType', data)
        }
    }
};